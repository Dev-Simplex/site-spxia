import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tdthuluyohqtmdhegjhf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkdGh1bHV5b2hxdG1kaGVnamhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NzA4MDMsImV4cCI6MjA4OTM0NjgwM30.TrrSs4-aB7JTqqbr6I4lHVGAsmVWRvmgcHne0LpE7-M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
