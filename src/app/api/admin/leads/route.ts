import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { Lead, LeadFilters, PaginatedResponse } from '@/types';

// GET /api/admin/leads - Get all leads with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as LeadFilters['status'];
    const priority = searchParams.get('priority') as LeadFilters['priority'];
    const assigned_to = searchParams.get('assigned_to');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false);

    // Filter by status
    if (status) {
      query = query.eq('lead_status', status);
    }

    // Filter by priority
    if (priority) {
      query = query.eq('priority', priority);
    }

    // Filter by assigned person
    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to);
    }

    // Search
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,company_name.ilike.%${search}%`
      );
    }

    // Sorting
    query = query.order(sortBy as keyof Lead, { ascending: sortOrder === 'asc' });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    const response: PaginatedResponse<Lead> = {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error('Error in GET /api/admin/leads:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/leads - Create new lead (manual)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      company_name,
      service_interested,
      message,
      priority,
      assigned_to,
      assigned_to_name,
    } = body;

    if (!full_name || !email || !phone || !service_interested) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        full_name,
        email,
        phone,
        company_name,
        service_interested,
        message,
        priority: priority || 'medium',
        assigned_to,
        assigned_to_name,
        lead_status: 'new_lead',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create lead' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/admin/leads:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
