import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { deleteFile } from '@/lib/cloudinary';
import type { ApplicationStatus } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/applications/[id] - Get single application with comments
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get application with job details
    const { data: application, error: appError } = await supabaseAdmin
      .from('job_applications')
      .select(`
        *,
        job:jobs(id, title, department, location, employment_type, experience)
      `)
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // Get comments
    const { data: comments, error: commentsError } = await supabaseAdmin
      .from('application_comments')
      .select('*')
      .eq('application_id', id)
      .order('created_at', { ascending: false });

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...application,
        comments: comments || [],
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/applications/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/applications/[id] - Update application status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, admin_name } = body as { status?: ApplicationStatus; admin_name?: string };

    const updates: Record<string, unknown> = {};

    if (status !== undefined) {
      updates.status = status;
    }

    const { data, error } = await supabaseAdmin
      .from('job_applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating application:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update application' },
        { status: 500 }
      );
    }

    // Add status change comment
    if (status && admin_name) {
      await supabaseAdmin.from('application_comments').insert({
        application_id: id,
        admin_name,
        comment: `Status changed to "${status}"`,
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in PATCH /api/admin/applications/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/applications/[id] - Soft delete application
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get application to find Cloudinary ID
    const { data: application } = await supabaseAdmin
      .from('job_applications')
      .select('resume_cloudinary_id')
      .eq('id', id)
      .single();

    // Delete from Cloudinary
    if (application?.resume_cloudinary_id) {
      await deleteFile(application.resume_cloudinary_id);
    }

    // Soft delete
    const { error } = await supabaseAdmin
      .from('job_applications')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      console.error('Error deleting application:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete application' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/applications/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
