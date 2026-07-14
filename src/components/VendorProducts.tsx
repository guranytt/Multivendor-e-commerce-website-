import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Product = {
  id: number;
  title: string;
  priceCents: number;
  inventoryCount: number;
};

type Category = {
  id: number;
  name: string;
};

export default function VendorProducts() {
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

  useEffect(() => {
    fetchVendorStatus();
    fetchCategories();
  }, []);

  const fetchVendorStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
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

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const payload = {
      title,
      description,
      priceCents: parseInt(priceCents),
      inventoryCount: parseInt(inventoryCount),
      categoryId: parseInt(categoryId),
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
  };

  if (vendorStatus === 'pending') {
    return (
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-semibold text-yellow-800">Application Pending</h2>
        <p className="text-yellow-700 mt-2">Your vendor application is currently under review by an admin. You will be able to manage products once approved.</p>
      </div>
    );
  }

  if (vendorStatus !== 'approved') return null;

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end border-b pb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option value="">Select category...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (in cents)</label>
          <input type="number" required min="1" value={priceCents} onChange={(e) => setPriceCents(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Inventory Count</label>
          <input type="number" required min="0" value={inventoryCount} onChange={(e) => setInventoryCount(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={2} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {editingId ? 'Update' : 'Add'} Product
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price (Cents)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.priceCents}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.inventoryCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No products added yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
