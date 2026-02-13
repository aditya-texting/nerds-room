-- Quick check to see if columns exist
-- Run this in Supabase SQL Editor to diagnose the issue

-- Check if registration_type column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'hackathons'
  AND column_name IN ('registration_type', 'managed_form_id', 'registration_link');

-- If you see only 'registration_link', then you need to run migration 002

-- Check if registration_forms table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'registration_forms'
);

-- If result is 'false', you need to run migration 001
