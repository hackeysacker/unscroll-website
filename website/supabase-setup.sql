-- Supabase Database Setup for Email Submissions
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Create email_submissions table
CREATE TABLE IF NOT EXISTS public.email_submissions (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  subject TEXT,
  message TEXT,
  source TEXT DEFAULT 'waitlist'
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_submissions_email ON public.email_submissions(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_email_submissions_created_at ON public.email_submissions(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.email_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.email_submissions;
DROP POLICY IF EXISTS "Allow public read access" ON public.email_submissions;

-- Create RLS policy to allow anyone to INSERT (for public waitlist form)
CREATE POLICY "Allow anonymous inserts"
ON public.email_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Create RLS policy to allow authenticated users to read all submissions
CREATE POLICY "Allow authenticated read access"
ON public.email_submissions
FOR SELECT
TO authenticated
USING (true);

-- Optional: Create a view for admin dashboard (counts, recent submissions, etc.)
CREATE OR REPLACE VIEW public.waitlist_stats AS
SELECT
  COUNT(*) as total_signups,
  COUNT(DISTINCT email) as unique_emails,
  MAX(created_at) as latest_signup,
  DATE_TRUNC('day', created_at) as signup_date,
  COUNT(*) as daily_signups
FROM public.email_submissions
WHERE source = 'waitlist'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY signup_date DESC;

-- Grant access to the view
GRANT SELECT ON public.waitlist_stats TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Setup complete! Your email_submissions table is ready.';
  RAISE NOTICE 'You can now submit emails from your website.';
  RAISE NOTICE 'View submissions at: https://supabase.com/dashboard/project/_/editor';
END $$;
