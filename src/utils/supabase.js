import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseAnonKey ? 'exists' : 'missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);