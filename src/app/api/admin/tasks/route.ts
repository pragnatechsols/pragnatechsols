import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { Task, PaginatedResponse } from '@/types';

// GET /api/admin/tasks - Get all tasks (admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const assignee_id = searchParams.get('assignee_id');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('tasks')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false);

    if (status) query = query.eq('status', status);
    if (assignee_id) query = query.eq('assignee_id', assignee_id);
    if (priority) query = query.eq('priority', priority);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    query = query.order('created_at', { ascending: false });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch tasks' }, { status: 500 });
    }

    const response: PaginatedResponse<Task> = {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error('Error in GET /api/admin/tasks:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, assignee_id, assignee_name, status, priority, due_date } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .insert({
        title: title.trim(),
        description: description || null,
        assignee_id: assignee_id || null,
        assignee_name: assignee_name || null,
        status: status || 'open',
        priority: priority || 'medium',
        due_date: due_date || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return NextResponse.json({ success: false, error: 'Failed to create task' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/admin/tasks:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
