import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { saveEmailSubmission } from '@/lib/email-submissions';

interface WaitlistFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function WaitlistForm({ onSuccess, className }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      setSubmitStatus('error');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await saveEmailSubmission({
        email,
        message: 'Waitlist signup',
        subject: 'Waitlist Signup',
        source: 'waitlist',
      });

      setSubmitStatus('success');
      setEmail('');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      console.error('Failed to join waitlist:', error);
      setSubmitStatus('error');
      
      // Show more specific error messages
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        setErrorMessage(String(error.message));
      } else {
        setErrorMessage('Failed to join waitlist. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Label htmlFor="waitlist-email" className="sr-only">
            Email address
          </Label>
          <Input
            id="waitlist-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting || submitStatus === 'success'}
            className="w-full"
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || submitStatus === 'success'}
          className="whitespace-nowrap"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : submitStatus === 'success' ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Joined!
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Join Waitlist
            </>
          )}
        </Button>
      </div>

      {submitStatus === 'error' && (
        <div className="mt-2 flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMessage || 'An error occurred. Please try again.'}</span>
        </div>
      )}

      {submitStatus === 'success' && (
        <div className="mt-2 flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
          <CheckCircle2 className="h-4 w-4" />
          <span>You're on the list! We'll notify you when we launch.</span>
        </div>
      )}
    </form>
  );
}



