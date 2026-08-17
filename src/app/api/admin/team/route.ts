import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';
import { generateInitialPassword } from '@/lib/team-auth';
import { sendInitialPasswordEmail } from '@/lib/team-email';
import type { TeamMember, PaginatedResponse } from '@/types';

// GET /api/admin/team - Get all team members (admin)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const search = searchParams.get('search');
    const activeOnly = searchParams.get('active_only') === 'true';

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('team_members')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false);

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,role.ilike.%${search}%`);
    }

    query = query.order('name', { ascending: true });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching team members:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch team members' }, { status: 500 });
    }

    const response: PaginatedResponse<TeamMember> = {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error('Error in GET /api/admin/team:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/team - Create new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, employee_id, role, is_active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const normalizedEmail = (email as string | undefined)?.trim().toLowerCase();
    if (!normalizedEmail) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email' }, { status: 400 });
    }

    // Prevent duplicate active member emails (email is the login identity)
    const { data: existing } = await supabaseAdmin
      .from('team_members')
      .select('id')
      .eq('email', normalizedEmail)
      .eq('is_deleted', false)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A team member with this email already exists' },
        { status: 400 }
      );
    }

    // Auto-generate an initial password; it is emailed to the member and never shown to the admin.
    const initialPassword = generateInitialPassword();

    const { data, error } = await supabaseAdmin
      .from('team_members')
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        employee_id: employee_id?.trim() || null,
        role: role || null,
        is_active: is_active ?? true,
        password_hash: await hashPassword(initialPassword),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating team member:', error);
      return NextResponse.json({ success: false, error: 'Failed to create team member' }, { status: 500 });
    }

    // Email the member their initial password (non-fatal if it fails).
    try {
      await sendInitialPasswordEmail(normalizedEmail, name.trim(), initialPassword);
    } catch (mailErr) {
      console.error('Failed to send initial password email:', mailErr);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/admin/team:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
