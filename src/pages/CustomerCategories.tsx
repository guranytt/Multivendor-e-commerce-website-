import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';

export default function CustomerCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get('id') ? parseInt(searchParams.get('id')!) : null;
  const searchQuery = searchParams.get('q') || '';
  const { getToken } = useClerkAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(searchQuery);
  }, [searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async (search = '') => {
    setLoading(true);
    try {
      const url = search ? `/api/products?search=${encodeURIComponent(search)}` : '/api/products';
      const res = await fetch(url);
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => {
      if (e.target.value) prev.set('q', e.target.value);
      else prev.delete('q');
      return prev;
    });
  };

  const handleCategorySelect = (id: number | null) => {
    setSearchParams(prev => {
      if (id !== null) prev.set('id', id.toString());
      else prev.delete('id');
      return prev;
    });
  };

  const filteredProducts = selectedCategoryId 
    ? products.filter(p => p.categoryId === selectedCategoryId)
    : products;

  return (
    <div className="w-full px-margin-mobile md:px-margin-desktop py-xl flex flex-col md:flex-row gap-xl">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-28 self-start">
        <div className="bg-surface-white rounded-xl shadow-[0px_20px_25px_rgba(10,10,10,0.05)] p-md">
          <h2 className="font-title-lg text-title-lg mb-md text-on-surface border-b border-surface-container-low pb-sm">Categories</h2>
          <ul className="space-y-sm font-label-md text-label-md">
            <li>
              <button 
                onClick={() => handleCategorySelect(null)} 
                className={`w-full flex items-center gap-sm p-2 rounded-lg transition-colors ${selectedCategoryId === null ? 'bg-action-orange/10 text-action-orange' : 'text-on-surface hover:bg-surface-container-low'}`}
              >
                All Products
              </button>
            </li>
            {categories.map(c => (
              <li key={c.id}>
                <button 
                  onClick={() => handleCategorySelect(c.id)} 
                  className={`w-full flex items-center gap-sm p-2 rounded-lg transition-colors text-left ${selectedCategoryId === c.id ? 'bg-action-orange/10 text-action-orange' : 'text-on-surface hover:bg-surface-container-low'}`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Category Grid */}
      <div className="flex-grow flex flex-col gap-xl">
        <header className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">All Products</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Explore our vast catalog of high-quality products across every department.</p>
          
          <div className="mt-4 max-w-md relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-surface-white border border-surface-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-action-orange focus:ring-1 focus:ring-action-orange transition-all shadow-[0px_4px_10px_rgba(0,0,0,0.02)]"
              placeholder="Search products..." 
            />
          </div>
          
          {/* Mobile Categories Chips */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 pt-4 no-scrollbar">
            <button 
              onClick={() => handleCategorySelect(null)}
              className={`flex-shrink-0 font-label-md text-label-md px-4 py-2 rounded-full shadow-sm transition-colors duration-200 ${selectedCategoryId === null ? 'bg-primary-container text-on-primary-container' : 'bg-surface-white border border-surface-variant text-on-surface-variant'}`}
            >
              All
            </button>
            {categories.map(c => (
               <button 
                key={c.id}
                onClick={() => handleCategorySelect(c.id)}
                className={`flex-shrink-0 font-label-md text-label-md px-4 py-2 rounded-full shadow-sm transition-colors duration-200 ${selectedCategoryId === c.id ? 'bg-primary-container text-on-primary-container' : 'bg-surface-white border border-surface-variant text-on-surface-variant'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </header>

        <section>
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-action-orange"></div></div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-gutter">
              {filteredProducts.map(p => (
                <Link key={p.id} to={`/customer/product/${p.id}`} className="bg-surface-white rounded-xl p-md shadow-[0px_20px_25px_rgba(10,10,10,0.05)] hover:-translate-y-1 hover:shadow-[0px_25px_30px_rgba(10,10,10,0.08)] transition-all duration-300 flex flex-col group cursor-pointer border border-transparent hover:border-surface-variant">
                  <div className="relative w-full aspect-square mb-md overflow-hidden rounded-lg bg-surface-container-low">
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0].url} alt={p.title} className="object-cover w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-surface-variant">
                        <span className="material-symbols-outlined text-4xl">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-title-lg text-title-lg text-on-surface mb-xs line-clamp-2">{p.title}</h3>
                    <div className="mt-auto flex items-end justify-between">
                      <span className="font-headline-md text-headline-md text-success-emerald block">${(p.priceCents / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
             <div className="text-center py-12 text-on-surface-variant font-body-md">
               No products found.
             </div>
          )}
        </section>
      </div>
    </div>
  );
}
