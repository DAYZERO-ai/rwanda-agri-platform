-- Rwanda Agriculture Platform: core tables + anon RLS (custom email/password auth, not Supabase Auth)
CREATE TABLE IF NOT EXISTS farmers (
  id TEXT PRIMARY KEY,
  full_name TEXT, email TEXT, phone TEXT, district TEXT, sector TEXT, crop_id TEXT,
  status TEXT DEFAULT 'pending', joined TEXT, revenue NUMERIC DEFAULT 0,
  password TEXT DEFAULT 'rwandaagri2025', created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS farm_records (
  id TEXT PRIMARY KEY, farmer_id TEXT, type TEXT, crop_id TEXT,
  quantity NUMERIC DEFAULT 0, unit_price NUMERIC DEFAULT 0, amount NUMERIC DEFAULT 0,
  category TEXT, party TEXT, notes TEXT, date TEXT, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tutorials (
  id TEXT PRIMARY KEY, crop_id TEXT, title TEXT, title_rw TEXT, summary TEXT, summary_rw TEXT,
  season TEXT, duration TEXT, youtube_url TEXT, wallpaper_url TEXT,
  steps JSONB DEFAULT '[]'::jsonb, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS market_prices (
  id TEXT PRIMARY KEY, crop_id TEXT, district TEXT, market TEXT,
  retail NUMERIC DEFAULT 0, wholesale NUMERIC DEFAULT 0, previous NUMERIC DEFAULT 0,
  unit TEXT, date TEXT, published BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS payment_requests (
  id TEXT PRIMARY KEY, farmer_id TEXT, farmer_name TEXT, method TEXT,
  amount NUMERIC DEFAULT 0, txn_id TEXT, status TEXT DEFAULT 'pending',
  submitted TEXT, created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['farmers','farm_records','tutorials','market_prices','payment_requests'] LOOP
    EXECUTE format('CREATE POLICY anon_read_%1$s ON %1$I FOR SELECT TO anon USING (true);', t);
    EXECUTE format('CREATE POLICY anon_write_%1$s ON %1$I FOR INSERT TO anon WITH CHECK (true);', t);
    EXECUTE format('CREATE POLICY anon_update_%1$s ON %1$I FOR UPDATE TO anon USING (true) WITH CHECK (true);', t);
    EXECUTE format('CREATE POLICY anon_delete_%1$s ON %1$I FOR DELETE TO anon USING (true);', t);
  END LOOP;
END $$;
