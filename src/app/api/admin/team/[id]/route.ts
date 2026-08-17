import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/admin/team/[id] - Update team member
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.email !== undefined) {
      const normalizedEmail = (body.email as string | undefined)?.trim().toLowerCase();
      if (!normalizedEmail) {
        return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return NextResponse.json({ success: false, error: 'Please enter a valid email' }, { status: 400 });
      }
      // Ensure no other member uses this email
      const { data: clash } = await supabaseAdmin
        .from('team_members')
        .select('id')
        .eq('email', normalizedEmail)
        .eq('is_deleted', false)
        .neq('id', id)
        .maybeSingle();
      if (clash) {
        return NextResponse.json(
          { success: false, error: 'Another team member already uses this email' },
          { status: 400 }
        );
      }
      updates.email = normalizedEmail;
    }
    if (body.employee_id !== undefined) updates.employee_id = body.employee_id?.trim() || null;
    if (body.role !== undefined) updates.role = body.role;
    if (body.is_active !== undefined) updates.is_active = body.is_active;

    const { data, error } = await supabaseAdmin
      .from('team_members')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating team member:', error);
      return NextResponse.json({ success: false, error: 'Failed to update team member' }, { status: 500 });
    }

    // Keep the denormalized assignee_name on tasks in sync
    if (body.name !== undefined) {
      await supabaseAdmin.from('tasks').update({ assignee_name: body.name }).eq('assignee_id', id);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in PATCH /api/admin/team/[id]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/team/[id] - Soft delete team member
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('team_members')
      .update({ is_deleted: true, is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting team member:', error);
      return NextResponse.json({ success: false, error: 'Failed to delete team member' }, { status: 500 });
    }

    // Unassign this member from any open tasks (keeps assignee_name for history cleared)
    await supabaseAdmin
      .from('tasks')
      .update({ assignee_id: null, assignee_name: null })
      .eq('assignee_id', id);

    return NextResponse.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/team/[id]:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
