import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthProvider';

export default function CustomerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    try {
      const res = await fetch('/api/orders/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Your Order History</h2>
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow border overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Order Placed</p>
                  <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium text-gray-900">${(order.totalCents / 100).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="font-medium text-gray-900">{order.paystackReference}</p>
                </div>
              </div>
              <div className="px-6 py-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Shipments</h4>
                <div className="space-y-4">
                  {order.vendorOrders.map((vo: any) => (
                    <div key={vo.id} className="border rounded p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{vo.vendorShopName}</p>
                        <p className="text-sm text-gray-500">Subtotal: ${(vo.subtotalCents / 100).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          vo.fulfillmentStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          vo.fulfillmentStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          vo.fulfillmentStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {vo.fulfillmentStatus}
                        </span>
                        {vo.shippedAt && <p className="text-xs text-gray-500 mt-1">Shipped: {new Date(vo.shippedAt).toLocaleDateString()}</p>}
                        {vo.deliveredAt && <p className="text-xs text-gray-500 mt-1">Delivered: {new Date(vo.deliveredAt).toLocaleDateString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
