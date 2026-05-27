import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function ProductsListPage() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/api/categories').then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  const fetchProducts = (p = 1, s = search, c = category) => {
    setLoading(true);
    const params = { page: p, limit: 20 };
    if (s) params.search = s;
    if (c) params.category = c;
    api.get('/api/products', { params })
      .then((res) => { setProducts(res.data.data); setMeta(res.data.meta); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(page, search, category); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(1, search, category);
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
    fetchProducts(1, search, val);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      toast.success('Product deleted');
      fetchProducts(page, search, category);
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products <span className="text-sm font-normal text-gray-400">({meta.total || 0} total)</span></h1>
        <Link to="/admin/products/new" className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Search + Filter */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 text-sm transition-colors">
          Search
        </button>
        {(search || category) && (
          <button
            type="button"
            onClick={() => { setSearch(''); setCategory(''); setPage(1); fetchProducts(1, '', ''); }}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Stock</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">No products found.</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-lg">🛒</div>}
                  </div>
                  <span className="font-medium text-gray-800 line-clamp-1">{p.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.category}</td>
                <td className="px-4 py-3 font-semibold">₹{Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3">{p.stock_quantity}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link to={`/admin/products/${p.id}/edit`} className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100">Prev</button>
          <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {meta.totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100">Next</button>
        </div>
      )}
    </div>
  );
}
