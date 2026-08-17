import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyTeamRequest } from '@/lib/team-auth';
import type { TaskStatus } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: TaskStatus[] = ['open', 'in_progress', 'done'];
const STATUS_LABELS: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  done: 'Done',
};

// PATCH /api/team/tasks/[id] - Team member updates status of their own task.
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const member = await verifyTeamRequest(request);
  if (!member) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body?.status as TaskStatus | undefined;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
  }

  // Ownership check
  const { data: task } = await supabaseAdmin
    .from('tasks')
    .select('id, assignee_id, status')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (!task || task.assignee_id !== member.id) {
    return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating team task status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update task' }, { status: 500 });
  }

  // Log the status change to the notes thread so admins see the activity.
  if (task.status !== status) {
    await supabaseAdmin.from('task_notes').insert({
      task_id: id,
      author_type: 'member',
      author_id: member.id,
      author_name: member.name,
      note: `Status changed to ${STATUS_LABELS[status]}`,
    });
  }

  return NextResponse.json({ success: true, data });
}
