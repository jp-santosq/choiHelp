import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ajopddkntqvjagosunft.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqb3BkZGtudHF2amFnb3N1bmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0ODcwOTYsImV4cCI6MjA2ODA2MzA5Nn0.FmZEMtusBbEM3JoZ7uVoKJrmWUz9vVPCYRI4VONw_rE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);