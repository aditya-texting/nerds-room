-- Enable RLS on workshops table
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;

-- 1. Allow public read access to all workshops
CREATE POLICY "Public workshops are viewable by everyone" 
ON workshops FOR SELECT 
USING (true);

-- 2. Allow authenticated users (admins) to insert new workshops
CREATE POLICY "Authenticated users can insert workshops" 
ON workshops FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- 3. Allow authenticated users (admins) to update workshops
CREATE POLICY "Authenticated users can update workshops" 
ON workshops FOR UPDATE 
USING (auth.role() = 'authenticated');

-- 4. Allow authenticated users (admins) to delete workshops
CREATE POLICY "Authenticated users can delete workshops" 
ON workshops FOR DELETE 
USING (auth.role() = 'authenticated');
