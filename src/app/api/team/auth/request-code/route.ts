import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';
import { generateLoginCode } from '@/lib/team-auth';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'info@pragnatechsols.com';
const CODE_TTL_MINUTES = 10;

// POST /api/team/auth/request-code - Email a 6-digit login code to a team member.
// Always returns success (does not reveal whether the email exists).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body?.email as string | undefined)?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    // Find an active team member with this email
    const { data: member } = await supabaseAdmin
      .from('team_members')
      .select('id, name, email')
      .eq('email', email)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (member) {
      const code = generateLoginCode();
      const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();

      await supabaseAdmin.from('team_login_codes').insert({
        team_member_id: member.id,
        code,
        expires_at: expiresAt,
      });

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: member.email,
          subject: `Your Pragna Techsols login code: ${code}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
              <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
                <div style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);border-radius:16px;overflow:hidden;border:1px solid #475569;">
                  <div style="background:linear-gradient(135deg,#eab308 0%,#f59e0b 100%);padding:30px;text-align:center;">
                    <h1 style="margin:0;color:#0f172a;font-size:22px;font-weight:bold;">Team Login Code</h1>
                    <p style="margin:10px 0 0;color:#1e293b;font-size:14px;">Use this code to sign in to your task portal</p>
                  </div>
                  <div style="padding:30px;text-align:center;">
                    <p style="color:#cbd5e1;font-size:15px;margin:0 0 16px;">Hi ${member.name || 'there'}, your login code is:</p>
                    <div style="display:inline-block;background:#0f172a;border:1px solid #475569;border-radius:12px;padding:16px 28px;">
                      <span style="color:#fbbf24;font-size:32px;font-weight:bold;letter-spacing:8px;">${code}</span>
                    </div>
                    <p style="color:#94a3b8;font-size:13px;margin:20px 0 0;">This code expires in ${CODE_TTL_MINUTES} minutes. If you didn't request it, you can ignore this email.</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        });
      } catch (mailErr) {
        console.error('Failed to send team login code email:', mailErr);
        // Do not reveal failure specifics to the client.
      }
    }

    return NextResponse.json({ success: true, message: 'If that email is registered, a code has been sent.' });
  } catch (error) {
    console.error('Error in POST /api/team/auth/request-code:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
