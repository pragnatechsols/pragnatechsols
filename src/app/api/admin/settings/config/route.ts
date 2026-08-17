import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminRequest } from '@/lib/auth';

// GET /api/admin/settings/config - Get all site config settings (key/value)
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin.from('settings').select('key, value');

    if (error) {
      console.error('Error fetching settings:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
    }

    const config: Record<string, string | null> = {};
    for (const row of data || []) config[row.key] = row.value;

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error('Error in GET /api/admin/settings/config:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/settings/config - Upsert one or more settings
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const updates = body as Record<string, unknown>;

    const entries = Object.entries(updates);
    if (entries.length === 0) {
      return NextResponse.json({ success: false, error: 'No settings provided' }, { status: 400 });
    }

    // Validate the word-limit setting when provided
    if ('why_hire_you_max_words' in updates) {
      const n = parseInt(String(updates.why_hire_you_max_words), 10);
      if (isNaN(n) || n < 10 || n > 5000) {
        return NextResponse.json(
          { success: false, error: 'Word limit must be a number between 10 and 5000' },
          { status: 400 }
        );
      }
      updates.why_hire_you_max_words = String(n);
    }

    for (const [key, value] of Object.entries(updates)) {
      const { error } = await supabaseAdmin
        .from('settings')
        .upsert({ key, value: value === null ? null : String(value) }, { onConflict: 'key' });

      if (error) {
        console.error('Error upserting setting', key, error);
        return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/admin/settings/config:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
