import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { saveEmailSubmission, testEmailSubmissionConnection } from '@/lib/email-submissions';

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Test connection on component mount (only in development)
  useEffect(() => {
    if (import.meta.env.DEV) {
      testEmailSubmissionConnection().then((result) => {
        if (!result.success) {
          console.warn('Email submission connection test failed:', result.error);
        }
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !message) {
      setErrorMessage('Please fill in email and message fields');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await saveEmailSubmission({
        email,
        name: name || undefined,
        subject: subject || undefined,
        message,
        source: 'website',
      });

      setSubmitStatus('success');
      setEmail('');
      setName('');
      setSubject('');
      setMessage('');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmitStatus('error');
      
      // Show more specific error messages
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        setErrorMessage(String(error.message));
      } else {
        setErrorMessage('Failed to send message. Please check the browser console for details and ensure the database table is set up.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name (optional)</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject (optional)</Label>
        <Input
          id="subject"
          type="text"
          placeholder="What's this about?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="Tell us how we can help..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          disabled={isSubmitting}
        />
      </div>

      {submitStatus === 'error' && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{errorMessage || 'An error occurred. Please try again.'}</span>
        </div>
      )}

      {submitStatus === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm">Message sent successfully! We'll get back to you soon.</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || submitStatus === 'success'}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}

