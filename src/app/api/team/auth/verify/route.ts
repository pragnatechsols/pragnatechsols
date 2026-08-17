import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyPassword } from '@/lib/auth';
import { createTeamSession } from '@/lib/team-auth';

// POST /api/team/auth/verify - Log in with email + password OR email + admin login code.
// The admin-generated 6-digit code is an always-valid fallback.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body?.email as string | undefined)?.trim().toLowerCase();
    const password = body?.password as string | undefined;
    const code = (body?.code as string | undefined)?.trim();

    if (!email || (!password && !code)) {
      return NextResponse.json(
        { success: false, error: 'Email and password (or login code) are required' },
        { status: 400 }
      );
    }

    const { data: member } = await supabaseAdmin
      .from('team_members')
      .select('id, name, email, role, password_hash')
      .eq('email', email)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (!member) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    let authed = false;

    if (password && member.password_hash) {
      authed = await verifyPassword(password, member.password_hash);
    }

    // Admin code fallback (always valid while unexpired/unused)
    if (!authed && code) {
      const { data: codeRow } = await supabaseAdmin
        .from('team_login_codes')
        .select('id, expires_at, used_at')
        .eq('team_member_id', member.id)
        .eq('code', code)
        .is('used_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (codeRow && new Date(codeRow.expires_at).getTime() >= Date.now()) {
        await supabaseAdmin
          .from('team_login_codes')
          .update({ used_at: new Date().toISOString() })
          .eq('id', codeRow.id);
        authed = true;
      }
    }

    if (!authed) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

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
