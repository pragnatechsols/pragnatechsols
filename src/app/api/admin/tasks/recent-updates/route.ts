import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/auth';

// GET /api/admin/tasks/recent-updates - Latest task notes across all tasks,
// with task title, for the admin dashboard "Recent task updates" feed.
export async function GET(request: NextRequest) {
  const admin = await verifyAdminRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '8', 10);

  // Pull a generous window of recent notes, then collapse to the single latest
  // note per task so the dashboard shows one line per task (not one per edit).
  const { data: notes, error } = await supabaseAdmin
    .from('task_notes')
    .select('id, task_id, author_type, author_name, note, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    console.error('Error fetching recent task updates:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch updates' }, { status: 500 });
  }

  // Notes arrive newest-first, so the first note seen for a task is its latest.
  const latestPerTask: typeof notes = [];
  const seenTasks = new Set<string>();
  for (const n of notes || []) {
    if (seenTasks.has(n.task_id)) continue;
    seenTasks.add(n.task_id);
    latestPerTask.push(n);
  }
  const noteList = latestPerTask.slice(0, limit);
  const taskIds = [...new Set(noteList.map((n) => n.task_id))];

  const titles: Record<string, string> = {};
  const statuses: Record<string, string> = {};
  if (taskIds.length > 0) {
    const { data: tasks } = await supabaseAdmin.from('tasks').select('id, title, status').in('id', taskIds);
    for (const t of tasks || []) {
      titles[t.id] = t.title;
      statuses[t.id] = t.status;
    }
  }

  const data = noteList.map((n) => ({
    ...n,
    task_title: titles[n.task_id] || 'Task',
    task_status: statuses[n.task_id] || null,
  }));

  return NextResponse.json({ success: true, data });
}
