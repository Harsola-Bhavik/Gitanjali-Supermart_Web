import { useEffect, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/api/admin/categories')
      .then((res) => setCategories(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    try {
      await api.post('/api/admin/categories', { name: newName.trim() });
      toast.success('Category added');
      setNewName('');
      fetchCategories();
    } catch {}
    setAdding(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? Products in this category won't be affected.`)) return;
    try {
      await api.delete(`/api/admin/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch {}
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 disabled:opacity-60 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm divide-y">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No categories yet.</div>
        ) : categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between px-5 py-3">
            <span className="text-gray-800 font-medium">{cat.name}</span>
            <button
              onClick={() => handleDelete(cat.id, cat.name)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
