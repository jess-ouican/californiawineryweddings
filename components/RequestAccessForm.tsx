'use client';

import { useState } from 'react';

interface Props {
  slug: string;
  wineryName: string;
}

export default function RequestAccessForm({ slug, wineryName }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/dashboard/request-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Access link sent!');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <div className="text-4xl mb-4">📬</div>
        <p className="text-green-700 font-semibold text-lg mb-2">Check your email!</p>
        <p className="text-gray-600 text-sm">{message}</p>
        <p className="text-gray-500 text-xs mt-3">
          The link will sign you in automatically and stay active for 30 days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-gray-700 text-sm mb-4">
        Click below to send a sign-in link to the verified owner email for{' '}
        <strong>{wineryName}</strong>.
      </p>

      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-[#6B3E2E] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#5A3321] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Me an Access Link'
        )}
      </button>
    </form>
  );
}
