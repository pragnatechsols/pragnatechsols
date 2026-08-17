import { NextResponse } from 'next/server';
import { clearTeamSession } from '@/lib/team-auth';

// POST /api/team/auth/logout - Clear the team session.
export async function POST() {
  await clearTeamSession();
  return NextResponse.json({ success: true });
}
