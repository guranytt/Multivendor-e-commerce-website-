import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import React, { useState, useEffect } from 'react';

type Category = {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
};

export default function AdminCategories() {
  const { getToken } = useClerkAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/categories');
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

    const token = await getToken();

    const payload = {
      name,
      slug,
      parentId: parentId === '' ? null : Number(parentId),
    };

    try {
      const url = editingId ? (import.meta.env.VITE_API_URL || '') + `/api/categories/${editingId}` : (import.meta.env.VITE_API_URL || '') + '/api/categories';
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
    
    const token = await getToken();

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/categories/${id}`, {
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
    <div className="mt-8 bg-surface-white p-6 rounded-lg shadow">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Manage Categories</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 grid gap-4 sm:grid-cols-4 items-end border-b pb-6">
        <div>
          <label className="block font-label-md text-label-md text-on-surface text-on-surface">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-surface-variant shadow-[0px_10px_20px_rgba(10,10,10,0.03)] focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface text-on-surface">Slug</label>
          <input
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full rounded-md border-surface-variant shadow-[0px_10px_20px_rgba(10,10,10,0.03)] focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
          />
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface text-on-surface">Parent Category</label>
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="mt-1 block w-full rounded-md border-surface-variant shadow-[0px_10px_20px_rgba(10,10,10,0.03)] focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-[0px_10px_20px_rgba(10,10,10,0.03)] font-label-md text-label-md text-on-surface text-white bg-action-orange text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingId ? 'Update' : 'Add'} Category
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Parent ID</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-on-surface-variant uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-surface-white divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{cat.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-label-md text-label-md text-on-surface text-on-surface">{cat.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{cat.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">{cat.parentId || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-label-md text-label-md text-on-surface">
                  <button onClick={() => handleEdit(cat)} className="text-action-orange hover:text-blue-900 mr-4">Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-on-surface-variant">No categories found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
