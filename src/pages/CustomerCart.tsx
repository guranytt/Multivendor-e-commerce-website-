import { useEffect, useState } from 'react';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

export default function CustomerCart() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useClerkAuth();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = await getToken();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setCart(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    const token = await getToken();
    try {
      if (quantity === 0) {
        await fetch((import.meta.env.VITE_API_URL || '') + `/api/cart/items/${itemId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await fetch((import.meta.env.VITE_API_URL || '') + `/api/cart/items/${itemId}`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity })
        });
      }
      fetchCart();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckout = async () => {
    const token = await getToken();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/checkout/simulate-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert("Payment simulated successfully! Orders generated.");
        fetchCart();
      } else {
        const err = await res.json();
        alert('Checkout failed: ' + err.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, group) => {
      return total + group.items.reduce((groupTotal: number, item: any) => {
        return groupTotal + (item.product.priceCents * item.quantity);
      }, 0);
    }, 0);
  };

  const subtotalCents = calculateSubtotal();

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-action-orange"></div></div>;

  const totalItems = cart.reduce((acc, group) => acc + group.items.length, 0);

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop py-xl">
      <h1 className="font-display-lg text-display-lg mb-lg">Shopping Cart</h1>
      
      {totalItems === 0 ? (
        <div className="text-center py-16 bg-surface-white rounded-xl shadow-sm border border-surface-variant/50">
          <span className="material-symbols-outlined text-6xl text-surface-variant mb-4">shopping_cart</span>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Your cart is empty</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/customer/categories" className="bg-action-orange text-white font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary transition-colors inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-md">
            <div className="hidden md:grid grid-cols-12 gap-sm pb-sm border-b border-surface-variant text-on-surface-variant font-label-md text-label-md">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">Total</div>
            </div>

            {cart.map((group: any) => (
              <div key={group.vendor.id} className="space-y-md">
                <div className="bg-surface-container-low px-4 py-2 rounded font-label-md text-label-md text-on-surface">
                  Sold by: {group.vendor.shopName}
                </div>
                {group.items.map((item: any) => (
                  <div key={item.id} className="bg-surface-white p-lg rounded-xl shadow-[0px_20px_25px_rgba(10,10,10,0.05)] hover:shadow-[0px_25px_30px_rgba(10,10,10,0.08)] hover:-translate-y-xs transition-all duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-md items-center">
                        <div className="col-span-1 md:col-span-6 flex items-start gap-md">
                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-surface-container flex items-center justify-center">
                              {item.product.images && item.product.images.length > 0 ? (
                                <img src={item.product.images[0].url} alt={item.product.title} className="w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-surface-variant">image</span>
                              )}
                            </div>
                            <div>
                                <h3 className="font-title-lg text-title-lg text-text-dark mb-xs">{item.product.title}</h3>
                                <button onClick={() => updateCartItem(item.id, 0)} className="mt-sm text-error hover:text-error-container font-label-sm text-label-sm transition-colors flex items-center gap-xs">
                                    <span className="material-symbols-outlined text-[16px]">delete</span> Remove
                                </button>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 flex justify-center">
                            <div className="flex items-center border border-surface-variant rounded-lg bg-surface-white h-10 w-24">
                                <button onClick={() => updateCartItem(item.id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center text-on-surface-variant hover:text-action-orange transition-colors"><span className="material-symbols-outlined text-[16px]">remove</span></button>
                                <span className="w-8 h-full text-center font-label-md text-label-md flex items-center justify-center text-on-surface">{item.quantity}</span>
                                <button onClick={() => updateCartItem(item.id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-on-surface-variant hover:text-action-orange transition-colors"><span className="material-symbols-outlined text-[16px]">add</span></button>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2 text-right hidden md:block">
                            <span className="font-body-lg text-body-lg text-on-surface">₦{(item.product.priceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="col-span-1 md:col-span-2 text-right">
                            <span className="font-title-lg text-title-lg text-success-emerald">₦{((item.product.priceCents * item.quantity) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
              <div className="bg-surface-white p-lg rounded-xl shadow-[0px_20px_25px_rgba(10,10,10,0.05)] sticky top-[100px] border border-surface-variant/50">
                  <h2 className="font-title-lg text-title-lg text-text-dark mb-md pb-sm border-b border-surface-variant">Order Summary</h2>
                  <div className="space-y-sm mb-lg">
                      <div className="flex justify-between items-center font-body-md text-body-md text-on-surface">
                          <span>Subtotal ({totalItems} items)</span>
                          <span>₦{(subtotalCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                  </div>
                  <div className="pt-md border-t border-surface-variant flex justify-between items-center mb-lg">
                      <span className="font-headline-md text-headline-md text-text-dark">Total</span>
                      <span className="font-headline-md text-headline-md text-primary">₦{(subtotalCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-action-orange text-surface-white font-label-md text-label-md py-3 px-6 rounded-lg hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-sm"
                  >
                      Proceed to Checkout
                      <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                  <div className="mt-lg pt-lg border-t border-surface-variant text-center">
                      <p className="font-label-sm text-label-sm text-on-surface-variant mb-sm flex items-center justify-center gap-xs">
                          <span className="material-symbols-outlined text-[16px] text-success-emerald">verified_user</span> Secure Checkout
                      </p>
                  </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
