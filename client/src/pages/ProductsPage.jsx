import { useState, useEffect } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useCartStore from '../store/useCartStore';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    api.get('/api/categories').then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (debouncedSearch) params.search = debouncedSearch;
    if (category) params.category = category;
    api.get('/api/products', { params })
      .then((res) => {
        setProducts(res.data.data);
        setMeta(res.data.meta);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, page]);

  return (
    <div>
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value === 'All' ? '' : e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {[{ id: '', name: 'All' }, ...categories].map((c) => (
            <option key={c.id} value={c.name === 'All' ? '' : c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} onClick={() => navigate(`/products/${product.id}`)} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-40 bg-gray-100 overflow-hidden flex items-center justify-center">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <p className="text-xs text-primary-600 font-medium mb-1">{product.category}</p>
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{product.name}</h3>
                {product.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 flex-1">{product.description}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="font-bold text-gray-900">₹{Number(product.price).toFixed(2)}</span>
                    {product.unit && <span className="text-xs text-gray-400 ml-1">{product.unit}</span>}
                  </div>
                  <button
                    disabled={product.stock_quantity === 0}
                    onClick={(e) => { e.stopPropagation(); addItem(product); toast.success('Added to cart'); }}
                    className="flex items-center gap-1 bg-primary-600 text-white text-xs px-2 py-1.5 rounded-lg hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    {product.stock_quantity === 0 ? 'Out of stock' : 'Add'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
          >
            Prev
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {meta.totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            disabled={page === meta.totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
