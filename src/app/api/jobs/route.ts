import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { Job, PaginatedResponse } from '@/types';

// GET /api/jobs - Get all active jobs (public)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const department = searchParams.get('department');
    const employment_type = searchParams.get('employment_type');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .eq('is_deleted', false);

    // Filter by department
    if (department) {
      query = query.eq('department', department);
    }

    // Filter by employment type
    if (employment_type) {
      query = query.eq('employment_type', employment_type);
    }

    // Search
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,department.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    // Sorting - newest first
    query = query.order('created_at', { ascending: false });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch jobs' },
        { status: 500 }
      );
    }

    const response: PaginatedResponse<Job> = {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
