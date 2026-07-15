import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

type Vendor = {
  id: number;
  shopName: string;
  status: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
};

export default function AdminVendors() {
  const { getToken } = useClerkAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const fetchVendors = async () => {
    const token = await getToken();

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/vendors', {
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
    const token = await getToken();

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/vendors/${id}/approve`, {
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
    <div className="mt-8 bg-surface-white p-6 rounded-lg shadow">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Manage Vendors</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Shop Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Bank Details</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-on-surface-variant uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-surface-white divide-y divide-gray-200">
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td className="px-6 py-4 whitespace-nowrap font-label-md text-label-md text-on-surface text-on-surface">{vendor.shopName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    vendor.status === 'approved' ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                  {vendor.bankName} - {vendor.bankAccountNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-label-md text-label-md text-on-surface">
                  {vendor.status === 'pending' && (
                    <button onClick={() => handleApprove(vendor.id)} className="text-action-orange hover:text-blue-900">
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-on-surface-variant">No vendors found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
