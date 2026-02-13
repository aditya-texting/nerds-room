-- Seed Partners Data
-- This migration creates the partners table and adds partner companies

-- Create partners table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.partners (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "Partners are viewable by everyone" ON public.partners;
CREATE POLICY "Partners are viewable by everyone" 
  ON public.partners FOR SELECT 
  USING (true);

-- Clear existing partners (if any)
TRUNCATE TABLE public.partners RESTART IDENTITY CASCADE;

-- Insert partner companies
INSERT INTO public.partners (name) VALUES
  ('ElevenLabs'),
  ('Physics Wallah'),
  ('RunAnywhere'),
  ('Unstop'),
  ('Lovable'),
  ('GeeksforGeeks'),
  ('Bolt.new');

-- Verify the data
SELECT * FROM public.partners ORDER BY created_at;
