-- Add allow_comments to announcements
ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true;

-- Optional: Make title nullable if we want to support untitled posts natively
-- For now we will just insert a default title from the frontend
