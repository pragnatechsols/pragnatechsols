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

-- ============================================
-- SITE SETTINGS TABLE (key/value config)
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Default: max words allowed in the careers "Why should we hire you?" field
INSERT INTO settings (key, value) VALUES ('why_hire_you_max_words', '200')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SERVICES TABLE (admin-managed, shown on /services)
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  short_desc VARCHAR(500),
  description TEXT,
  features TEXT[] DEFAULT '{}',
  icon_name VARCHAR(100),
  icon_image_url VARCHAR(500),
  icon_cloudinary_id VARCHAR(255),
  gradient VARCHAR(100) DEFAULT 'from-amber-400 to-orange-500',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_sort_order ON services(sort_order);

-- ============================================
-- PROJECTS TABLE (admin-managed, shown on /projects)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  works TEXT[] DEFAULT '{}',
  category VARCHAR(100) NOT NULL,
  logo_url VARCHAR(500),
  logo_cloudinary_id VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON projects(sort_order);

-- ============================================
-- TEAM MEMBERS TABLE (internal staff; task assignees)
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_is_active ON team_members(is_active);

-- ============================================
-- TASKS TABLE (internal assignment)
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  assignee_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'open',
  priority VARCHAR(20) DEFAULT 'medium',
  due_date DATE,
  created_by UUID REFERENCES admin_users(id),
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task status values: open, in_progress, done
-- Priority values: high, medium, low

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- ============================================
-- TRIGGERS for new tables (auto updated_at)
-- ============================================
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS for new tables (service role full access)
-- ============================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role has full access to settings" ON settings;
CREATE POLICY "Service role has full access to settings" ON settings FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role has full access to services" ON services;
CREATE POLICY "Service role has full access to services" ON services FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role has full access to projects" ON projects;
CREATE POLICY "Service role has full access to projects" ON projects FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role has full access to team_members" ON team_members;
CREATE POLICY "Service role has full access to team_members" ON team_members FOR ALL USING (true);

DROP POLICY IF EXISTS "Service role has full access to tasks" ON tasks;
CREATE POLICY "Service role has full access to tasks" ON tasks FOR ALL USING (true);

-- ============================================
-- SEED: SERVICES (mirrors the previously hardcoded /services page)
-- ============================================
INSERT INTO services (title, slug, short_desc, description, features, icon_name, gradient, sort_order)
SELECT * FROM (VALUES
  ('Electrical', 'electrical', 'Complete electrical solutions for all project types',
   'Our electrical services encompass the complete spectrum of electrical engineering solutions. From low voltage distribution systems to high voltage installations, we design, install, and maintain electrical infrastructure that meets the highest safety and efficiency standards.',
   ARRAY['LT & HT Electrical Installations','Power Distribution Systems','Substation Design & Installation','Electrical Panel Design & Manufacturing','Earthing & Lightning Protection','Energy Audits & Optimization'],
   'bolt', 'from-amber-400 to-orange-500', 1),
  ('HVAC', 'hvac', 'Heating, Ventilation & Air Conditioning systems',
   'We provide comprehensive HVAC solutions designed for optimal comfort and energy efficiency. Our team specializes in designing and implementing climate control systems for residential, commercial, and industrial spaces.',
   ARRAY['Central Air Conditioning Systems','VRF/VRV Systems','Ducting Design & Installation','Chiller Plant Systems','Ventilation & Exhaust Systems','HVAC Maintenance & AMC'],
   'wrench', 'from-blue-400 to-cyan-500', 2),
  ('Plumbing', 'plumbing', 'Comprehensive plumbing & sanitary solutions',
   'Our plumbing services cover everything from basic installations to complex industrial systems. We ensure efficient water supply, drainage, and sanitary systems that comply with all regulatory standards.',
   ARRAY['Water Supply Systems','Drainage & Sewage Systems','Sanitary Installations','Rainwater Harvesting','Swimming Pool Systems','Hot Water Systems'],
   'beaker', 'from-cyan-400 to-blue-500', 3),
  ('Fire & Safety', 'fire-safety', 'Advanced fire detection & suppression systems',
   'Safety is our priority. We design and implement fire detection, alarm, and suppression systems that protect lives and property. Our solutions comply with all national and international fire safety standards.',
   ARRAY['Fire Detection & Alarm Systems','Sprinkler Systems','Fire Hydrant Systems','FM-200 & CO2 Suppression','Public Address & Emergency Systems','Fire Safety Audits'],
   'fire', 'from-red-400 to-orange-500', 4),
  ('Solar Projects', 'solar-projects', 'Sustainable solar energy solutions',
   'Embrace clean energy with our solar solutions. We design and install solar power systems that reduce your carbon footprint and energy costs while contributing to a sustainable future.',
   ARRAY['Rooftop Solar Installations','Ground-mounted Solar Systems','Solar Water Heating','Net Metering Solutions','Solar Street Lighting','Solar System Maintenance'],
   'sun', 'from-amber-400 to-amber-500', 5),
  ('CCTV', 'cctv', 'State-of-the-art surveillance systems',
   'Protect your premises with our advanced CCTV and surveillance solutions. We provide end-to-end security systems with the latest technology for comprehensive monitoring and recording.',
   ARRAY['IP Camera Systems','HD & 4K Surveillance','Network Video Recorders (NVR)','Remote Monitoring Solutions','Access Control Integration','Video Analytics'],
   'video', 'from-purple-400 to-purple-500', 6),
  ('RO, STP & WTP', 'ro-stp-wtp', 'Water treatment & purification systems',
   'We specialize in water treatment solutions including Reverse Osmosis, Sewage Treatment Plants, and Water Treatment Plants. Our systems ensure clean, safe water while meeting environmental regulations.',
   ARRAY['Reverse Osmosis Plants','Sewage Treatment Plants (STP)','Water Treatment Plants (WTP)','Effluent Treatment Plants (ETP)','Water Recycling Systems','Operation & Maintenance'],
   'cog', 'from-teal-400 to-green-500', 7),
  ('Retrofit Services', 'retrofit-services', 'Modernization & upgrade solutions',
   'Upgrade and modernize your existing infrastructure with our retrofit services. We help you improve efficiency, safety, and compliance while extending the life of your systems.',
   ARRAY['Electrical System Upgrades','HVAC Retrofitting','Energy Efficiency Improvements','Safety System Upgrades','Building Automation','Equipment Modernization'],
   'shield', 'from-purple-400 to-purple-500', 8)
) AS v(title, slug, short_desc, description, features, icon_name, gradient, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM services);

-- ============================================
-- SEED: PROJECTS (mirrors the previously hardcoded /projects page)
-- ============================================
INSERT INTO projects (title, works, category, logo_url, sort_order)
SELECT * FROM (VALUES
  ('Bharat Electronics Limited, AP', ARRAY['Supply of Circuit Breakers'], 'Industrial', 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845627/pragna-techsols/vendors/bel.png', 1),
  ('VIT-AP University', ARRAY['Switch Gears','Cable laying (300 sq.mm electrical cable)','Lightning Arrestors'], 'Educational', 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845628/pragna-techsols/vendors/vit-ap.png', 2),
  ('SRM University, AP', ARRAY['Water tank cleaning','Material supply — Glowguard'], 'Educational', 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845629/pragna-techsols/vendors/srm-ap.png', 3),
  ('NID, AP', ARRAY['Electrical cable laying & associated works','Transformer oil filtration'], 'Educational', 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845630/pragna-techsols/vendors/nid-ap.png', 4),
  ('UltraTech, AP', ARRAY['Transformer oil service','Supply of lights','Electrical circuit checking & new electrical works'], 'Industrial', 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845631/pragna-techsols/vendors/ultratech.png', 5),
  ('Sentini Group', ARRAY['Electrical works — Elevate Mall'], 'Commercial', 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845634/pragna-techsols/vendors/sentini.jpg', 6),
  ('MEIL', ARRAY['MEP works at Medical College, Piduguralla, Andhra Pradesh'], 'Infrastructure', 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845636/pragna-techsols/vendors/meil.jpg', 7),
  ('Blue Star, Vijayawada', ARRAY['MEPF engineering services'], 'Commercial', 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845632/pragna-techsols/vendors/blue-star.jpg', 8),
  ('Zomato', ARRAY['MEPF engineering services'], 'Commercial', 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845633/pragna-techsols/vendors/zomato.png', 9),
  ('ACT Fibernet', ARRAY['MEPF engineering services'], 'Infrastructure', 'https://res.cloudinary.com/dpxp9pfui/image/upload/v1783845636/pragna-techsols/vendors/act-fibernet.png', 10)
) AS v(title, works, category, logo_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM projects);

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
