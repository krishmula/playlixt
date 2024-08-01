import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bggkcjhqetwpugypahcb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZ2tjamhxZXR3cHVneXBhaGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI0NDM4MjYsImV4cCI6MjAzODAxOTgyNn0.KtcTzCVf2tqr8I0Nvp6QV5f-2ltzCfIo_DpjhuV4AcM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

