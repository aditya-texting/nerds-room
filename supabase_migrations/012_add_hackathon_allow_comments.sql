-- Migration 012: Add allow_comments to hackathons table
-- This allows setting a default comment permission at the hackathon level

ALTER TABLE public.hackathons 
ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true;
