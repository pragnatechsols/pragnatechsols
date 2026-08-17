import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'info@pragnatechsols.com';

function emailShell(title: string, subtitle: string, bodyHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);border-radius:16px;overflow:hidden;border:1px solid #475569;">
          <div style="background:linear-gradient(135deg,#eab308 0%,#f59e0b 100%);padding:30px;text-align:center;">
            <h1 style="margin:0;color:#0f172a;font-size:22px;font-weight:bold;">${title}</h1>
            <p style="margin:10px 0 0;color:#1e293b;font-size:14px;">${subtitle}</p>
          </div>
          <div style="padding:30px;text-align:center;">${bodyHtml}</div>
        </div>
      </div>
    </body>
    </html>`;
}

function codeBox(value: string): string {
  return `<div style="display:inline-block;background:#0f172a;border:1px solid #475569;border-radius:12px;padding:16px 28px;margin:12px 0;">
    <span style="color:#fbbf24;font-size:26px;font-weight:bold;letter-spacing:2px;">${value}</span>
  </div>`;
}

// Send a team member their auto-generated initial password.
export async function sendInitialPasswordEmail(to: string, name: string, password: string): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Your Pragna Techsols team account',
    html: emailShell(
      'Welcome to the Team Portal',
      'Your account has been created',
      `<p style="color:#cbd5e1;font-size:15px;margin:0 0 12px;">Hi ${name || 'there'}, sign in at <b>/team/login</b> with your email and this temporary password:</p>
       ${codeBox(password)}
       <p style="color:#94a3b8;font-size:13px;margin:16px 0 0;">Please change your password after your first login. If you didn't expect this, contact your administrator.</p>`
    ),
  });
}

// Send a 6-digit login code (admin-triggered fallback).
export async function sendLoginCodeEmail(to: string, name: string, code: string, ttlMinutes: number): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your Pragna Techsols login code: ${code}`,
    html: emailShell(
      'Team Login Code',
      'Use this code to sign in',
      `<p style="color:#cbd5e1;font-size:15px;margin:0 0 12px;">Hi ${name || 'there'}, your login code is:</p>
       ${codeBox(code)}
       <p style="color:#94a3b8;font-size:13px;margin:16px 0 0;">This code expires in ${ttlMinutes} minutes.</p>`
    ),
  });
}

// Send a password-reset link.
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetUrl: string,
  ttlMinutes: number
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Reset your Pragna Techsols team password',
    html: emailShell(
      'Reset Your Password',
      'Password reset requested',
      `<p style="color:#cbd5e1;font-size:15px;margin:0 0 16px;">Hi ${name || 'there'}, click below to set a new password:</p>
       <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#fbbf24,#d97706);color:#3d2063;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:10px;">Reset Password</a>
       <p style="color:#94a3b8;font-size:13px;margin:20px 0 0;word-break:break-all;">Or paste this link: ${resetUrl}</p>
       <p style="color:#94a3b8;font-size:13px;margin:8px 0 0;">This link expires in ${ttlMinutes} minutes. If you didn't request this, you can ignore this email.</p>`
    ),
  });
}
