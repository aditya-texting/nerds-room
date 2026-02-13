-- Create Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    hackathon_id INTEGER REFERENCES public.hackathons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Announcement Comments Table
CREATE TABLE IF NOT EXISTS public.announcement_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Announcement Interactions (Likes/Dislikes) Table
CREATE TABLE IF NOT EXISTS public.announcement_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('like', 'dislike')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(announcement_id, user_id)
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_interactions ENABLE ROW LEVEL SECURITY;

-- Simple Policies (Adjust as needed for production)
CREATE POLICY "Allow public read" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.announcement_comments FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON public.announcement_interactions FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON public.announcement_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public interaction" ON public.announcement_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update interaction" ON public.announcement_interactions FOR UPDATE USING (true);
