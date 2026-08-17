import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { deleteImage } from '@/lib/cloudinary';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/projects/[id] - Get single project
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in GET /api/admin/projects/[id]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/admin/projects/[id] - Update project
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatable = [
      'title',
      'works',
      'category',
      'logo_url',
      'logo_cloudinary_id',
      'sort_order',
      'is_active',
    ];

    const updates: Record<string, unknown> = {};
    for (const key of updatable) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in PATCH /api/admin/projects/[id]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/projects/[id] - Soft delete project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: existing } = await supabaseAdmin
      .from('projects')
      .select('logo_cloudinary_id')
      .eq('id', id)
      .single();

    if (existing?.logo_cloudinary_id) {
      await deleteImage(existing.logo_cloudinary_id);
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .update({ is_deleted: true, is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/projects/[id]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
