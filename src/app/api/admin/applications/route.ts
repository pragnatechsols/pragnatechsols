import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { JobApplication, ApplicationFilters, PaginatedResponse } from '@/types';

// GET /api/admin/applications - Get all applications
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as ApplicationFilters['status'];
    const job_id = searchParams.get('job_id');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('job_applications')
      .select(`
        *,
        job:jobs(id, title, department, location)
      `, { count: 'exact' })
      .eq('is_deleted', false);

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    // Filter by job
    if (job_id) {
      query = query.eq('job_id', job_id);
    }

    // Search
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,current_company.ilike.%${search}%`
      );
    }

    // Sorting
    query = query.order(sortBy as keyof JobApplication, { ascending: sortOrder === 'asc' });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching applications:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    const response: PaginatedResponse<JobApplication> = {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error('Error in GET /api/admin/applications:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
