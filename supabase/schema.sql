-- ============================================
-- PRAGNA TECHSOLS - DATABASE SCHEMA
-- Enquiry, Leads, Careers, Applications System
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company_name VARCHAR(255),
  service_interested VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new_enquiry',
  is_spam BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status values: new_enquiry, lead, in_talks, converted, spam

CREATE INDEX idx_enquiries_status ON enquiries(status);
CREATE INDEX idx_enquiries_created_at ON enquiries(created_at DESC);
CREATE INDEX idx_enquiries_email ON enquiries(email);
CREATE INDEX idx_enquiries_is_deleted ON enquiries(is_deleted);

-- ============================================
-- ENQUIRY COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS enquiry_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id),
  admin_name VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_enquiry_comments_enquiry_id ON enquiry_comments(enquiry_id);

-- ============================================
-- LEADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  enquiry_id UUID REFERENCES enquiries(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  company_name VARCHAR(255),
  service_interested VARCHAR(255) NOT NULL,
  message TEXT,
  lead_status VARCHAR(50) DEFAULT 'new_lead',
  priority VARCHAR(20) DEFAULT 'medium',
  follow_up_date DATE,
  assigned_to UUID REFERENCES admin_users(id),
  assigned_to_name VARCHAR(255),
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead status values: new_lead, contacted, in_discussion, proposal_sent, converted, lost
-- Priority values: high, medium, low

CREATE INDEX idx_leads_status ON leads(lead_status);
CREATE INDEX idx_leads_priority ON leads(priority);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_follow_up_date ON leads(follow_up_date);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- ============================================
-- LEAD NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lead_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id),
  admin_name VARCHAR(255) NOT NULL,
  note TEXT NOT NULL,
  activity_type VARCHAR(50) DEFAULT 'note',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity types: note, status_change, priority_change, assignment, follow_up

CREATE INDEX idx_lead_notes_lead_id ON lead_notes(lead_id);

-- ============================================
-- JOBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  experience VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  employment_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  salary_range VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employment type values: full_time, part_time, contract, internship, remote

CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_department ON jobs(department);
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- ============================================
-- JOB APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  current_location VARCHAR(255) NOT NULL,
  years_of_experience INTEGER NOT NULL,
  current_company VARCHAR(255),
  portfolio_url VARCHAR(500),
  why_hire_you TEXT NOT NULL,
  notice_period VARCHAR(100) NOT NULL,
  resume_url VARCHAR(500) NOT NULL,
  resume_filename VARCHAR(255) NOT NULL,
  resume_cloudinary_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new',
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status values: new, shortlisted, interview_scheduled, rejected, hired

CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_email ON job_applications(email);
CREATE INDEX idx_job_applications_created_at ON job_applications(created_at DESC);

-- ============================================
-- APPLICATION COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS application_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id),
  admin_name VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_application_comments_application_id ON application_comments(application_id);

-- ============================================
-- UPDATE TIMESTAMP TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to relevant tables
CREATE TRIGGER update_enquiries_updated_at
  BEFORE UPDATE ON enquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY POLICIES (Optional)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for service role (full access)
CREATE POLICY "Service role has full access to admin_users" ON admin_users
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to enquiries" ON enquiries
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to enquiry_comments" ON enquiry_comments
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to leads" ON leads
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to lead_notes" ON lead_notes
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to jobs" ON jobs
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to job_applications" ON job_applications
  FOR ALL USING (true);

CREATE POLICY "Service role has full access to application_comments" ON application_comments
  FOR ALL USING (true);

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- Enquiries summary view
CREATE OR REPLACE VIEW enquiry_stats AS
SELECT
  COUNT(*) FILTER (WHERE status = 'new_enquiry' AND is_deleted = false AND is_spam = false) as new_count,
  COUNT(*) FILTER (WHERE status = 'lead' AND is_deleted = false AND is_spam = false) as lead_count,
  COUNT(*) FILTER (WHERE status = 'in_talks' AND is_deleted = false AND is_spam = false) as in_talks_count,
  COUNT(*) FILTER (WHERE status = 'converted' AND is_deleted = false AND is_spam = false) as converted_count,
  COUNT(*) FILTER (WHERE is_spam = true AND is_deleted = false) as spam_count,
  COUNT(*) FILTER (WHERE is_deleted = false AND is_spam = false) as total_active
FROM enquiries;

-- Leads summary view
CREATE OR REPLACE VIEW lead_stats AS
SELECT
  COUNT(*) FILTER (WHERE lead_status = 'new_lead' AND is_deleted = false) as new_lead_count,
  COUNT(*) FILTER (WHERE lead_status = 'contacted' AND is_deleted = false) as contacted_count,
  COUNT(*) FILTER (WHERE lead_status = 'in_discussion' AND is_deleted = false) as in_discussion_count,
  COUNT(*) FILTER (WHERE lead_status = 'proposal_sent' AND is_deleted = false) as proposal_sent_count,
  COUNT(*) FILTER (WHERE lead_status = 'converted' AND is_deleted = false) as converted_count,
  COUNT(*) FILTER (WHERE lead_status = 'lost' AND is_deleted = false) as lost_count,
  COUNT(*) FILTER (WHERE is_deleted = false) as total_leads,
  COUNT(*) FILTER (WHERE lead_status NOT IN ('converted', 'lost') AND is_deleted = false) as pending_leads
FROM leads;

-- Applications summary view
CREATE OR REPLACE VIEW application_stats AS
SELECT
  COUNT(*) FILTER (WHERE status = 'new' AND is_deleted = false) as new_count,
  COUNT(*) FILTER (WHERE status = 'shortlisted' AND is_deleted = false) as shortlisted_count,
  COUNT(*) FILTER (WHERE status = 'interview_scheduled' AND is_deleted = false) as interview_count,
  COUNT(*) FILTER (WHERE status = 'rejected' AND is_deleted = false) as rejected_count,
  COUNT(*) FILTER (WHERE status = 'hired' AND is_deleted = false) as hired_count,
  COUNT(*) FILTER (WHERE is_deleted = false) as total_applications
FROM job_applications;

-- ============================================
-- SEED DATA (DEFAULT ADMIN USER)
-- Password: admin123 (hashed with bcrypt)
-- ============================================
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES (
  'admin@pragnatechsols.com', 
  '$2b$10$rOJK5YtjGxB3q6QZoHzQp.yjE7cVX3V8V0rSoJvvjVxjVfJZTqYjG',
  'Admin User',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;
