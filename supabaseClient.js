import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vuonnshhvyphssdoxrof.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1b25uc2hodnlwaHNzZG94cm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDQ0OTMsImV4cCI6MjA4MTU4MDQ5M30._fYNLqUo5-IGu8-D1dqZKMB8RLQEQC_THmDDCZQDTC8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
