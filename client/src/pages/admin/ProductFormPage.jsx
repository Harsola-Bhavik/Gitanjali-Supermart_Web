import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  unit: z.string().optional(),
  stock_quantity: z.coerce.number().int().min(0, 'Stock must be 0 or more'),
  category: z.string().min(1, 'Category is required'),
  is_active: z.boolean().optional(),
  ingredients: z.string().optional(),
  manufacture_date: z.string().optional(),
  expiry_date: z.string().optional(),
  shelf_life: z.string().optional(),
  storage_instructions: z.string().optional(),
  net_weight: z.string().optional(),
});

export default function ProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    api.get('/api/categories').then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true },
  });

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/api/products/${id}`)
      .then((res) => {
        const p = res.data.data;
        reset({
          name: p.name,
          description: p.description || '',
          price: p.price,
          unit: p.unit || '',
          stock_quantity: p.stock_quantity,
          category: p.category,
          is_active: p.is_active,
          ingredients: p.ingredients || '',
          manufacture_date: p.manufacture_date || '',
          expiry_date: p.expiry_date || '',
          shelf_life: p.shelf_life || '',
          storage_instructions: p.storage_instructions || '',
          net_weight: p.net_weight || '',
        });
        if (p.image_url) setPreviewUrl(p.image_url);
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    if (imageFile) formData.append('image', imageFile);

    try {
      if (isEdit) {
        await api.put(`/api/admin/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/api/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch {}
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'New Product'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input {...register('name')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input {...register('price')} type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit <span className="text-gray-400 font-normal">(e.g. per kg, per 500g, per piece, per litre)</span></label>
            <input {...register('unit')} placeholder="per kg" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
            <input {...register('stock_quantity')} type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
            {errors.stock_quantity && <p className="text-red-500 text-xs mt-1">{errors.stock_quantity.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select {...register('category')} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input {...register('is_active')} type="checkbox" id="is_active" className="w-4 h-4 accent-primary-600" />
            <label htmlFor="is_active" className="text-sm font-medium">Active (visible to customers)</label>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>

          {/* Product Detail Fields */}
          <div className="sm:col-span-2">
            <p className="text-sm font-semibold text-gray-700 border-t pt-4 mb-3">Product Details <span className="text-gray-400 font-normal">(shown on product detail page)</span></p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Net Weight / Volume</label>
            <input {...register('net_weight')} placeholder="e.g. 500g, 1 litre" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Shelf Life</label>
            <input {...register('shelf_life')} placeholder="e.g. 6 months, 1 year" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Manufacture Date</label>
            <input {...register('manufacture_date')} placeholder="e.g. Jan 2025 or leave blank for fresh items" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expiry / Best Before</label>
            <input {...register('expiry_date')} placeholder="e.g. Dec 2025 or 3 days from delivery" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Ingredients</label>
            <textarea {...register('ingredients')} rows={2} placeholder="e.g. Wheat flour, Sugar, Salt..." className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Storage Instructions</label>
            <input {...register('storage_instructions')} placeholder="e.g. Store in a cool, dry place" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Product Image</label>
            {previewUrl && <img src={previewUrl} alt="preview" className="w-24 h-24 object-cover rounded-lg mb-2 border" />}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
              }}
              className="block text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-500 disabled:opacity-60 transition-colors">
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
