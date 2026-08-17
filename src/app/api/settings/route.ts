import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Public, allow-listed settings safe to expose to unauthenticated visitors.
const PUBLIC_KEYS = ['why_hire_you_max_words'];

// GET /api/settings - Public site config used by public forms (e.g. careers word limit)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('key, value')
      .in('key', PUBLIC_KEYS);

    if (error) {
      console.error('Error fetching public settings:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
    }

    const config: Record<string, string | null> = {};
    for (const row of data || []) config[row.key] = row.value;

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error('Error in GET /api/settings:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
