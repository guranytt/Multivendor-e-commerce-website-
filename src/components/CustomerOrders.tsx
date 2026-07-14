import { useState, useEffect } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useAuth } from './AuthProvider';

export default function CustomerOrders() {
  const { user } = useAuth();
  const { getToken } = useClerkAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    const token = await getToken();
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

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-action-orange"></div>
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="font-headline-lg text-headline-lg font-bold mb-6">Your Order History</h2>
      {orders.length === 0 ? (
        <div className="bg-surface-white rounded-lg shadow-[0px_20px_25px_rgba(10,10,10,0.05)] p-8 text-center text-on-surface-variant">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface-white rounded-lg shadow-[0px_20px_25px_rgba(10,10,10,0.05)] border border-surface-variant overflow-hidden">
              <div className="bg-surface-container-low px-6 py-4 border-b border-surface-variant flex justify-between items-center">
                <div>
                  <p className="text-sm text-on-surface-variant">Order Placed</p>
                  <p className="font-medium text-on-surface">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Total</p>
                  <p className="font-medium text-on-surface">${(order.totalCents / 100).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-on-surface-variant">Reference</p>
                  <p className="font-medium text-on-surface">{order.paystackReference}</p>
                </div>
              </div>
              <div className="px-6 py-4">
                <h4 className="text-sm font-semibold text-on-surface mb-4 uppercase tracking-wider">Shipments</h4>
                <div className="space-y-4">
                  {order.vendorOrders.map((vo: any) => (
                    <div key={vo.id} className="border border-surface-variant rounded p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-on-surface">{vo.vendorShopName}</p>
                        <p className="text-sm text-on-surface-variant">Subtotal: ${(vo.subtotalCents / 100).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          vo.fulfillmentStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                          vo.fulfillmentStatus === 'shipped' ? 'bg-primary-container text-on-primary-container ' :
                          vo.fulfillmentStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {vo.fulfillmentStatus}
                        </span>
                        {vo.shippedAt && <p className="text-xs text-on-surface-variant mt-1">Shipped: {new Date(vo.shippedAt).toLocaleDateString()}</p>}
                        {vo.deliveredAt && <p className="text-xs text-on-surface-variant mt-1">Delivered: {new Date(vo.deliveredAt).toLocaleDateString()}</p>}
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
