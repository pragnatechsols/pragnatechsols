import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminRequest, hashPassword, verifyPassword } from '@/lib/auth';

// GET /api/admin/settings - Get current admin profile
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update admin profile (name)
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body as { name: string };

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('admin_users')
      .update({ name: name.trim(), updated_at: new Date().toISOString() })
      .eq('id', admin.id);

    if (error) {
      console.error('Error updating admin profile:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Error in PUT /api/admin/settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings - Change password
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body as { 
      currentPassword: string; 
      newPassword: string;
    };

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Get current password hash
    const { data: adminData, error: fetchError } = await supabaseAdmin
      .from('admin_users')
      .select('password_hash')
      .eq('id', admin.id)
      .single();

    if (fetchError || !adminData) {
      return NextResponse.json(
        { success: false, error: 'Failed to verify current password' },
        { status: 500 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, adminData.password_hash);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash and update new password
    const newPasswordHash = await hashPassword(newPassword);
    const { error: updateError } = await supabaseAdmin
      .from('admin_users')
      .update({ password_hash: newPasswordHash, updated_at: new Date().toISOString() })
      .eq('id', admin.id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update password' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/admin/settings:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
