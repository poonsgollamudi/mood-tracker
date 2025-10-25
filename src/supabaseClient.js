import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log("Environment check:");
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key exists:", !!supabaseKey);
console.log(
  "All env vars:",
  Object.keys(process.env).filter((key) => key.startsWith("REACT_APP_"))
);

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials!");
  console.error("Make sure .env file exists in project root with:");
  console.error("REACT_APP_SUPABASE_URL=your_url");
  console.error("REACT_APP_SUPABASE_ANON_KEY=your_key");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseKey || "placeholder-key"
);
