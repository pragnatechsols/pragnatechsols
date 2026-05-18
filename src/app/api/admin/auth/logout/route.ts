import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/auth';

// POST /api/admin/auth/logout - Admin logout
export async function POST() {
  try {
    await clearAdminSession();
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/admin/auth/logout:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
