import * as dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Super Admin credentials
const SUPER_ADMIN_EMAIL = 'adminpragna22@gmail.com';
const SUPER_ADMIN_PASSWORD = 'Pragna@22';
const SUPER_ADMIN_NAME = 'Super Admin';

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
  console.log('🔄 Resetting super admin user...\n');
  
  const passwordHash = await hashPassword(SUPER_ADMIN_PASSWORD);
  console.log('Generated hash:', passwordHash);
  
  // Delete existing super admin (if any)
  await supabase
    .from('admin_users')
    .delete()
    .eq('email', SUPER_ADMIN_EMAIL);
  
  // Also delete old admin if exists
  await supabase
    .from('admin_users')
    .delete()
    .eq('email', 'admin@pragnatechsols.com');
  
  // Create new super admin
  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      email: SUPER_ADMIN_EMAIL,
      password_hash: passwordHash,
      name: SUPER_ADMIN_NAME,
      role: 'super_admin',
      is_active: true
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('✅ Super Admin user created successfully!');
    console.log(`   Email: ${SUPER_ADMIN_EMAIL}`);
    console.log(`   Password: ${SUPER_ADMIN_PASSWORD}`);
    console.log('   Role: super_admin');
  }
}

resetAdmin();
