import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react';

type Image = {
  url: string;
  publicId: string;
};

type Product = {
  id: number;
  title: string;
  priceCents: number;
  inventoryCount: number;
  images: Image[];
};

type Category = {
  id: number;
  name: string;
};

export default function VendorProducts() {
  const { getToken } = useClerkAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceCents, setPriceCents] = useState('');
  const [inventoryCount, setInventoryCount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [vendorStatus, setVendorStatus] = useState<string | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchVendorStatus();
    fetchCategories();
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
          fetchProducts(token!);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async (token: string) => {
    try {
      const res = await fetch('/api/products/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = await getToken();

    const payload = {
      title,
      description,
      priceCents: parseInt(priceCents),
      inventoryCount: parseInt(inventoryCount),
      categoryId: parseInt(categoryId),
      images,
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setPriceCents('');
        setInventoryCount('');
        setCategoryId('');
        setImages([]);
        setEditingId(null);
        fetchProducts(token!);
      } else {
        alert('Failed to save product');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setPriceCents(p.priceCents.toString());
    setInventoryCount(p.inventoryCount.toString());
    setCategoryId(p.categoryId.toString());
    setImages(p.images || []);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setImages([...images, data]);
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  if (vendorStatus === 'pending') {
    return (
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="font-headline-md text-headline-md text-on-surface text-yellow-800">Application Pending</h2>
        <p className="text-yellow-700 mt-2">Your vendor application is currently under review by an admin. You will be able to manage products once approved.</p>
      </div>
    );
  }

  if (vendorStatus !== 'approved') return null;

  return (
    <div className="mt-8 bg-surface-white p-6 rounded-lg shadow">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Manage Products</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end border-b pb-6">
        <div>
          <label className="block font-label-md text-label-md text-on-surface text-on-surface">Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border border-surface-variant rounded-md p-2" />
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface text-on-surface">Category</label>
          <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full border border-surface-variant rounded-md p-2">
            <option value="">Select category...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface text-on-surface">Price (in cents)</label>
          <input type="number" required min="1" value={priceCents} onChange={(e) => setPriceCents(e.target.value)} className="mt-1 block w-full border border-surface-variant rounded-md p-2" />
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface text-on-surface">Inventory Count</label>
          <input type="number" required min="0" value={inventoryCount} onChange={(e) => setInventoryCount(e.target.value)} className="mt-1 block w-full border border-surface-variant rounded-md p-2" />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block font-label-md text-label-md text-on-surface text-on-surface">Images</label>
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img src={img.url} alt="Product upload" className="h-20 w-20 object-cover rounded-md border" />
              </div>
            ))}
            <label className="h-20 w-20 flex items-center justify-center border-2 border-dashed border-surface-variant rounded-md cursor-pointer hover:bg-surface-container-low">
              <span className="text-on-surface-variant text-2xl">+</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
            </label>
          </div>
          {uploadingImage && <p className="text-sm text-on-surface-variant mt-1">Uploading...</p>}
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block font-label-md text-label-md text-on-surface text-on-surface">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border border-surface-variant rounded-md p-2" rows={2} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <button type="submit" disabled={loading} className="w-full bg-action-orange text-white text-white p-2 rounded hover:bg-primary">
            {editingId ? 'Update' : 'Add'} Product
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Price (Cents)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-on-surface-variant uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-surface-white divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap font-label-md text-label-md text-on-surface text-on-surface">{p.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{p.priceCents}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{p.inventoryCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-label-md text-label-md text-on-surface">
                  <button onClick={() => handleEdit(p)} className="text-action-orange hover:text-blue-900 mr-4">Edit</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-on-surface-variant">No products added yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
