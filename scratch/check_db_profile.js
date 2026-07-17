const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
let env = {};
try {
  const envContent = fs.readFileSync(path.resolve(__dirname, '../.env.local'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
} catch (e) {
  console.error("Could not read .env.local", e);
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Environment variables missing!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Querying 'profil_dusun' with .eq('id', 1).single()...");
  const { data, error } = await supabase
    .from('profil_dusun')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error("Error executing query:", error);
  } else {
    console.log("Data retrieved successfully:");
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
