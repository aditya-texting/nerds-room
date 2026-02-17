-- Update workshops table to match hackathon features
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS about TEXT;
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS mentors JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS topics JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.workshops ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Create index for slug
CREATE INDEX IF NOT EXISTS idx_workshops_slug ON public.workshops(slug);

-- Update existing rows to have a slug based on title if needed
-- (Simplified: just set it to a random string or manual update later if many)
UPDATE public.workshops SET slug = lower(replace(title, ' ', '-')) WHERE slug IS NULL;
