import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from './supabase';
import type { TeamMember } from '@/types';

// Passwordless, session-cookie auth for team members.
// Mirrors the admin auth model in ./auth.ts (lightweight `id:token` cookie).

const TEAM_SESSION_COOKIE = 'team_session';

export async function createTeamSession(teamMemberId: string): Promise<string> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const cookieStore = await cookies();
  cookieStore.set(TEAM_SESSION_COOKIE, `${teamMemberId}:${sessionToken}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });

  return sessionToken;
}

export async function getTeamMemberFromSession(): Promise<TeamMember | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(TEAM_SESSION_COOKIE);
    if (!sessionCookie?.value) return null;

    const [memberId] = sessionCookie.value.split(':');
    if (!memberId) return null;

    return await fetchActiveMember(memberId);
  } catch {
    return null;
  }
}

export async function verifyTeamRequest(request: NextRequest): Promise<TeamMember | null> {
  const sessionCookie = request.cookies.get(TEAM_SESSION_COOKIE);
  if (!sessionCookie?.value) return null;

  const [memberId] = sessionCookie.value.split(':');
  if (!memberId) return null;

  return await fetchActiveMember(memberId);
}

export async function clearTeamSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TEAM_SESSION_COOKIE);
}

async function fetchActiveMember(memberId: string): Promise<TeamMember | null> {
  const { data, error } = await supabaseAdmin
    .from('team_members')
    .select('id, name, email, role, is_active, is_deleted, created_at, updated_at')
    .eq('id', memberId)
    .eq('is_active', true)
    .eq('is_deleted', false)
    .single();

  if (error || !data) return null;
  return data as TeamMember;
}

function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Generate a 6-digit numeric login code.
export function generateLoginCode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(array[0] % 1_000_000).padStart(6, '0');
}
