import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';

export default function CustomerProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useClerkAuth();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      // Just fetch all and find, or if there's a specific GET /api/products/:id use it.
      // We don't have GET /api/products/:id currently, we have GET /api/products
      const res = await fetch('/api/products');
      if (res.ok) {
        const all = await res.json();
        const found = all.find((p: any) => p.id === parseInt(id!));
        setProduct(found);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    const token = await getToken();
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 })
      });
      if (res.ok) {
        // Just navigate to cart
        navigate('/customer/cart');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-action-orange"></div></div>;
  if (!product) return <div className="py-12 text-center text-on-surface-variant">Product not found.</div>;

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop py-xl">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex text-on-surface-variant mb-lg font-body-md text-body-md">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/customer" className="inline-flex items-center hover:text-action-orange transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined mx-1 text-sm">chevron_right</span>
              <Link to="/customer/categories" className="ml-1 hover:text-action-orange transition-colors md:ml-2">Products</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="material-symbols-outlined mx-1 text-sm">chevron_right</span>
              <span className="ml-1 text-on-surface md:ml-2 font-semibold line-clamp-1">{product.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-xl">
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-md">
          {/* Main Image */}
          <div className="bg-surface-white rounded-xl shadow-[0px_20px_25px_rgba(10,10,10,0.05)] p-md h-[400px] md:h-[500px] flex items-center justify-center relative overflow-hidden group">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0].url} alt={product.title} className="object-contain w-full h-full max-h-[450px] transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <div className="flex items-center justify-center text-surface-variant w-full h-full">
                <span className="material-symbols-outlined text-6xl">image</span>
              </div>
            )}
            <div className="absolute top-md left-md flex flex-col gap-sm">
              <span className="bg-success-emerald text-white px-3 py-1 rounded-full font-label-md text-label-md shadow-sm">In Stock</span>
            </div>
          </div>
          {/* Thumbs can go here if we have multiple images */}
        </div>

        {/* Right Column: Product Info & Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-lg">
          <div className="bg-surface-white rounded-xl shadow-[0px_20px_25px_rgba(10,10,10,0.05)] p-lg flex flex-col gap-md">
            {/* Title */}
            <div>
              <h1 className="font-headline-lg text-headline-lg text-text-dark mb-2">{product.title}</h1>
            </div>
            
            {/* Price */}
            <div className="flex items-end gap-3 pb-md border-b border-surface-variant">
              <span className="font-display-lg text-display-lg text-success-emerald font-bold">₦{(product.priceCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            
            {/* Description */}
            <p className="font-body-md text-body-md text-on-surface-variant">
              {product.description || "No description provided."}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-4">
              <button 
                onClick={addToCart}
                disabled={addingToCart}
                className="w-full bg-action-orange hover:bg-primary-container/90 text-white font-title-lg text-title-lg py-4 rounded-lg shadow-sm transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined">shopping_cart</span>
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            {/* Guarantees */}
            <div className="flex items-center justify-between text-on-surface-variant mt-2 px-2">
              <div className="flex items-center gap-1 font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-sm">local_shipping</span> Free Shipping
              </div>
              <div className="flex items-center gap-1 font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-sm">assignment_return</span> 30-Day Returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
