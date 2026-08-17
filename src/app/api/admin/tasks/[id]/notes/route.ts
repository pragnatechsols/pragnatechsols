import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/tasks/[id]/notes - Get the notes thread for a task.
export async function GET(request: NextRequest, { params }: RouteParams) {
  const admin = await verifyAdminRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from('task_notes')
    .select('*')
    .eq('task_id', id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching task notes:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch notes' }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: data || [] });
}

// POST /api/admin/tasks/[id]/notes - Admin adds a note to a task.
export async function POST(request: NextRequest, { params }: RouteParams) {
  const admin = await verifyAdminRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const note = (body?.note as string | undefined)?.trim();

  if (!note) {
    return NextResponse.json({ success: false, error: 'Note is required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('task_notes')
    .insert({
      task_id: id,
      author_type: 'admin',
      author_id: admin.id,
      author_name: admin.name || 'Admin',
      note,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding admin task note:', error);
    return NextResponse.json({ success: false, error: 'Failed to add note' }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
