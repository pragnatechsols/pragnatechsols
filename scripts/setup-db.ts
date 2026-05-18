// Setup script to create database tables in Supabase
// Run with: npx tsx scripts/setup-db.ts

import * as dotenv from 'dotenv';

// Load env files
dotenv.config();
dotenv.config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables. Make sure .env or .env.local is configured.');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up Pragna Techsols database...\n');

  try {
    // Test connection
    const { error: testError } = await supabase.from('admin_users').select('count').limit(1);
    
    if (testError && testError.code === '42P01') {
      console.log('📦 Tables do not exist yet. Please run the SQL schema manually:\n');
      console.log('1. Go to your Supabase Dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of supabase/schema.sql');
      console.log('4. Click "Run"\n');
      console.log('Or use the Supabase CLI: npx supabase db push');
      return;
    }

    console.log('✅ Database tables exist!\n');

    // Check if admin user exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('email', 'admin@pragnatechsols.com')
      .single();

    if (existingAdmin) {
      console.log('✅ Default admin user already exists:', existingAdmin.email);
    } else {
      // Create default admin user
      // Password: admin123 (using simple hash for demo - use proper bcrypt in production)
      const passwordSalt = process.env.PASSWORD_SALT || 'pragna-salt-2024';
      const crypto = await import('crypto');
      const passwordHash = crypto
        .createHash('sha256')
        .update('admin123' + passwordSalt)
        .digest('hex');

      const { data: newAdmin, error: adminError } = await supabase
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

      if (adminError) {
        console.error('❌ Failed to create admin user:', adminError.message);
      } else {
        console.log('✅ Created default admin user:', newAdmin.email);
        console.log('   Password: admin123');
      }
    }

    // Create a sample job posting
    const { data: existingJob } = await supabase
      .from('jobs')
      .select('id')
      .limit(1)
      .single();

    if (!existingJob) {
      const { error: jobError } = await supabase
        .from('jobs')
        .insert({
          title: 'Senior HVAC Engineer',
          department: 'Engineering',
          experience: '5-8 years',
          location: 'Hyderabad, India',
          employment_type: 'full_time',
          description: 'We are looking for an experienced HVAC Engineer to join our team. The ideal candidate will have expertise in designing and implementing HVAC systems for commercial and industrial buildings.\n\nResponsibilities:\n- Design HVAC systems for various project types\n- Coordinate with architects and other engineers\n- Conduct site inspections and quality checks\n- Prepare technical documentation and reports\n\nRequirements:\n- B.E/B.Tech in Mechanical Engineering\n- 5+ years of experience in HVAC design\n- Proficiency in AutoCAD and Revit\n- Strong analytical and problem-solving skills',
          skills: ['HVAC Design', 'AutoCAD', 'Revit', 'Load Calculations', 'Project Management'],
          salary_range: '₹12-18 LPA',
          is_active: true
        });

      if (!jobError) {
        console.log('✅ Created sample job posting');
      }
    }

    console.log('\n🎉 Database setup complete!');
    console.log('\nYou can now:');
    console.log('1. Start the dev server: npm run dev');
    console.log('2. Access admin panel: http://localhost:3000/admin/login');
    console.log('3. Login with: admin@pragnatechsols.com / admin123');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
