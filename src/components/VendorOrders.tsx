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
      const res = await fetch('/api/vendors/me', {
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
      const res = await fetch('/api/vendors/orders', {
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
      const res = await fetch(`/api/vendors/orders/${id}/status`, {
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
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fulfillment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((o) => (
              <tr key={o.vendorOrder.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{o.order.paystackReference}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(o.order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(o.vendorOrder.subtotalCents / 100).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    o.vendorOrder.fulfillmentStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                    o.vendorOrder.fulfillmentStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    o.vendorOrder.fulfillmentStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {o.vendorOrder.fulfillmentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    o.vendorOrder.payoutStatus === 'paid' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {o.vendorOrder.payoutStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <select
                    value={o.vendorOrder.fulfillmentStatus}
                    onChange={(e) => updateStatus(o.vendorOrder.id, e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
              <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
