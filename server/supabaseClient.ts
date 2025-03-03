import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = 'https://rygvbhetquwltojwczhr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
