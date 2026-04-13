'use client';

import { useState } from 'react';
import { LeadFormData } from '@/lib/types';

interface LeadFormProps {
  wineryName?: string;
  region?: string;
  placeId?: string;
}

export default function LeadForm({ wineryName, region, placeId }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    weddingDate: '',
    guestCount: '',
    preferredRegion: region || '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          wineryName,
          placeId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        weddingDate: '',
        guestCount: '',
        preferredRegion: region || '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B3E2E]"
            placeholder="Sarah"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B3E2E]"
            placeholder="Smith"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B3E2E]"
            placeholder="sarah@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B3E2E]"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="weddingDate" className="block text-sm font-medium text-gray-700 mb-1">
            Wedding Date *
          </label>
          <input
            type="date"
            id="weddingDate"
            name="weddingDate"
            value={formData.weddingDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B3E2E]"
          />
        </div>
        <div>
          <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Guest Count *
          </label>
          <select
            id="guestCount"
            name="guestCount"
            value={formData.guestCount}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B3E2E]"
          >
            <option value="">Select...</option>
            <option value="25-50">25-50</option>
            <option value="50-75">50-75</option>
            <option value="75-100">75-100</option>
            <option value="100-150">100-150</option>
            <option value="150-200">150-200</option>
            <option value="200+">200+</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="preferredRegion" className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Region
        </label>
        <input
          type="text"
          id="preferredRegion"
          name="preferredRegion"
          value={formData.preferredRegion}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B3E2E]"
          placeholder="e.g., Napa, Sonoma, Temecula"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Additional Notes
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B3E2E]"
          placeholder="Tell us about your vision for your wedding day..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#6B3E2E] hover:bg-[#5a3422] text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Request Information'}
      </button>

      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
          Thank you! We'll be in touch soon with information about this venue.
        </div>
      )}
    </form>
  );
}
