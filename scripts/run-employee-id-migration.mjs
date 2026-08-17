import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ DATABASE_URL not found in .env or .env.local');
  process.exit(1);
}

const client = new pg.Client({ connectionString: dbUrl });

try {
  console.log('🔌 Connecting to database...');
  await client.connect();

  console.log('📦 Adding employee_id to team_members...');
  const sql = fs.readFileSync('supabase/migrations_team_employee_id.sql', 'utf8');
  await client.query(sql);

  console.log('✅ Migration applied successfully!');
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
