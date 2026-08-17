-- ============================================
-- TEAM PORTAL: team login codes + task notes
-- Idempotent: safe to re-run.
-- ============================================

-- ============================================
-- TEAM LOGIN CODES (passwordless magic-code auth for team members)
-- ============================================
CREATE TABLE IF NOT EXISTS team_login_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_login_codes_member ON team_login_codes(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_login_codes_created_at ON team_login_codes(created_at DESC);

-- ============================================
-- TASK NOTES (activity thread on a task, from members or admins)
-- ============================================
CREATE TABLE IF NOT EXISTS task_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author_type VARCHAR(20) NOT NULL DEFAULT 'member',
  author_id UUID,
  author_name VARCHAR(255) NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- author_type values: member, admin

CREATE INDEX IF NOT EXISTS idx_task_notes_task_id ON task_notes(task_id);
CREATE INDEX IF NOT EXISTS idx_task_notes_created_at ON task_notes(created_at DESC);

-- ============================================
-- RLS (service role full access) — matches existing tables
-- ============================================
ALTER TABLE team_login_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role has full access to team_login_codes" ON team_login_codes;
CREATE POLICY "Service role has full access to team_login_codes" ON team_login_codes FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role has full access to task_notes" ON task_notes;
CREATE POLICY "Service role has full access to task_notes" ON task_notes FOR ALL USING (true);
