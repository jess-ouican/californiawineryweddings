'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ClaimFormProps {
  wineryName: string;
  placeId: string;
  slug: string;
}

export default function ClaimForm({ wineryName, placeId, slug }: ClaimFormProps) {
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    role: 'Manager',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId,
          wineryName,
          ownerName: formData.ownerName,
          ownerEmail: formData.ownerEmail,
          role: formData.role,
          listingURL: `/wineries/${slug}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to submit claim. Please try again.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 max-w-md mx-auto text-center">
        <div className="text-green-600 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#6B3E2E] mb-4">
          Claim Request Submitted!
        </h2>
        <p className="text-gray-700 mb-6">
          We've sent a verification email to <strong>{formData.ownerEmail}</strong>. 
          Click the link in the email to verify your ownership and unlock the "Verified Owner" badge.
        </p>
        <p className="text-sm text-gray-600 mb-6">
          The link expires in 24 hours.
        </p>
        <Link
          href={`/wineries/${slug}`}
          className="inline-block bg-[#6B3E2E] text-white px-6 py-2 rounded-lg hover:bg-[#5a3422] transition"
        >
          Return to Listing
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-serif font-bold text-[#6B3E2E] mb-6">
        Claim Your Listing
      </h2>
      <p className="text-gray-600 mb-6">
        Verify ownership of <strong>{wineryName}</strong> to display a "Verified Owner" badge.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Name *
        </label>
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B3E2E] focus:border-transparent outline-none"
          placeholder="John Smith"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          name="ownerEmail"
          value={formData.ownerEmail}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B3E2E] focus:border-transparent outline-none"
          placeholder="owner@winery.com"
        />
        <p className="text-xs text-gray-500 mt-1">
          Must be a domain email (e.g., your-winery.com). 
          <span className="hidden">For testing: test@californiawineryweddings.com bypasses validation</span>
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Role *
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6B3E2E] focus:border-transparent outline-none"
        >
          <option value="Owner">Owner</option>
          <option value="Manager">Manager</option>
          <option value="Marketing">Marketing Director</option>
          <option value="Events">Events Coordinator</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#6B3E2E] text-white py-2 rounded-lg hover:bg-[#5a3422] transition disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Verify Ownership'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        We'll send a verification link to confirm your ownership.
      </p>
    </form>
  );
}
