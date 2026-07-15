import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

export default function AdminPayouts() {
  const { getToken } = useClerkAuth();
  const [payoutGroups, setPayoutGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPayouts = async () => {
    const token = await getToken();
    try {
      const res = await fetch('/api/admin/payouts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setPayoutGroups(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handlePay = async (vendorId: number) => {
    const note = prompt('Enter payment reference note (e.g. Bank Transfer ID):');
    if (note === null) return; // cancelled

    setLoading(true);
    const token = await getToken();
    
    try {
      const res = await fetch(`/api/admin/payouts/${vendorId}/pay`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note })
      });
      if (res.ok) {
        alert('Payout marked as paid!');
        fetchPayouts();
      } else {
        alert('Failed to process payout');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-surface-white p-6 rounded-lg shadow">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Pending Payouts</h2>
      
      {payoutGroups.length === 0 ? (
        <p className="text-on-surface-variant">No pending payouts.</p>
      ) : (
        <div className="space-y-6">
          {payoutGroups.map((group) => (
            <div key={group.vendor.id} className="border rounded-lg p-6 bg-surface-container-low">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">{group.vendor.shopName}</h3>
                  <div className="text-sm text-on-surface-variant mt-1">
                    <p>Bank: <span className="font-medium">{group.vendor.bankName}</span></p>
                    <p>Account: <span className="font-medium">{group.vendor.bankAccountNumber}</span></p>
                    <p>Name: <span className="font-medium">{group.vendor.bankAccountName}</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-on-surface-variant">Total Owed</p>
                  <p className="font-headline-lg text-headline-lg text-on-surface text-on-surface">${(group.totalOwedCents / 100).toFixed(2)}</p>
                  <button 
                    onClick={() => handlePay(group.vendor.id)}
                    disabled={loading}
                    className="mt-2 bg-success-emerald text-white text-white px-4 py-2 rounded-md hover:bg-[#047857] disabled:opacity-50"
                  >
                    Mark as Paid
                  </button>
                </div>
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface text-on-surface mb-2">Orders Included ({group.orders.length})</p>
                <div className="max-h-32 overflow-y-auto border rounded p-2 bg-surface-white">
                  <ul className="text-xs text-on-surface-variant space-y-1">
                    {group.orders.map((o: any) => (
                      <li key={o.id} className="flex justify-between border-b last:border-0 py-1">
                        <span>Order #{o.orderId} (Sub-order #{o.id})</span>
                        <span className="font-medium">${(o.vendorPayoutCents / 100).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
