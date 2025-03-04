import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = 'https://rygvbhetquwltojwczhr.supabase.co';
<<<<<<< HEAD
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
=======
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
>>>>>>> 3fe335ee0c511d634e43a9cfa3603ec30b80b5db

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
