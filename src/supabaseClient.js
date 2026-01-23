import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Security-safe debug logs
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("DEBUG: Supabase environment variables are MISSING from .env!");
} else {
    console.log("DEBUG: Supabase Client attempting to connect to:", supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)