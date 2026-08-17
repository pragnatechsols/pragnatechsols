-- ============================================
-- TEAM MEMBERS: add employee_id (optional identifier)
-- Idempotent: safe to re-run.
-- ============================================
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS employee_id VARCHAR(100);
