-- database.sql
-- Run this in your Supabase SQL Editor

CREATE TABLE moods (
  id BIGSERIAL PRIMARY KEY,
  mood VARCHAR(50) NOT NULL,
  label VARCHAR(50) NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable Row Level Security for testing
-- (In production, you should set up proper policies)
ALTER TABLE moods DISABLE ROW LEVEL SECURITY;

-- OR set up a public policy:
-- ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all access to moods" ON moods FOR ALL USING (true);