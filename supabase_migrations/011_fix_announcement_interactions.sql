-- Migration 011: Fix announcement_interactions schema
-- The 'type' column was NOT NULL but front-end was not passing it, causing failures.
-- This sets a default and makes it nullable to prevent breakages.

ALTER TABLE public.announcement_interactions 
ALTER COLUMN type SET DEFAULT 'like',
ALTER COLUMN type DROP NOT NULL;

-- Also ensure registrations table has all needed fields for Admin Panel
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS hackathon_id INTEGER REFERENCES public.hackathons(id);
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS form_responses JSONB;
