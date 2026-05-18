import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/admin/enquiries/[id]/comments - Add comment to enquiry
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { comment, admin_name } = body as { comment: string; admin_name: string };

    if (!comment || !admin_name) {
      return NextResponse.json(
        { success: false, error: 'Comment and admin name are required' },
        { status: 400 }
      );
    }

    // Verify enquiry exists
    const { data: enquiry, error: enquiryError } = await supabaseAdmin
      .from('enquiries')
      .select('id')
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (enquiryError || !enquiry) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    // Add comment
    const { data, error } = await supabaseAdmin
      .from('enquiry_comments')
      .insert({
        enquiry_id: id,
        admin_name,
        comment,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding comment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to add comment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/admin/enquiries/[id]/comments:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/admin/enquiries/[id]/comments - Get all comments for an enquiry
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from('enquiry_comments')
      .select('*')
      .eq('enquiry_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/enquiries/[id]/comments:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
