import { createClient } from "@supabase/supabase-js";


const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  throw new Error("Missing Supabase env variables");
}

const supabase = createClient(url, key);

console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY:", process.env.SUPABASE_SERVICE_KEY);

export default supabase;
