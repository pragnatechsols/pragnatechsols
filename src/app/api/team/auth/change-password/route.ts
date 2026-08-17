import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { verifyTeamRequest } from '@/lib/team-auth';

// POST /api/team/auth/change-password - Logged-in member changes their own password.
export async function POST(request: NextRequest) {
  const member = await verifyTeamRequest(request);
  if (!member) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();
  const currentPassword = body?.currentPassword as string | undefined;
  const newPassword = body?.newPassword as string | undefined;

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { success: false, error: 'New password must be at least 8 characters' },
      { status: 400 }
    );
  }

  // Fetch the current hash
  const { data: row } = await supabaseAdmin
    .from('team_members')
    .select('password_hash')
    .eq('id', member.id)
    .single();

  // If a password already exists, require the current one to match.
  if (row?.password_hash) {
    if (!currentPassword || !(await verifyPassword(currentPassword, row.password_hash))) {
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }
  }

  const { error } = await supabaseAdmin
    .from('team_members')
    .update({ password_hash: await hashPassword(newPassword) })
    .eq('id', member.id);

  if (error) {
    console.error('Error changing team password:', error);
    return NextResponse.json({ success: false, error: 'Failed to change password' }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: 'Password updated' });
}
