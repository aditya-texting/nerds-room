-- Fix RLS Policies to allow Admin actions (Delete, Block/Update)

-- Allow UPDATE on announcement_comments (for blocking)
CREATE POLICY "comments_update" ON public.announcement_comments FOR UPDATE USING (true) WITH CHECK (true);

-- Allow DELETE on announcement_comments (for deleting comments)
CREATE POLICY "comments_delete" ON public.announcement_comments FOR DELETE USING (true);

-- Allow DELETE on announcements (for admins to delete posts)
CREATE POLICY "announcements_delete" ON public.announcements FOR DELETE USING (true);

-- Ensure comment_interactions has all permissions
DROP POLICY IF EXISTS "comment_interactions_select" ON public.comment_interactions;
DROP POLICY IF EXISTS "comment_interactions_insert" ON public.comment_interactions;
DROP POLICY IF EXISTS "comment_interactions_delete" ON public.comment_interactions;

CREATE POLICY "comment_interactions_all" ON public.comment_interactions FOR ALL USING (true) WITH CHECK (true);

-- Ensure announcements has UPDATE permission if needed
CREATE POLICY "announcements_update" ON public.announcements FOR UPDATE USING (true) WITH CHECK (true);
