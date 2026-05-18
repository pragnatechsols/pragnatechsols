import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from './supabase';
import type { AdminUser } from '@/types';

const ADMIN_SESSION_COOKIE = 'admin_session';

// Simple session-based auth for admin
// In production, use proper JWT tokens or Supabase Auth

export async function createAdminSession(adminId: string): Promise<string> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  // Store session in database or use cookies directly
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, `${adminId}:${sessionToken}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
  
  return sessionToken;
}

export async function getAdminFromSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE);
    
    if (!sessionCookie?.value) {
      return null;
    }
    
    const [adminId] = sessionCookie.value.split(':');
    
    if (!adminId) {
      return null;
    }
    
    const { data: admin, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name, role, is_active, created_at, updated_at')
      .eq('id', adminId)
      .eq('is_active', true)
      .single();
    
    if (error || !admin) {
      return null;
    }
    
    return admin as AdminUser;
  } catch {
    return null;
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function verifyAdminRequest(request: NextRequest): Promise<AdminUser | null> {
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE);
  
  if (!sessionCookie?.value) {
    return null;
  }
  
  const [adminId] = sessionCookie.value.split(':');
  
  if (!adminId) {
    return null;
  }
  
  const { data: admin, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, email, name, role, is_active, created_at, updated_at')
    .eq('id', adminId)
    .eq('is_active', true)
    .single();
  
  if (error || !admin) {
    return null;
  }
  
  return admin as AdminUser;
}

function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Simple password hashing (use bcrypt in production)
export async function hashPassword(password: string): Promise<string> {
  const salt = process.env.PASSWORD_SALT || 'default_salt';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
