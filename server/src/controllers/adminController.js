const supabase = require('../config/supabase');

exports.getDashboardStats = async (req, res) => {
  // Execute parallel queries for performance
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: pendingOrders },
    { data: todayOrdersData }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders').select('total_amount').gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
  ]);

  const revenue = todayOrdersData ? todayOrdersData.reduce((sum, order) => sum + Number(order.total_amount), 0) : 0;
  const todayOrders = todayOrdersData ? todayOrdersData.length : 0;

  res.json({
    success: true,
    data: {
      totalProducts: totalProducts || 0,
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      todayOrders,
      revenue,
    }
  });
};
