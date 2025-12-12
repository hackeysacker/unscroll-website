import { supabase } from './supabase';

export interface EmailSubmission {
  email: string;
  subject?: string;
  message: string;
  name?: string;
  source?: string; // e.g., 'waitlist', 'homepage', 'contact-form', etc.
}

export async function saveEmailSubmission(submission: EmailSubmission) {
  try {
    const { data, error } = await supabase
      .from('email_submissions')
      .insert({
        email: submission.email,
        subject: submission.subject || null,
        message: submission.message,
        name: submission.name || null,
        source: submission.source || 'website',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving email submission:', error);
      // Provide more helpful error messages
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        throw new Error('Database table not found. Please run the SQL migration in Supabase.');
      }
      if (error.code === '42501' || error.message?.includes('permission denied')) {
        throw new Error('Permission denied. Please check Row Level Security policies in Supabase.');
      }
      if (error.message) {
        throw new Error(error.message);
      }
      throw error;
    }

    return data;
  } catch (err) {
    console.error('Error saving email submission:', err);
    // Re-throw with better error message if it's our custom error
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Failed to save email submission. Please check the console for details.');
  }
}

export async function getEmailSubmissions(limit = 100) {
  try {
    const { data, error } = await supabase
      .from('email_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching email submissions:', error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error('Error fetching email submissions:', err);
    throw err;
  }
}

/**
 * Test function to verify Supabase connection and table exists
 * Useful for debugging
 */
export async function testEmailSubmissionConnection() {
  try {
    // Try a simple query to see if table exists and is accessible
    const { data, error } = await supabase
      .from('email_submissions')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        return { success: false, error: 'Table does not exist. Please run the SQL migration.' };
      }
      if (error.code === '42501' || error.message?.includes('permission denied')) {
        return { success: false, error: 'Permission denied. Please check RLS policies.' };
      }
      return { success: false, error: error.message || 'Unknown error' };
    }

    return { success: true, message: 'Connection successful' };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Connection failed' 
    };
  }
}

