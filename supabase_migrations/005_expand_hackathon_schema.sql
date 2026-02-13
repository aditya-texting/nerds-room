-- Expand hackathons table with missing dynamic fields
ALTER TABLE public.hackathons 
ADD COLUMN IF NOT EXISTS challenges JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS rewards JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS partners JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS organizers JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS mentors JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS jury JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS badge_image_url TEXT,
ADD COLUMN IF NOT EXISTS badge_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_approve BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true;

-- Ensure existing rows have the correct JSONB defaults
UPDATE public.hackathons SET challenges = '[]'::jsonb WHERE challenges IS NULL;
UPDATE public.hackathons SET schedule = '[]'::jsonb WHERE schedule IS NULL;
UPDATE public.hackathons SET rewards = '[]'::jsonb WHERE rewards IS NULL;
UPDATE public.hackathons SET partners = '[]'::jsonb WHERE partners IS NULL;
UPDATE public.hackathons SET organizers = '[]'::jsonb WHERE organizers IS NULL;
UPDATE public.hackathons SET mentors = '[]'::jsonb WHERE mentors IS NULL;
UPDATE public.hackathons SET jury = '[]'::jsonb WHERE jury IS NULL;
UPDATE public.hackathons SET faq = '[]'::jsonb WHERE faq IS NULL;
UPDATE public.hackathons SET badge_enabled = false WHERE badge_enabled IS NULL;
UPDATE public.hackathons SET auto_approve = false WHERE auto_approve IS NULL;
UPDATE public.hackathons SET allow_comments = true WHERE allow_comments IS NULL;
