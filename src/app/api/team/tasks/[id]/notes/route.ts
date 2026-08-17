import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyTeamRequest } from '@/lib/team-auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/team/tasks/[id]/notes - Team member adds a note to their own task.
export async function POST(request: NextRequest, { params }: RouteParams) {
  const member = await verifyTeamRequest(request);
  if (!member) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const note = (body?.note as string | undefined)?.trim();

  if (!note) {
    return NextResponse.json({ success: false, error: 'Note is required' }, { status: 400 });
  }

  // Ownership check
  const { data: task } = await supabaseAdmin
    .from('tasks')
    .select('id, assignee_id')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (!task || task.assignee_id !== member.id) {
    return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from('task_notes')
    .insert({
      task_id: id,
      author_type: 'member',
      author_id: member.id,
      author_name: member.name,
      note,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding team task note:', error);
    return NextResponse.json({ success: false, error: 'Failed to add note' }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
