import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Vendor = {
  id: number;
  shopName: string;
  status: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
};

export default function AdminVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const fetchVendors = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch('/api/vendors', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setVendors(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch vendors', error);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleApprove = async (id: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch(`/api/vendors/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchVendors();
      }
    } catch (error) {
      console.error('Failed to approve vendor', error);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Manage Vendors</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Details</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.shopName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    vendor.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {vendor.bankName} - {vendor.bankAccountNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {vendor.status === 'pending' && (
                    <button onClick={() => handleApprove(vendor.id)} className="text-blue-600 hover:text-blue-900">
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No vendors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
