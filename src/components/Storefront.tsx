import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

export default function Storefront() {
  const { getToken } = useClerkAuth();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    if (user) {
      fetchCart();
    }
  }, [user]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchProducts = async (search = '') => {
    setLoading(true);
    try {
      const url = search ? (import.meta.env.VITE_API_URL || '') + `/api/products?search=${encodeURIComponent(search)}` : (import.meta.env.VITE_API_URL || '') + '/api/products';
      const res = await fetch(url);
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCart = async () => {
    const token = await getToken();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setCart(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = async (productId: number) => {
    if (!user) {
      alert("Please login to add to cart");
      return;
    }
    const token = await getToken();
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/cart/items', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      if (res.ok) {
        fetchCart();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    const token = await getToken();
    try {
      await fetch((import.meta.env.VITE_API_URL || '') + `/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });
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
        setIsCartOpen(false);
      } else {
        const err = await res.json();
        alert('Checkout failed: ' + err.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredProducts = selectedCategoryId 
    ? products.filter(p => p.categoryId === selectedCategoryId)
    : products;

  return (
    <div className="flex h-full">
      {/* Sidebar for Categories */}
      <aside className="w-64 bg-white border-r h-screen sticky top-0 p-6 hidden md:block">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => setSelectedCategoryId(null)}
              className={`w-full text-left px-2 py-1 rounded ${selectedCategoryId === null ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              All Products
            </button>
          </li>
          {categories.map(c => (
            <li key={c.id}>
              <button 
                onClick={() => setSelectedCategoryId(c.id)}
                className={`w-full text-left px-2 py-1 rounded ${selectedCategoryId === c.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <div className="flex w-full sm:w-auto space-x-4">
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition whitespace-nowrap"
            >
              Cart ({cart.reduce((acc, vendorGroup) => acc + vendorGroup.items.length, 0)})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(p => (
              <div key={p.id} className="bg-white rounded-lg shadow border p-4 flex flex-col">
                {p.images && p.images.length > 0 && (
                  <div className="mb-4 -mx-4 -mt-4">
                    <img src={p.images[0].url} alt={p.title} className="w-full h-48 object-cover rounded-t-lg" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{p.description}</p>
                  <div className="mt-4 font-medium text-lg">${(p.priceCents / 100).toFixed(2)}</div>
                </div>
                <button 
                  onClick={() => addToCart(p.id)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No products found.
            </div>
          )}
        </div>
      </main>

      {/* Cart Slide-over */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full bg-white shadow-xl flex flex-col h-full">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
                ) : (
                  cart.map((vendorGroup: any) => (
                    <div key={vendorGroup.vendor.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b font-medium text-gray-800">
                        {vendorGroup.vendor.shopName}
                      </div>
                      <ul className="divide-y divide-gray-200">
                        {vendorGroup.items.map((item: any) => (
                          <li key={item.id} className="p-4 flex py-6">
                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.product.title}</h3>
                                  <p className="ml-4">${(item.product.priceCents / 100).toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <button onClick={() => updateCartItem(item.id, item.quantity - 1)} className="px-2 py-1 border rounded">-</button>
                                  <span className="text-gray-500">Qty {item.quantity}</span>
                                  <button onClick={() => updateCartItem(item.id, item.quantity + 1)} className="px-2 py-1 border rounded">+</button>
                                </div>
                                <div className="flex">
                                  <button onClick={() => updateCartItem(item.id, 0)} type="button" className="font-medium text-blue-600 hover:text-blue-500">Remove</button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p>
                    ${(cart.reduce((total, group) => {
                      return total + group.items.reduce((groupTotal: number, item: any) => {
                        return groupTotal + (item.product.priceCents * item.quantity);
                      }, 0);
                    }, 0) / 100).toFixed(2)}
                  </p>
                </div>
                <button
                  disabled={cart.length === 0}
                  className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
