-- =====================================================
-- DATABASE CLEANUP & SECURITY
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. DROP UNUSED TABLES
-- =====================================================

-- Drop admins table (using hardcoded auth instead)
DROP TABLE IF EXISTS public.admins CASCADE;

-- Drop education table (not used in website)
DROP TABLE IF EXISTS public.education CASCADE;


-- 2. ENABLE RLS FOR ALL TABLES
-- =====================================================

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.socials ENABLE ROW LEVEL SECURITY;


-- 3. CREATE RLS POLICIES
-- =====================================================

-- CERTIFICATIONS
-- Allow public read
DROP POLICY IF EXISTS "Public read certifications" ON public.certifications;
CREATE POLICY "Public read certifications"
ON public.certifications FOR SELECT
TO public
USING (true);

-- Allow service role full access
DROP POLICY IF EXISTS "Service role full access certifications" ON public.certifications;
CREATE POLICY "Service role full access certifications"
ON public.certifications FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- PROFILE
-- Allow public read
DROP POLICY IF EXISTS "Public read profile" ON public.profile;
CREATE POLICY "Public read profile"
ON public.profile FOR SELECT
TO public
USING (true);

-- Allow service role full access
DROP POLICY IF EXISTS "Service role full access profile" ON public.profile;
CREATE POLICY "Service role full access profile"
ON public.profile FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- PROJECTS
-- Allow public read
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects"
ON public.projects FOR SELECT
TO public
USING (true);

-- Allow service role full access
DROP POLICY IF EXISTS "Service role full access projects" ON public.projects;
CREATE POLICY "Service role full access projects"
ON public.projects FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- SKILLS
-- Allow public read
DROP POLICY IF EXISTS "Public read skills" ON public.skills;
CREATE POLICY "Public read skills"
ON public.skills FOR SELECT
TO public
USING (true);

-- Allow service role full access
DROP POLICY IF EXISTS "Service role full access skills" ON public.skills;
CREATE POLICY "Service role full access skills"
ON public.skills FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- SOCIALS
-- Allow public read
DROP POLICY IF EXISTS "Public read socials" ON public.socials;
CREATE POLICY "Public read socials"a
ON public.socials FOR SELECT
TO public
USING (true);

-- Allow service role full access
DROP POLICY IF EXISTS "Service role full access socials" ON public.socials;
CREATE POLICY "Service role full access socials"
ON public.socials FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('certifications', 'profile', 'projects', 'skills', 'socials');

-- Check policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
