import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/auth';
import type { TaskStatus } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
};

// PATCH /api/admin/tasks/[id] - Update task
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updatable = [
      'title',
      'description',
      'assignee_id',
      'assignee_name',
      'status',
      'priority',
      'due_date',
    ];

    const updates: Record<string, unknown> = {};
    for (const key of updatable) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    // Snapshot current values so we can log meaningful activity after the update.
    const { data: previous } = await supabaseAdmin
      .from('tasks')
      .select('status, assignee_name')
      .eq('id', id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return NextResponse.json({ success: false, error: 'Failed to update task' }, { status: 500 });
    }

    // Log notable changes to the notes thread so they surface in the dashboard feed.
    const activity: string[] = [];
    const newStatus = updates.status as TaskStatus | undefined;
    if (newStatus && previous && previous.status !== newStatus) {
      activity.push(`Status changed to ${STATUS_LABELS[newStatus] || newStatus}`);
    }
    if (
      updates.assignee_name !== undefined &&
      previous &&
      previous.assignee_name !== updates.assignee_name
    ) {
      activity.push(`Reassigned to ${(updates.assignee_name as string) || 'Unassigned'}`);
    }

    if (activity.length > 0) {
      await supabaseAdmin.from('task_notes').insert(
        activity.map((note) => ({
          task_id: id,
          author_type: 'admin',
          author_id: admin.id,
          author_name: admin.name || 'Admin',
          note,
        }))
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in PATCH /api/admin/tasks/[id]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/tasks/[id] - Soft delete task
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('tasks')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      return NextResponse.json({ success: false, error: 'Failed to delete task' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/tasks/[id]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
