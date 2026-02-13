-- Create Comment Interactions Table (Likes for comments)
CREATE TABLE IF NOT EXISTS public.comment_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID REFERENCES public.announcement_comments(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL, -- Storing name since users might be anonymous/guest
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(comment_id, user_name) -- Prevent duplicate likes from same user/session
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_comment_interactions_comment ON public.comment_interactions(comment_id);

-- Enable RLS
ALTER TABLE public.comment_interactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "comment_interactions_select" ON public.comment_interactions FOR SELECT USING (true);
CREATE POLICY "comment_interactions_insert" ON public.comment_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "comment_interactions_delete" ON public.comment_interactions FOR DELETE USING (true);
