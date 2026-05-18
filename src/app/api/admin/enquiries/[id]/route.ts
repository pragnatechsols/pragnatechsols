import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { EnquiryStatus } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/enquiries/[id] - Get single enquiry with comments
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Get enquiry
    const { data: enquiry, error: enquiryError } = await supabaseAdmin
      .from('enquiries')
      .select('*')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (enquiryError || !enquiry) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    // Get comments
    const { data: comments, error: commentsError } = await supabaseAdmin
      .from('enquiry_comments')
      .select('*')
      .eq('enquiry_id', id)
      .order('created_at', { ascending: false });

    if (commentsError) {
      console.error('Error fetching comments:', commentsError);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...enquiry,
        comments: comments || [],
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/enquiries/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/enquiries/[id] - Update enquiry status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, is_spam } = body as { status?: EnquiryStatus; is_spam?: boolean };

    const updates: Record<string, unknown> = {};

    if (status !== undefined) {
      updates.status = status;
      
      // If marking as lead, create a lead entry
      if (status === 'lead') {
        // First get the enquiry data
        const { data: enquiry } = await supabaseAdmin
          .from('enquiries')
          .select('*')
          .eq('id', id)
          .single();

        if (enquiry) {
          // Check if lead already exists for this enquiry
          const { data: existingLead } = await supabaseAdmin
            .from('leads')
            .select('id')
            .eq('enquiry_id', id)
            .single();

          if (!existingLead) {
            // Create new lead
            await supabaseAdmin.from('leads').insert({
              enquiry_id: id,
              full_name: enquiry.full_name,
              email: enquiry.email,
              phone: enquiry.phone,
              company_name: enquiry.company_name,
              service_interested: enquiry.service_interested,
              message: enquiry.message,
              lead_status: 'new_lead',
              priority: 'medium',
            });
          }
        }
      }
    }

    if (is_spam !== undefined) {
      updates.is_spam = is_spam;
      if (is_spam) {
        updates.status = 'spam';
      }
    }

    const { data, error } = await supabaseAdmin
      .from('enquiries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating enquiry:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update enquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in PATCH /api/admin/enquiries/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/enquiries/[id] - Soft delete enquiry
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from('enquiries')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) {
      console.error('Error deleting enquiry:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete enquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/enquiries/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
