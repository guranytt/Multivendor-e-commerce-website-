import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Category = {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const payload = {
      name,
      slug,
      parentId: parentId === '' ? null : Number(parentId),
    };

    try {
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setName('');
        setSlug('');
        setParentId('');
        setEditingId(null);
        fetchCategories();
      } else {
        console.error('Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setParentId(cat.parentId || '');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 grid gap-4 sm:grid-cols-4 items-end border-b pb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Parent Category</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          >
            <option value="">None (Top Level)</option>
            {categories.filter(c => c.id !== editingId).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingId ? 'Update' : 'Add'} Category
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent ID</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.parentId || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No categories found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
