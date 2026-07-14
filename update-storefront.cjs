const fs = require('fs');
let content = fs.readFileSync('src/components/Storefront.tsx', 'utf8');

// Add loading state
content = content.replace(
  "const [isCartOpen, setIsCartOpen] = useState(false);",
  "const [isCartOpen, setIsCartOpen] = useState(false);\n  const [loading, setLoading] = useState(true);"
);

// Update fetchProducts
content = content.replace(
  /const fetchProducts = async \(search = ''\) => {[\s\S]*?};\n/m,
  `const fetchProducts = async (search = '') => {
    setLoading(true);
    try {
      const url = search ? \`/api/products?search=\${encodeURIComponent(search)}\` : '/api/products';
      const res = await fetch(url);
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };\n`
);

// Update render loading
content = content.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">[\s\S]*?<\/main>/m,
  `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="mt-4 font-medium text-lg">\${(p.priceCents / 100).toFixed(2)}</div>
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
      </main>`
);

fs.writeFileSync('src/components/Storefront.tsx', content);
