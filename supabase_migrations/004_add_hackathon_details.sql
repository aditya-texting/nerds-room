-- Add missing detail columns to hackathons table
ALTER TABLE public.hackathons 
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS prizes JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS rules JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing hackathons with dummy descriptions if they are null
UPDATE public.hackathons SET description = 'Building the future together.' WHERE description IS NULL;
UPDATE public.hackathons SET prizes = '[]'::jsonb WHERE prizes IS NULL;
UPDATE public.hackathons SET rules = '[]'::jsonb WHERE rules IS NULL;
UPDATE public.hackathons SET resources = '[]'::jsonb WHERE resources IS NULL;
