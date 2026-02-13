-- Create the badges bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('badges', 'badges', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public Badge Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Badge Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Badge Update Delete" ON storage.objects;

-- Allow public access to read badges
CREATE POLICY "Public Badge Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'badges' );

-- Allow authenticated users to upload badges
CREATE POLICY "Admin Badge Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'badges' );

-- Allow authenticated users to update/delete badges
CREATE POLICY "Admin Badge Update Delete"
ON storage.objects FOR ALL
USING ( bucket_id = 'badges' );
