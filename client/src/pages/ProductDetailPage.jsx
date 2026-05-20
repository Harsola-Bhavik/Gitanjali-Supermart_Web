import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, Calendar, Clock, Thermometer, Weight, List } from 'lucide-react';
import api from '../api/axios';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 shrink-0 mt-0.5">
        <Icon size={15} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-sm text-gray-700 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="bg-gray-100 rounded-2xl h-80" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-100 rounded w-1/3" />
            <div className="h-8 bg-gray-100 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Product not found.</p>
        <button onClick={() => navigate('/')} className="text-primary-600 hover:underline text-sm">← Back to products</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT — Image */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex items-center justify-center p-6 min-h-72">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full max-h-80 object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300 gap-2">
              <Package size={64} />
              <span className="text-sm">No image available</span>
            </div>
          )}
        </div>

        {/* RIGHT — Details */}
        <div className="flex flex-col gap-4">
          {/* Category + Name + Price */}
          <div>
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{product.category}</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.name}</h1>
            {product.description && (
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{product.description}</p>
            )}
          </div>

          {/* Price + Stock */}
          <div className="flex items-center gap-4">
            <div>
              <span className="text-3xl font-bold text-gray-900">₹{Number(product.price).toFixed(2)}</span>
              {product.unit && <span className="text-sm text-gray-400 ml-1">{product.unit}</span>}
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Add to Cart */}
          <button
            disabled={product.stock_quantity === 0}
            onClick={() => { addItem(product); toast.success('Added to cart'); }}
            className="flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>

          {/* Product Details */}
          {(product.net_weight || product.ingredients || product.manufacture_date || product.expiry_date || product.shelf_life || product.storage_instructions) && (
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-1">Product Details</h2>
              <DetailRow icon={Weight}      label="Net Weight / Volume"  value={product.net_weight} />
              <DetailRow icon={List}        label="Ingredients"          value={product.ingredients} />
              <DetailRow icon={Calendar}    label="Manufacture Date"     value={product.manufacture_date} />
              <DetailRow icon={Clock}       label="Expiry / Best Before" value={product.expiry_date} />
              <DetailRow icon={Package}     label="Shelf Life"           value={product.shelf_life} />
              <DetailRow icon={Thermometer} label="Storage Instructions" value={product.storage_instructions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
