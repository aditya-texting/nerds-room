-- Add registration_type and managed_form_id columns to hackathons table

-- Add registration_type column (external or managed)
ALTER TABLE public.hackathons 
ADD COLUMN IF NOT EXISTS registration_type TEXT DEFAULT 'external' CHECK (registration_type IN ('external', 'managed'));

-- Add managed_form_id column (UUID reference to registration_forms)
ALTER TABLE public.hackathons 
ADD COLUMN IF NOT EXISTS managed_form_id UUID REFERENCES public.registration_forms(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_hackathons_registration_type 
ON public.hackathons(registration_type);

CREATE INDEX IF NOT EXISTS idx_hackathons_managed_form_id 
ON public.hackathons(managed_form_id);

-- Update existing hackathons to have 'external' type if they have registration_link
UPDATE public.hackathons 
SET registration_type = 'external' 
WHERE registration_link IS NOT NULL AND registration_type IS NULL;

COMMENT ON COLUMN public.hackathons.registration_type IS 'Type of registration: external (Google Form, etc.) or managed (own form)';
COMMENT ON COLUMN public.hackathons.managed_form_id IS 'Reference to registration_forms table when type is managed';
