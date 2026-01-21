-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT true
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(is_approved) WHERE is_approved = true;

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved comments
CREATE POLICY "Public read approved comments"
ON comments FOR SELECT
USING (is_approved = true);

-- Policy: Anyone can insert comments (will be auto-approved)
CREATE POLICY "Public insert comments"
ON comments FOR INSERT
WITH CHECK (true);

-- Policy: Service role can do everything (for admin)
CREATE POLICY "Service role full access"
ON comments FOR ALL
USING (true)
WITH CHECK (true);
