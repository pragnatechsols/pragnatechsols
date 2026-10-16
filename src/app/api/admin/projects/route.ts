import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireSuperAdmin } from '@/lib/auth';
import type { Project, PaginatedResponse } from '@/types';

// GET /api/admin/projects - Get all projects (admin)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin(request);
    if ('response' in auth) return auth.response;

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false);

    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,category.ilike.%${search}%`);
    }

    query = query.order('sort_order', { ascending: true }).order('created_at', { ascending: true });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
    }

    const response: PaginatedResponse<Project> = {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error('Error in GET /api/admin/projects:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin(request);
    if ('response' in auth) return auth.response;

    const body = await request.json();
    const { title, works, category, logo_url, logo_cloudinary_id, sort_order, is_active } = body;

    if (!title || !category) {
      return NextResponse.json(
        { success: false, error: 'Title and category are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        title,
        works: works || [],
        category,
        logo_url: logo_url || null,
        logo_cloudinary_id: logo_cloudinary_id || null,
        sort_order: sort_order ?? 0,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/admin/projects:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
