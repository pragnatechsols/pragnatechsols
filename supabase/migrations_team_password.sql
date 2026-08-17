-- ============================================
-- TEAM AUTH: password login + password reset
-- Idempotent: safe to re-run.
-- ============================================

-- Password hash for team member login (nullable until set)
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Password reset tokens (self-service "forgot password")
CREATE TABLE IF NOT EXISTS team_password_resets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_password_resets_member ON team_password_resets(team_member_id);
CREATE INDEX IF NOT EXISTS idx_team_password_resets_token ON team_password_resets(token);

ALTER TABLE team_password_resets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role has full access to team_password_resets" ON team_password_resets;
CREATE POLICY "Service role has full access to team_password_resets" ON team_password_resets FOR ALL USING (true);
