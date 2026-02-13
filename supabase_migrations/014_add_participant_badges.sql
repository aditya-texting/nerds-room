-- Add Participant Badge System
-- This migration adds badge image support for hackathons

-- Add badge_image_url column to hackathons table
ALTER TABLE public.hackathons 
ADD COLUMN IF NOT EXISTS badge_image_url TEXT;

-- Add badge_enabled column to control badge visibility
ALTER TABLE public.hackathons 
ADD COLUMN IF NOT EXISTS badge_enabled BOOLEAN DEFAULT true;

-- Comment on columns
COMMENT ON COLUMN public.hackathons.badge_image_url IS 'URL to the badge template image for participants';
COMMENT ON COLUMN public.hackathons.badge_enabled IS 'Whether badges are enabled for this hackathon';

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'hackathons'
  AND column_name IN ('badge_image_url', 'badge_enabled');
