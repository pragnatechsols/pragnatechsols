import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { Service, PaginatedResponse } from '@/types';

// GET /api/admin/services - Get all services (admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('services')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false);

    if (search) {
      query = query.or(`title.ilike.%${search}%,short_desc.ilike.%${search}%`);
    }

    query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: true });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching services:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
    }

    const response: PaginatedResponse<Service> = {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error('Error in GET /api/admin/services:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/services - Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      short_desc,
      description,
      features,
      icon_name,
      icon_image_url,
      icon_cloudinary_id,
      gradient,
      sort_order,
      is_active,
    } = body;

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const generatedSlug =
      (slug && String(slug).trim()) ||
      String(title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const { data, error } = await supabaseAdmin
      .from('services')
      .insert({
        title,
        slug: generatedSlug,
        short_desc: short_desc || null,
        description: description || null,
        features: features || [],
        icon_name: icon_name || null,
        icon_image_url: icon_image_url || null,
        icon_cloudinary_id: icon_cloudinary_id || null,
        gradient: gradient || 'from-amber-400 to-orange-500',
        sort_order: sort_order ?? 0,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating service:', error);
      return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/admin/services:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
