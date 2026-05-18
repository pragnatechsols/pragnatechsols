import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { LeadStatus, LeadPriority } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/leads/[id] - Get single lead with notes
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get lead
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Get notes/activity timeline
    const { data: notes, error: notesError } = await supabaseAdmin
      .from('lead_notes')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false });

    if (notesError) {
      console.error('Error fetching notes:', notesError);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...lead,
        notes: notes || [],
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/leads/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/leads/[id] - Update lead
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      lead_status,
      priority,
      follow_up_date,
      assigned_to,
      assigned_to_name,
      admin_name, // For activity logging
    } = body as {
      lead_status?: LeadStatus;
      priority?: LeadPriority;
      follow_up_date?: string;
      assigned_to?: string;
      assigned_to_name?: string;
      admin_name?: string;
    };

    // Get current lead data for activity logging
    const { data: currentLead } = await supabaseAdmin
      .from('leads')
      .select('lead_status, priority, assigned_to_name')
      .eq('id', id)
      .single();

    const updates: Record<string, unknown> = {};
    const activityLogs: Array<{ note: string; activity_type: string }> = [];

    if (lead_status !== undefined && lead_status !== currentLead?.lead_status) {
      updates.lead_status = lead_status;
      activityLogs.push({
        note: `Status changed from "${currentLead?.lead_status}" to "${lead_status}"`,
        activity_type: 'status_change',
      });
    }

    if (priority !== undefined && priority !== currentLead?.priority) {
      updates.priority = priority;
      activityLogs.push({
        note: `Priority changed from "${currentLead?.priority}" to "${priority}"`,
        activity_type: 'priority_change',
      });
    }

    if (follow_up_date !== undefined) {
      updates.follow_up_date = follow_up_date;
      activityLogs.push({
        note: `Follow-up date set to ${follow_up_date}`,
        activity_type: 'follow_up',
      });
    }

    if (assigned_to !== undefined) {
      updates.assigned_to = assigned_to;
      updates.assigned_to_name = assigned_to_name;
      activityLogs.push({
        note: `Lead assigned to ${assigned_to_name || 'Unassigned'}`,
        activity_type: 'assignment',
      });
    }

    // Update lead
    const { data, error } = await supabaseAdmin
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update lead' },
        { status: 500 }
      );
    }

    // Add activity logs
    if (activityLogs.length > 0 && admin_name) {
      await supabaseAdmin.from('lead_notes').insert(
        activityLogs.map((log) => ({
          lead_id: id,
          admin_name,
          note: log.note,
          activity_type: log.activity_type,
        }))
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in PATCH /api/admin/leads/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/leads/[id] - Soft delete lead
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('leads')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/leads/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
