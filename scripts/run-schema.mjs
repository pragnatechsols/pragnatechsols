import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ DATABASE_URL not found in .env or .env.local');
  console.log('\nAdd this to your .env file:');
  console.log('DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres');
  console.log('\nYou can find this in Supabase Dashboard → Settings → Database → Connection string (URI)');
  process.exit(1);
}

const client = new pg.Client({ connectionString: dbUrl });

try {
  console.log('🔌 Connecting to database...');
  await client.connect();
  
  console.log('📦 Running schema...');
  const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
  await client.query(schema);
  
  console.log('✅ Schema created successfully!');
  console.log('\nNow run: npx tsx scripts/setup-db.ts');
} catch (err) {
  console.error('❌ Error:', err.message);
} finally {
  await client.end();
}
