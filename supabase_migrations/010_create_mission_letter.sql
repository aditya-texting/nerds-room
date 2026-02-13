-- Migration 010: Create and update Mission Letter table
-- This table stores the single core mission statement for the organization

CREATE TABLE IF NOT EXISTS public.mission_letter (
    id INTEGER PRIMARY KEY DEFAULT 1,
    title TEXT,
    subtitle TEXT,
    heading TEXT NOT NULL DEFAULT 'Dear Future Innovator,',
    content TEXT NOT NULL,
    signature_name TEXT DEFAULT 'Aditya Pandey',
    signature_role TEXT DEFAULT 'Founder',
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure we have the new columns if the table already existed
ALTER TABLE public.mission_letter ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.mission_letter ADD COLUMN IF NOT EXISTS subtitle TEXT;

-- Enable RLS
ALTER TABLE public.mission_letter ENABLE ROW LEVEL SECURITY;

-- Allow public read
DROP POLICY IF EXISTS "Enable read access for all users" ON public.mission_letter;
CREATE POLICY "Enable read access for all users" ON public.mission_letter FOR SELECT USING (true);

-- Allow service role / authenticated update (simplified for now as per project pattern)
DROP POLICY IF EXISTS "Enable update for all users" ON public.mission_letter;
CREATE POLICY "Enable update for all users" ON public.mission_letter FOR ALL USING (true);

-- Seed initial data if table is empty
INSERT INTO public.mission_letter (id, heading, content, signature_name, signature_role, profile_image_url)
SELECT 1, 'Dear Future Innovator,', '<p>The world is moving faster than ever. Standard education isn''t keeping up. The old paths are crumbling.</p><p class="font-semibold">The truth is:</p><p>No one knows exactly what the future looks like. But we know who will build it.</p><p>At Nerds Room, we aren''t just a community; we are an engine. An engine that turns raw potential into shipping products. We believe that the most valuable thing we can do is help each other create.</p><p>We are here to make sense of this new era, one line of code at a time.</p><p>Welcome to Nerds Room. Let''s build the future we want to live in.</p>', 'Aditya Pandey', 'Founder', 'https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg'
WHERE NOT EXISTS (SELECT 1 FROM public.mission_letter WHERE id = 1);
