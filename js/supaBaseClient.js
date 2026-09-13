const SUPABASE_URL= "https://ynpiszwcyjfoahgzqhyl.supabase.co"
const SUPABASE_ANON_KEY= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucGlzendjeWpmb2FoZ3pxaHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNDk5NjcsImV4cCI6MjEwNDcyNTk2N30.NKyQWwRnKCJI2pnaX-uwF6B4lgMr3w2U2nmRDctW9Ng"

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);