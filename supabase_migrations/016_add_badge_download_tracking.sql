-- Create a table to track badge downloads with IP and User Agent
CREATE TABLE IF NOT EXISTS public.badge_download_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    hackathon_id INTEGER REFERENCES public.hackathons(id),
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.badge_download_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own logs (though they probably don't need to)
CREATE POLICY "Users can view own download logs" 
ON public.badge_download_logs FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own logs
CREATE POLICY "Users can insert own download logs" 
ON public.badge_download_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all logs
CREATE POLICY "Admins can view all download logs" 
ON public.badge_download_logs FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.registrations 
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_badge_logs_user ON public.badge_download_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_badge_logs_hackathon ON public.badge_download_logs(hackathon_id);
