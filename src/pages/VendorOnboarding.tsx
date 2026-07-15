import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function VendorOnboarding() {
  const { getToken } = useClerkAuth();
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = await getToken();

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/vendors/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          shopName,
          description,
          bankName,
          bankAccountNumber,
          bankAccountName
        }),
      });

      if (res.ok) {
        // Will need to re-fetch session or role in a real app, but for now we reload
        window.location.href = '/vendor';
      } else {
        const err = await res.json();
        alert('Error: ' + err.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-slate min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-surface-white mt-12 rounded-xl shadow-[0px_20px_25px_rgba(10,10,10,0.05)] border border-surface-variant p-8">
        <Link to="/" className="font-display-lg text-display-lg font-black text-action-orange block text-center mb-8">
          Naija Online Stores
        </Link>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Become a Vendor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-label-md text-label-md text-on-surface">Shop Name</label>
          <input
            type="text"
            required
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="mt-1 block w-full border border-surface-variant rounded-lg p-3 font-body-md text-body-md bg-surface-white focus:border-action-orange focus:ring-1 focus:ring-action-orange transition-all"
          />
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border border-surface-variant rounded-lg p-3 font-body-md text-body-md bg-surface-white focus:border-action-orange focus:ring-1 focus:ring-action-orange transition-all"
            rows={3}
          />
        </div>
        
        <h3 className="font-title-lg text-title-lg text-on-surface pt-4 border-t">Payout Bank Details</h3>
        <div>
          <label className="block font-label-md text-label-md text-on-surface">Bank Name</label>
          <input
            type="text"
            required
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            className="mt-1 block w-full border border-surface-variant rounded-lg p-3 font-body-md text-body-md bg-surface-white focus:border-action-orange focus:ring-1 focus:ring-action-orange transition-all"
          />
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface">Account Number</label>
          <input
            type="text"
            required
            value={bankAccountNumber}
            onChange={(e) => setBankAccountNumber(e.target.value)}
            className="mt-1 block w-full border border-surface-variant rounded-lg p-3 font-body-md text-body-md bg-surface-white focus:border-action-orange focus:ring-1 focus:ring-action-orange transition-all"
          />
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface">Account Name</label>
          <input
            type="text"
            required
            value={bankAccountName}
            onChange={(e) => setBankAccountName(e.target.value)}
            className="mt-1 block w-full border border-surface-variant rounded-lg p-3 font-body-md text-body-md bg-surface-white focus:border-action-orange focus:ring-1 focus:ring-action-orange transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-action-orange text-white text-white p-3 rounded-md hover:bg-primary"
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
    </div>
  );
}
