import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { deleteImage } from '@/lib/cloudinary';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/services/[id] - Get single service
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in GET /api/admin/services/[id]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/services/[id] - Update service
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatable = [
      'title',
      'slug',
      'short_desc',
      'description',
      'features',
      'icon_name',
      'icon_image_url',
      'icon_cloudinary_id',
      'gradient',
      'sort_order',
      'is_active',
    ];

    const updates: Record<string, unknown> = {};
    for (const key of updatable) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const { data, error } = await supabaseAdmin
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating service:', error);
      return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in PATCH /api/admin/services/[id]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/services/[id] - Soft delete service
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Best-effort cleanup of an uploaded icon image
    const { data: existing } = await supabaseAdmin
      .from('services')
      .select('icon_cloudinary_id')
      .eq('id', id)
      .single();

    if (existing?.icon_cloudinary_id) {
      await deleteImage(existing.icon_cloudinary_id);
    }

    const { error } = await supabaseAdmin
      .from('services')
      .update({ is_deleted: true, is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting service:', error);
      return NextResponse.json({ success: false, error: 'Failed to delete service' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/services/[id]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
