import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    api.get(`/api/admin/orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await api.patch(`/api/admin/orders/${id}/status`, { status: newStatus });
      setOrder(res.data.data);
      toast.success('Status updated');
    } catch {}
    setUpdating(false);
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;
  if (!order) return <div className="text-red-500">Order not found.</div>;

  return (
    <div className="max-w-2xl">
      <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="space-y-4">
        {/* Customer Info */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Customer</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-500">Name:</span> <span className="font-medium">{order.customer_name}</span></div>
            <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{order.customer_phone}</span></div>
            <div className="col-span-2"><span className="text-gray-500">Address:</span> <span className="font-medium">{order.customer_address}</span></div>
            {order.notes && <div className="col-span-2"><span className="text-gray-500">Notes:</span> <span className="font-medium">{order.notes}</span></div>}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Items</h2>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary-600">₹{Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3">Update Status</h2>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                disabled={updating || order.status === s}
                onClick={() => handleStatusChange(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50 ${order.status === s ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
              >
                {s.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400">Order ID: {order.id} · Placed: {new Date(order.created_at).toLocaleString()}</p>
      </div>
    </div>
  );
}
