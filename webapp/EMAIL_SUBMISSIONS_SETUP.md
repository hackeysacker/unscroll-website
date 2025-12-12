# Email Submissions Setup Guide

This guide explains how to set up email submission storage in Supabase for the website contact form.

## Prerequisites

1. Supabase account and project
2. Access to Supabase SQL Editor

## Installation

### 1. Install Supabase Client

```bash
cd webapp
npm install @supabase/supabase-js
```

### 2. Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL migration file: `webapp/supabase-migrations/create_email_submissions_table.sql`

This will:
- Create the `email_submissions` table
- Set up indexes for performance
- Configure Row Level Security (RLS) policies
- Allow anonymous users to insert (for contact form)
- Allow authenticated users to read all submissions (for admin access)

## Database Schema

The `email_submissions` table has the following structure:

```sql
- id (UUID, Primary Key)
- email (TEXT, Required)
- name (TEXT, Optional)
- subject (TEXT, Optional)
- message (TEXT, Required)
- source (TEXT, Default: 'website')
- created_at (TIMESTAMPTZ, Auto)
- updated_at (TIMESTAMPTZ, Auto)
```

## Usage

### In the Website

The contact form is already integrated in `HomepagePlaceholder.tsx`. When users click "Contact Support", a dialog opens with the contact form.

### Accessing Submissions

To view submissions in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to Table Editor
3. Select the `email_submissions` table

Or use the provided function:

```typescript
import { getEmailSubmissions } from '@/lib/email-submissions';

const submissions = await getEmailSubmissions(50); // Get last 50 submissions
```

## Security

- **Row Level Security (RLS)** is enabled
- Anonymous users can INSERT (submit forms)
- Authenticated users can SELECT (view submissions)
- Only authenticated admin users should access the Supabase dashboard

## Testing

1. Start the webapp: `npm run dev`
2. Navigate to the homepage
3. Click "Contact Support"
4. Fill out and submit the form
5. Check Supabase dashboard to see the submission

