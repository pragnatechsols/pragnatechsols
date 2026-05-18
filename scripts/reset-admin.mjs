import * as dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Hash password using Web Crypto API (same as auth.ts)
async function hashPassword(password) {
  const salt = process.env.PASSWORD_SALT || 'default_salt';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function resetAdmin() {
  console.log('🔄 Resetting admin user...\n');
  
  const passwordHash = await hashPassword('admin123');
  console.log('Generated hash:', passwordHash);
  
  // Delete existing admin
  await supabase
    .from('admin_users')
    .delete()
    .eq('email', 'admin@pragnatechsols.com');
  
  // Create new admin
  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      email: 'admin@pragnatechsols.com',
      password_hash: passwordHash,
      name: 'Admin User',
      role: 'admin',
      is_active: true
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('✅ Admin user reset successfully!');
    console.log('   Email: admin@pragnatechsols.com');
    console.log('   Password: admin123');
  }
}

resetAdmin();
