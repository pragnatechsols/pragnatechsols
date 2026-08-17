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
