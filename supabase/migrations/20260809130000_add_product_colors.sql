-- Product colors: lets a product offer multiple colour options (name + swatch + optional photo)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS colors jsonb NOT NULL DEFAULT '[]'::jsonb;
