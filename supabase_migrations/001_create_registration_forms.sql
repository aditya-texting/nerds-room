-- Create registration_forms table
CREATE TABLE IF NOT EXISTS public.registration_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.registration_forms ENABLE ROW LEVEL SECURITY;

-- Allow public to read active forms
CREATE POLICY "Allow public read access to active forms"
ON public.registration_forms
FOR SELECT
USING (is_active = true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated full access"
ON public.registration_forms
FOR ALL
USING (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_registration_forms_created_at 
ON public.registration_forms(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_registration_forms_is_active 
ON public.registration_forms(is_active);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.registration_forms
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.registration_forms TO authenticated;
GRANT SELECT ON public.registration_forms TO anon;

COMMENT ON TABLE public.registration_forms IS 'Custom registration forms for hackathons and events';
COMMENT ON COLUMN public.registration_forms.fields IS 'JSON array of form field definitions with type, label, required, options';
