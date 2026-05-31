import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminRequest, hashPassword } from '@/lib/auth';

const MAX_ADDITIONAL_ADMINS = 3;
const SUPER_ADMIN_EMAIL = 'adminpragna22@gmail.com';

// GET /api/admin/settings/admins - Get all admins (super admin only)
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only super admin can view all admins
    if (admin.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Super admin only.' },
        { status: 403 }
      );
    }

    const { data: admins, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, email, name, role, is_active, created_at')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching admins:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch admins' },
        { status: 500 }
      );
    }

    // Count non-super admins
    const additionalAdminsCount = admins?.filter(a => a.role !== 'super_admin').length || 0;

    return NextResponse.json({
      success: true,
      data: {
        admins,
        canCreateMore: additionalAdminsCount < MAX_ADDITIONAL_ADMINS,
        additionalAdminsCount,
        maxAdditionalAdmins: MAX_ADDITIONAL_ADMINS,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/settings/admins:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings/admins - Create new admin (super admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only super admin can create admins
    if (admin.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Super admin only.' },
        { status: 403 }
      );
    }

    // Check current admin count
    const { data: existingAdmins, error: countError } = await supabaseAdmin
      .from('admin_users')
      .select('id, role')
      .neq('role', 'super_admin');

    if (countError) {
      return NextResponse.json(
        { success: false, error: 'Failed to verify admin count' },
        { status: 500 }
      );
    }

    if (existingAdmins && existingAdmins.length >= MAX_ADDITIONAL_ADMINS) {
      return NextResponse.json(
        { success: false, error: `Maximum of ${MAX_ADDITIONAL_ADMINS} additional admins allowed` },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { email, password, name } = body as { 
      email: string; 
      password: string;
      name: string;
    };

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingUser } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Create new admin
    const passwordHash = await hashPassword(password);
    const { data: newAdmin, error: createError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name: name.trim(),
        role: 'admin',
        is_active: true,
      })
      .select('id, email, name, role, is_active, created_at')
      .single();

    if (createError) {
      console.error('Error creating admin:', createError);
      return NextResponse.json(
        { success: false, error: 'Failed to create admin' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newAdmin,
      message: 'Admin created successfully',
    });
  } catch (error) {
    console.error('Error in POST /api/admin/settings/admins:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/settings/admins - Delete admin (super admin only)
export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Only super admin can delete admins
    if (admin.role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Super admin only.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('id');

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Check if trying to delete super admin
    const { data: targetAdmin } = await supabaseAdmin
      .from('admin_users')
      .select('role, email')
      .eq('id', adminId)
      .single();

    if (!targetAdmin) {
      return NextResponse.json(
        { success: false, error: 'Admin not found' },
        { status: 404 }
      );
    }

    if (targetAdmin.role === 'super_admin' || targetAdmin.email === SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete super admin' },
        { status: 400 }
      );
    }

    // Delete admin
    const { error: deleteError } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('id', adminId);

    if (deleteError) {
      console.error('Error deleting admin:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete admin' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/admin/settings/admins:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
