import { NextRequest, NextResponse } from 'next/server';
import { verifyTeamRequest } from '@/lib/team-auth';

// GET /api/team/auth/me - Current team member from session.
export async function GET(request: NextRequest) {
  const member = await verifyTeamRequest(request);
  if (!member) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json({
    success: true,
    data: { id: member.id, name: member.name, email: member.email, role: member.role },
  });
}
