
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvtovirtnnjdttwkwufc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2dG92aXJ0bm5qZHR0d2t3dWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNjgxNTEsImV4cCI6MjA2MTc0NDE1MX0.jGoy5UY5g0i4bmrT7hHiudzLsPXCmWGdojIXB_Ie0a8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
