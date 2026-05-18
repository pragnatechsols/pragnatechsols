import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/admin/applications/[id]/comments - Add comment to application
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { comment, admin_name } = body as { comment: string; admin_name: string };

    if (!comment || !admin_name) {
      return NextResponse.json(
        { success: false, error: 'Comment and admin name are required' },
        { status: 400 }
      );
    }

    // Verify application exists
    const { data: application, error: appError } = await supabaseAdmin
      .from('job_applications')
      .select('id')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // Add comment
    const { data, error } = await supabaseAdmin
      .from('application_comments')
      .insert({
        application_id: id,
        admin_name,
        comment,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to add comment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/admin/applications/[id]/comments:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/admin/applications/[id]/comments - Get all comments for an application
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from('application_comments')
      .select('*')
      .eq('application_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/applications/[id]/comments:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
