-- Add is_blocked column to announcement_comments table
ALTER TABLE public.announcement_comments 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;

-- Index for filtering blocked comments if needed (though usually we filter in logic or RLS)
-- CREATE INDEX IF NOT EXISTS idx_comments_blocked ON public.announcement_comments(is_blocked);
