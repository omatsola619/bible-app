// Supabase Configuration
// Replace these with your actual Supabase project URL and anon key
// You can find these in your Supabase project dashboard under Settings > API

export const SUPABASE_CONFIG = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://xykwdaxrcxtagqbubnyj.supabase.co',
  anonKey:
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5a3dkYXhyY3h0YWdxYnVibnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNjgwNjgsImV4cCI6MjA3NDk0NDA2OH0.E1l4Fh92yuVneMjUgcgbLW4Rn9T-6PBdYnhmpXq-MZk',
}

// Example values (replace with your actual values):
// url: 'https://your-project-id.supabase.co'
// anonKey: 'your-anon-key-here'
