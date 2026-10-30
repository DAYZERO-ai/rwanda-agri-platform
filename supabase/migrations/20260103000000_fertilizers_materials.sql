-- Fertilizer recommendations and farm materials (ibikoresho) with Rwanda market prices.

CREATE TABLE IF NOT EXISTS public.fertilizers (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_rw text NOT NULL DEFAULT '',
  crop_ids text[] NOT NULL DEFAULT '{}',
  kg_per_hectare numeric NOT NULL DEFAULT 0,
  unit_price_frw numeric NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  description_rw text NOT NULL DEFAULT '',
  application_stage text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.farm_materials (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_rw text NOT NULL DEFAULT '',
  crop_ids text[] NOT NULL DEFAULT '{}',
  quantity_per_hectare numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'pieces',
  unit_price_frw numeric NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  description_rw text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Tools',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.fertilizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "fertilizers public read" ON public.fertilizers;
CREATE POLICY "fertilizers public read" ON public.fertilizers
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "fertilizers public write" ON public.fertilizers;
CREATE POLICY "fertilizers public write" ON public.fertilizers
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "fertilizers public update" ON public.fertilizers;
CREATE POLICY "fertilizers public update" ON public.fertilizers
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "fertilizers public delete" ON public.fertilizers;
CREATE POLICY "fertilizers public delete" ON public.fertilizers
  FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "materials public read" ON public.farm_materials;
CREATE POLICY "materials public read" ON public.farm_materials
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "materials public write" ON public.farm_materials;
CREATE POLICY "materials public write" ON public.farm_materials
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "materials public update" ON public.farm_materials;
CREATE POLICY "materials public update" ON public.farm_materials
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "materials public delete" ON public.farm_materials;
CREATE POLICY "materials public delete" ON public.farm_materials
  FOR DELETE TO anon, authenticated USING (true);