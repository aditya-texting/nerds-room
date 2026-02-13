-- Create Announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hackathon_id BIGINT REFERENCES hackathons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Comments table (can be for announcements or general event, but here we focus on announcements as requested)
CREATE TABLE IF NOT EXISTS announcement_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Interactions table for Likes/Dislikes
CREATE TABLE IF NOT EXISTS announcement_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Can be IP or session based if no auth
    type TEXT CHECK (type IN ('like', 'dislike')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(announcement_id, user_id)
);

-- Optimization: Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_announcements_hackathon_id ON announcements(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_comments_announcement_id ON announcement_comments(announcement_id);
CREATE INDEX IF NOT EXISTS idx_interactions_announcement_id ON announcement_interactions(announcement_id);

-- Enable Row Level Security (RLS)
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_interactions ENABLE ROW LEVEL SECURITY;

-- Simple Policies (Allow everyone to read)
DROP POLICY IF EXISTS "Allow public read" ON announcements;
CREATE POLICY "Allow public read" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read comments" ON announcement_comments;
CREATE POLICY "Allow public read comments" ON announcement_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read interactions" ON announcement_interactions;
CREATE POLICY "Allow public read interactions" ON announcement_interactions FOR SELECT USING (true);

-- Admin/User policies for writing
DROP POLICY IF EXISTS "Allow public insert announcements" ON announcements;
CREATE POLICY "Allow public insert announcements" ON announcements FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete announcements" ON announcements;
CREATE POLICY "Allow public delete announcements" ON announcements FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public insert comments" ON announcement_comments;
CREATE POLICY "Allow public insert comments" ON announcement_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert interactions" ON announcement_interactions;
CREATE POLICY "Allow public insert interactions" ON announcement_interactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update interactions" ON announcement_interactions;
CREATE POLICY "Allow public update interactions" ON announcement_interactions FOR UPDATE USING (true);
