-- Add new columns for enhanced Event Details UI
ALTER TABLE public.hackathons 
ADD COLUMN IF NOT EXISTS challenges JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS rewards JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS partners JSONB DEFAULT '[]'::jsonb;

-- Update existing hackathons to ensure these are initialized as empty arrays if they were created before columns were added
UPDATE public.hackathons SET challenges = '[]'::jsonb WHERE challenges IS NULL;
UPDATE public.hackathons SET schedule = '[]'::jsonb WHERE schedule IS NULL;
UPDATE public.hackathons SET rewards = '[]'::jsonb WHERE rewards IS NULL;
UPDATE public.hackathons SET partners = '[]'::jsonb WHERE partners IS NULL;
