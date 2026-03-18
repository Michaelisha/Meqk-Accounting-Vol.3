import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tapnftddkxriffhkeeig.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhcG5mdGRka3hyaWZmaGtlZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MzExMDIsImV4cCI6MjA4OTAwNzEwMn0.z3TISbmXq8UfC8ZPf1ezFGtcpZbZ-ng9c0X5UuxCt7U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
