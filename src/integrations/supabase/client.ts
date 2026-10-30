import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uyrjvysjwzgmxqkmpmut.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cmp2eXNqd3pnbXhxa21wbXV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwMDE0ODIsImV4cCI6MjEwODU3NzQ4Mn0.WSdx_G1apZ6Dbn-5_mPkwbG8WK_eeNmG-EGrqa7Md3M";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
