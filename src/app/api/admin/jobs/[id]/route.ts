import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/jobs/[id] - Get single job
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data: job, error } = await supabaseAdmin
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error || !job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    // Get application count for this job
    const { count } = await supabaseAdmin
      .from('job_applications')
      .select('*', { count: 'exact', head: true })
      .eq('job_id', id)
      .eq('is_deleted', false);

    return NextResponse.json({
      success: true,
      data: {
        ...job,
        application_count: count || 0,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/jobs/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/jobs/[id] - Update job
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      department,
      experience,
      location,
      employment_type,
      description,
      skills,
      salary_range,
      is_active,
    } = body;

    const updates: Record<string, unknown> = {};

    if (title !== undefined) updates.title = title;
    if (department !== undefined) updates.department = department;
    if (experience !== undefined) updates.experience = experience;
    if (location !== undefined) updates.location = location;
    if (employment_type !== undefined) updates.employment_type = employment_type;
    if (description !== undefined) updates.description = description;
    if (skills !== undefined) updates.skills = skills;
    if (salary_range !== undefined) updates.salary_range = salary_range;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating job:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update job' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in PATCH /api/admin/jobs/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/jobs/[id] - Soft delete job
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('jobs')
      .update({ is_deleted: true, is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting job:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete job' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/jobs/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
