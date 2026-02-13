-- Optimized Announcements Schema for 50K+ Users
-- Performance-focused with proper indexing and partitioning strategy

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

-- Create Announcement Interactions Table (Likes only, simplified)
CREATE TABLE IF NOT EXISTS public.announcement_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(announcement_id, user_id)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_announcements_hackathon ON public.announcements(hackathon_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_announcement ON public.announcement_comments(announcement_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_interactions_announcement ON public.announcement_interactions(announcement_id);
CREATE INDEX IF NOT EXISTS idx_interactions_user ON public.announcement_interactions(user_id, announcement_id);

-- Materialized View for Like Counts (Performance Optimization)
CREATE MATERIALIZED VIEW IF NOT EXISTS announcement_like_counts AS
SELECT 
    announcement_id,
    COUNT(*) as like_count
FROM public.announcement_interactions
GROUP BY announcement_id;

CREATE UNIQUE INDEX ON announcement_like_counts(announcement_id);

-- Function to refresh like counts (call periodically or on trigger)
CREATE OR REPLACE FUNCTION refresh_announcement_likes()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY announcement_like_counts;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh counts (debounced via pg_cron or manual refresh)
-- For real-time, use Supabase Realtime subscriptions instead

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_interactions ENABLE ROW LEVEL SECURITY;

-- Optimized Policies
CREATE POLICY "announcements_select" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "comments_select" ON public.announcement_comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON public.announcement_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "interactions_select" ON public.announcement_interactions FOR SELECT USING (true);
CREATE POLICY "interactions_insert" ON public.announcement_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "interactions_delete" ON public.announcement_interactions FOR DELETE USING (true);
