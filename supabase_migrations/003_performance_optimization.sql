-- Performance Optimization: Add Indexes for 50K+ Users
-- Run this in Supabase SQL Editor

-- ============================================
-- INDEXES FOR FASTER QUERIES
-- ============================================

-- Registrations table indexes
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);

-- Hackathons table indexes
CREATE INDEX IF NOT EXISTS idx_hackathons_status ON public.hackathons(status);
CREATE INDEX IF NOT EXISTS idx_hackathons_slug ON public.hackathons(slug);
CREATE INDEX IF NOT EXISTS idx_hackathons_is_public ON public.hackathons(is_public);
CREATE INDEX IF NOT EXISTS idx_hackathons_is_featured ON public.hackathons(is_featured);
CREATE INDEX IF NOT EXISTS idx_hackathons_created_at ON public.hackathons(created_at DESC);

-- Past Events indexes
CREATE INDEX IF NOT EXISTS idx_past_events_created_at ON public.past_events(created_at DESC);

-- Workshops indexes  
CREATE INDEX IF NOT EXISTS idx_workshops_created_at ON public.workshops(created_at DESC);

-- Chapters indexes
CREATE INDEX IF NOT EXISTS idx_chapters_created_at ON public.chapters(created_at DESC);

-- Photo Gallery indexes
CREATE INDEX IF NOT EXISTS idx_photo_gallery_created_at ON public.photo_gallery(created_at DESC);

-- Success Stories indexes
CREATE INDEX IF NOT EXISTS idx_success_stories_created_at ON public.success_stories(created_at DESC);

-- ============================================
-- OPTIMIZE QUERIES WITH MATERIALIZED VIEWS
-- ============================================

-- Create materialized view for dashboard stats (refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.registrations) as total_registrations,
  (SELECT COUNT(*) FROM public.registrations WHERE status = 'pending') as pending_approvals,
  (SELECT COUNT(*) FROM public.hackathons WHERE status = 'open') as active_hackathons,
  (SELECT COUNT(*) FROM public.chapters) as total_chapters;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_stats ON public.dashboard_stats((1));

-- Function to refresh stats (call this periodically or via trigger)
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ENABLE ROW LEVEL SECURITY OPTIMIZATIONS
-- ============================================

-- Analyze tables for query planner optimization
ANALYZE public.registrations;
ANALYZE public.hackathons;
ANALYZE public.past_events;
ANALYZE public.workshops;
ANALYZE public.chapters;
ANALYZE public.photo_gallery;
ANALYZE public.success_stories;
ANALYZE public.registration_forms;

-- ============================================
-- QUERY OPTIMIZATION HINTS
-- ============================================

COMMENT ON INDEX idx_registrations_status IS 'Optimizes filtering by registration status';
COMMENT ON INDEX idx_hackathons_status IS 'Optimizes filtering hackathons by status';
COMMENT ON INDEX idx_hackathons_slug IS 'Optimizes hackathon lookup by slug';

-- ============================================
-- PERFORMANCE MONITORING
-- ============================================

-- Enable pg_stat_statements for query performance monitoring
-- (This is usually enabled by default in Supabase)

-- View slow queries (run this separately to check performance):
-- SELECT query, calls, total_time, mean_time 
-- FROM pg_stat_statements 
-- ORDER BY mean_time DESC 
-- LIMIT 20;

-- ============================================
-- NOTE: VACUUM Commands
-- ============================================
-- VACUUM cannot run inside a transaction block.
-- Run these separately if needed (usually not required in Supabase):
-- VACUUM ANALYZE public.registrations;
-- VACUUM ANALYZE public.hackathons;
