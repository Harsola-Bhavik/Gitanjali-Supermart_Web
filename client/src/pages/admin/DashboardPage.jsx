import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Clock, TrendingUp } from 'lucide-react';
import api from '../../api/axios';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/dashboard')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-500">Loading stats...</div>;
  if (!stats) return <div className="text-red-500">Failed to load dashboard.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="bg-blue-500" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="bg-primary-600" />
        <StatCard icon={Clock} label="Pending Orders" value={stats.pendingOrders} color="bg-yellow-500" />
        <StatCard icon={TrendingUp} label="Today's Revenue" value={`₹${Number(stats.revenue).toFixed(2)}`} color="bg-purple-500" />
      </div>
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 text-sm">Today's Orders: <span className="font-semibold text-gray-800">{stats.todayOrders}</span></p>
      </div>
    </div>
  );
}
