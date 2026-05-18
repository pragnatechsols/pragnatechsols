import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { Job, JobFilters, PaginatedResponse } from '@/types';

// GET /api/admin/jobs - Get all jobs (admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const department = searchParams.get('department');
    const employment_type = searchParams.get('employment_type') as JobFilters['employment_type'];
    const is_active = searchParams.get('is_active');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false);

    // Filter by department
    if (department) {
      query = query.eq('department', department);
    }

    // Filter by employment type
    if (employment_type) {
      query = query.eq('employment_type', employment_type);
    }

    // Filter by active status
    if (is_active !== null && is_active !== undefined) {
      query = query.eq('is_active', is_active === 'true');
    }

    // Search
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,department.ilike.%${search}%,location.ilike.%${search}%`
      );
    }

    // Sorting
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
    console.error('Error in GET /api/admin/jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/jobs - Create new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      department,
      experience,
      location,
      employment_type,
      description,
      skills,
      salary_range,
      is_active,
    } = body;

    if (!title || !department || !experience || !location || !employment_type || !description) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .insert({
        title,
        department,
        experience,
        location,
        employment_type,
        description,
        skills: skills || [],
        salary_range,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create job' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/admin/jobs:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
