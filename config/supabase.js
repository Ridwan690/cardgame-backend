// config/supabase.js
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // penting! pakai yang role (bukan anon key)
);

module.exports = supabase;
