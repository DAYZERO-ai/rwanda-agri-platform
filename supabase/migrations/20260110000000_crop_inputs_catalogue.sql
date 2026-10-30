-- Crop input catalogue: fertilizers + farm materials (ibikoresho)
-- Public read/write so the admin portal can manage the catalogue without a
-- dedicated auth flow; prices are market reference values in RWF.

create table if not exists public.fertilizers (
  id text primary key,
  name text not null,
  name_rw text not null default '',
  crop_ids text[] not null default '{}',
  kg_per_hectare numeric not null default 0,
  unit_price_frw numeric not null default 0,
  image_url text not null default '',
  description text not null default '',
  description_rw text not null default '',
  application_stage text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.farm_materials (
  id text primary key,
  name text not null,
  name_rw text not null default '',
  crop_ids text[] not null default '{}',
  quantity_per_hectare numeric not null default 0,
  unit text not null default 'pieces',
  unit_price_frw numeric not null default 0,
  image_url text not null default '',
  description text not null default '',
  description_rw text not null default '',
  category text not null default 'Tools',
  created_at timestamptz not null default now()
);

alter table public.fertilizers enable row level security;
alter table public.farm_materials enable row level security;

drop policy if exists "fertilizers read" on public.fertilizers;
drop policy if exists "fertilizers write" on public.fertilizers;
drop policy if exists "fertilizers update" on public.fertilizers;
drop policy if exists "fertilizers delete" on public.fertilizers;

create policy "fertilizers read" on public.fertilizers
  for select to anon, authenticated using (true);
create policy "fertilizers write" on public.fertilizers
  for insert to anon, authenticated with check (true);
create policy "fertilizers update" on public.fertilizers
  for update to anon, authenticated using (true) with check (true);
create policy "fertilizers delete" on public.fertilizers
  for delete to anon, authenticated using (true);

drop policy if exists "materials read" on public.farm_materials;
drop policy if exists "materials write" on public.farm_materials;
drop policy if exists "materials update" on public.farm_materials;
drop policy if exists "materials delete" on public.farm_materials;

create policy "materials read" on public.farm_materials
  for select to anon, authenticated using (true);
create policy "materials write" on public.farm_materials
  for insert to anon, authenticated with check (true);
create policy "materials update" on public.farm_materials
  for update to anon, authenticated using (true) with check (true);
create policy "materials delete" on public.farm_materials
  for delete to anon, authenticated using (true);

create index if not exists fertilizers_crop_ids_idx on public.fertilizers using gin (crop_ids);
create index if not exists farm_materials_crop_ids_idx on public.farm_materials using gin (crop_ids);