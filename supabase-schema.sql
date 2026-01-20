-- SQL Schema untuk Supabase
-- Jalankan query ini di Supabase SQL Editor

-- Table untuk admin users
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table untuk profile data
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  tagline TEXT NOT NULL,
  greeting TEXT DEFAULT 'Hello, world! I''m',
  avatar TEXT NOT NULL,
  photo TEXT,
  about TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table untuk projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  href TEXT,
  image TEXT,
  tags TEXT[], -- Array of tags
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table untuk skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  icon_name TEXT NOT NULL, -- Icon identifier (e.g., 'SiReact')
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table untuk certifications
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  href TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table untuk socials
CREATE TABLE IF NOT EXISTS socials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT UNIQUE NOT NULL, -- 'github', 'linkedin', etc.
  url TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default profile (optional)
INSERT INTO profile (name, username, tagline, avatar, about)
VALUES (
  'Mohammad Affan Shofi',
  'Affan',
  'Aspiring Full‑Stack Developer',
  '/avatar.jpg',
  'A 7th-semester Information Systems student at ITS...'
)
ON CONFLICT DO NOTHING;

-- Insert default socials (optional)
INSERT INTO socials (platform, url) VALUES
  ('github', 'https://github.com/mas663'),
  ('linkedin', 'https://www.linkedin.com/in/mohammad-affan-shofi-4108ba249'),
  ('mail', 'mailto:affan.shofi62@gmail.com'),
  ('instagram', 'https://instagram.com/mohammadaffans'),
  ('whatsapp', 'https://wa.me/6281336464103')
ON CONFLICT (platform) DO UPDATE SET url = EXCLUDED.url;

-- Create first admin user (username: admin, password: admin123)
-- Password hash generated with bcrypt
INSERT INTO admins (username, email, password_hash)
VALUES (
  'admin',
  'admin@example.com',
  '$2b$10$JtHvKpYV.am8wGSlCQNUDe5ma22GEfRFx9Hi978hyeaP8lIT.qSSa'
)
ON CONFLICT (username) DO NOTHING;

-- Enable Row Level Security (optional but recommended)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE socials ENABLE ROW LEVEL SECURITY;
