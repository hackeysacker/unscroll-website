-- Create email_submissions table to store contact form submissions
CREATE TABLE IF NOT EXISTS email_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_submissions_email ON email_submissions(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_email_submissions_created_at ON email_submissions(created_at DESC);

-- Create index on source for filtering
CREATE INDEX IF NOT EXISTS idx_email_submissions_source ON email_submissions(source);

-- Enable Row Level Security (RLS)
ALTER TABLE email_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for contact form submissions)
-- Drop policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous inserts" ON email_submissions;
CREATE POLICY "Allow anonymous inserts" ON email_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow public role inserts (for edge runtime/API routes)
DROP POLICY IF EXISTS "Allow public inserts" ON email_submissions;
CREATE POLICY "Allow public inserts" ON email_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);
  
-- Also allow service_role for server-side operations
DROP POLICY IF EXISTS "Allow service role inserts" ON email_submissions;
CREATE POLICY "Allow service role inserts" ON email_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all submissions (for admin access)
-- Drop policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated reads" ON email_submissions;
CREATE POLICY "Allow authenticated reads" ON email_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on update
CREATE TRIGGER update_email_submissions_updated_at
  BEFORE UPDATE ON email_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE email_submissions IS 'Stores contact form submissions and email inquiries from the website';

