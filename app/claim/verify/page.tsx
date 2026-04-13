'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Missing verification token.');
        return;
      }

      try {
        const response = await fetch(`/api/claim/verify?token=${encodeURIComponent(token)}`);

        if (response.ok) {
          setStatus('success');
          setMessage('Your listing has been verified!');
          // Redirect to success page after 2 seconds
          setTimeout(() => {
            router.push('/claim/success');
          }, 2000);
        } else if (response.status === 404) {
          setStatus('error');
          setMessage('Invalid or expired verification token.');
        } else {
          setStatus('error');
          setMessage('An error occurred during verification. Please try again.');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setStatus('error');
        setMessage('Network error. Please check your connection and try again.');
      }
    };

    verifyToken();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F3] to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B3E2E] mx-auto mb-6"></div>
            <h1 className="font-serif text-3xl font-bold text-[#6B3E2E] mb-4">
              Verifying Your Listing
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your ownership...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="mb-6">
              <svg
                className="h-16 w-16 text-green-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold text-green-600 mb-4">
              Verification Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting you to the success page...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="mb-6">
              <svg
                className="h-16 w-16 text-red-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0-6a4 4 0 11-8 0 4 4 0 018 0zm-12 0a6 6 0 1112 0 6 6 0 01-12 0z"
                />
              </svg>
            </div>
            <h1 className="font-serif text-3xl font-bold text-red-600 mb-4">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                If you continue to experience issues, please contact support.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-[#6B3E2E] text-white rounded-lg hover:bg-[#5A3321] transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
