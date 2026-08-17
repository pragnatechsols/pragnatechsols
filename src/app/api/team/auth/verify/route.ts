import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createTeamSession } from '@/lib/team-auth';

// POST /api/team/auth/verify - Verify a login code and start a team session.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body?.email as string | undefined)?.trim().toLowerCase();
    const code = (body?.code as string | undefined)?.trim();

    if (!email || !code) {
      return NextResponse.json({ success: false, error: 'Email and code are required' }, { status: 400 });
    }

    const { data: member } = await supabaseAdmin
      .from('team_members')
      .select('id, name, email, role')
      .eq('email', email)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (!member) {
      return NextResponse.json({ success: false, error: 'Invalid or expired code' }, { status: 401 });
    }

    // Find the newest unused, unexpired code for this member matching the input.
    const { data: codeRow } = await supabaseAdmin
      .from('team_login_codes')
      .select('id, code, expires_at, used_at')
      .eq('team_member_id', member.id)
      .eq('code', code)
      .is('used_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!codeRow || new Date(codeRow.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ success: false, error: 'Invalid or expired code' }, { status: 401 });
    }

    // Mark this code used (single-use)
    await supabaseAdmin
      .from('team_login_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', codeRow.id);

    await createTeamSession(member.id);

    return NextResponse.json({
      success: true,
      data: { id: member.id, name: member.name, email: member.email, role: member.role },
    });
  } catch (error) {
    console.error('Error in POST /api/team/auth/verify:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
