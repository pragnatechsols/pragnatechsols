import { NextResponse } from 'next/server';
import { getAdminFromSession } from '@/lib/auth';

// GET /api/admin/auth/me - Get current admin user
export async function GET() {
  try {
    const admin = await getAdminFromSession();
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/auth/me:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
