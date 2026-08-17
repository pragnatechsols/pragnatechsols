import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyTeamRequest } from '@/lib/team-auth';
import type { Task, TaskNote } from '@/types';

// GET /api/team/tasks - Tasks assigned to the logged-in team member, with notes.
export async function GET(request: NextRequest) {
  const member = await verifyTeamRequest(request);
  if (!member) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const { data: tasks, error } = await supabaseAdmin
    .from('tasks')
    .select('*')
    .eq('assignee_id', member.id)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching team tasks:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tasks' }, { status: 500 });
  }

  const taskList = (tasks || []) as Task[];
  const ids = taskList.map((t) => t.id);

  let notesByTask: Record<string, TaskNote[]> = {};
  if (ids.length > 0) {
    const { data: notes } = await supabaseAdmin
      .from('task_notes')
      .select('*')
      .in('task_id', ids)
      .order('created_at', { ascending: true });

    notesByTask = (notes || []).reduce((acc: Record<string, TaskNote[]>, n: TaskNote) => {
      (acc[n.task_id] ||= []).push(n);
      return acc;
    }, {});
  }

  const data = taskList.map((t) => ({ ...t, notes: notesByTask[t.id] || [] }));

  return NextResponse.json({ success: true, data });
}
