import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/auth';
import { generateLoginCode } from '@/lib/team-auth';
import { sendLoginCodeEmail } from '@/lib/team-email';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const CODE_TTL_MINUTES = 10;

// POST /api/admin/team/[id]/login-code
// Generates a fresh login code for a team member so an admin can share it
// directly if the emailed code didn't arrive. Admin-only.
export async function POST(request: NextRequest, { params }: RouteParams) {
  const admin = await verifyAdminRequest(request);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;

  const { data: member } = await supabaseAdmin
    .from('team_members')
    .select('id, name, email, is_active, is_deleted')
    .eq('id', id)
    .single();

  if (!member || member.is_deleted) {
    return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
  }
  if (!member.is_active) {
    return NextResponse.json(
      { success: false, error: 'Member is inactive; activate them before generating a code' },
      { status: 400 }
    );
  }

  const code = generateLoginCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();

  const { error } = await supabaseAdmin.from('team_login_codes').insert({
    team_member_id: id,
    code,
    expires_at: expiresAt,
  });

  if (error) {
    console.error('Error generating login code:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate code' }, { status: 500 });
  }

  // Also email the code (best-effort) so the member can receive it directly.
  if (member.email) {
    try {
      await sendLoginCodeEmail(member.email, member.name, code, CODE_TTL_MINUTES);
    } catch (mailErr) {
      console.error('Failed to email login code:', mailErr);
    }
  }

  return NextResponse.json({ success: true, data: { code, expires_in_minutes: CODE_TTL_MINUTES } });
}
