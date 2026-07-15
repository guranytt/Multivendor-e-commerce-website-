import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

export default function VendorOrders() {
  const { getToken } = useClerkAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [vendorStatus, setVendorStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchVendorStatus();
  }, []);

  const fetchVendorStatus = async () => {
    const token = await getToken();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/vendors/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVendorStatus(data.status);
        if (data.status === 'approved') {
          fetchOrders(token!);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrders = async (token: string) => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/vendors/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    const token = await getToken();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/vendors/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders(token!);
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (vendorStatus !== 'approved') return null;

  return (
    <div className="mt-8 bg-surface-white p-6 rounded-lg shadow">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Manage Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Fulfillment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Payout</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-on-surface-variant uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-surface-white divide-y divide-gray-200">
            {orders.map((o) => (
              <tr key={o.vendorOrder.id}>
                <td className="px-6 py-4 whitespace-nowrap font-label-md text-label-md text-on-surface text-on-surface">#{o.order.paystackReference}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{new Date(o.order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">${(o.vendorOrder.subtotalCents / 100).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    o.vendorOrder.fulfillmentStatus === 'delivered' ? 'bg-[#d1fae5] text-[#065f46]' :
                    o.vendorOrder.fulfillmentStatus === 'shipped' ? 'bg-primary-container text-on-primary-container text-primary' :
                    o.vendorOrder.fulfillmentStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-surface-container text-on-surface'
                  }`}>
                    {o.vendorOrder.fulfillmentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    o.vendorOrder.payoutStatus === 'paid' ? 'bg-[#d1fae5] text-[#065f46]' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {o.vendorOrder.payoutStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-label-md text-label-md text-on-surface">
                  <select
                    value={o.vendorOrder.fulfillmentStatus}
                    onChange={(e) => updateStatus(o.vendorOrder.id, e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-surface-variant focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-on-surface-variant">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
