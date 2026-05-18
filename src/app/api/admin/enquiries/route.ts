import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { Enquiry, EnquiryFilters, PaginatedResponse } from '@/types';

// GET /api/admin/enquiries - Get all enquiries with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as EnquiryFilters['status'];
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const includeSpam = searchParams.get('includeSpam') === 'true';

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('enquiries')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false);

    // Filter by status
    if (status) {
      if (status === 'spam') {
        query = query.eq('is_spam', true);
      } else {
        query = query.eq('status', status).eq('is_spam', false);
      }
    } else if (!includeSpam) {
      query = query.eq('is_spam', false);
    }

    // Search
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,company_name.ilike.%${search}%`
      );
    }

    // Sorting
    query = query.order(sortBy as keyof Enquiry, { ascending: sortOrder === 'asc' });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching enquiries:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch enquiries' },
        { status: 500 }
      );
    }

    const response: PaginatedResponse<Enquiry> = {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error('Error in GET /api/admin/enquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
