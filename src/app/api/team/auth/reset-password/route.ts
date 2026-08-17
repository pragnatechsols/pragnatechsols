import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';

// POST /api/team/auth/reset-password - Consume a reset token and set a new password.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = (body?.token as string | undefined)?.trim();
    const newPassword = body?.newPassword as string | undefined;

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: 'Token and new password are required' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const { data: resetRow } = await supabaseAdmin
      .from('team_password_resets')
      .select('id, team_member_id, expires_at, used_at')
      .eq('token', token)
      .is('used_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!resetRow || new Date(resetRow.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ success: false, error: 'Invalid or expired reset link' }, { status: 400 });
    }

    const { error: updateErr } = await supabaseAdmin
      .from('team_members')
      .update({ password_hash: await hashPassword(newPassword) })
      .eq('id', resetRow.team_member_id);

    if (updateErr) {
      console.error('Error resetting team password:', updateErr);
      return NextResponse.json({ success: false, error: 'Failed to reset password' }, { status: 500 });
    }

    await supabaseAdmin
      .from('team_password_resets')
      .update({ used_at: new Date().toISOString() })
      .eq('id', resetRow.id);

    return NextResponse.json({ success: true, message: 'Password reset. You can now sign in.' });
  } catch (error) {
    console.error('Error in POST /api/team/auth/reset-password:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
