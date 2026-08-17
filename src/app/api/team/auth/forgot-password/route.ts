import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateResetToken } from '@/lib/team-auth';
import { sendPasswordResetEmail } from '@/lib/team-email';

const RESET_TTL_MINUTES = 30;

// POST /api/team/auth/forgot-password - Email a reset link. Always returns success.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body?.email as string | undefined)?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const { data: member } = await supabaseAdmin
      .from('team_members')
      .select('id, name, email')
      .eq('email', email)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (member) {
      const token = generateResetToken();
      const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000).toISOString();

      await supabaseAdmin.from('team_password_resets').insert({
        team_member_id: member.id,
        token,
        expires_at: expiresAt,
      });

      const origin = request.nextUrl.origin;
      const resetUrl = `${origin}/team/reset-password?token=${token}`;

      try {
        await sendPasswordResetEmail(member.email, member.name, resetUrl, RESET_TTL_MINUTES);
      } catch (mailErr) {
        console.error('Failed to send reset email:', mailErr);
      }
    }

    return NextResponse.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (error) {
    console.error('Error in POST /api/team/auth/forgot-password:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
