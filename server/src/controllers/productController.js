const supabase = require('../config/supabase');
const { uploadImage, deleteImage } = require('../utils/supabaseStorage');

exports.getProducts = async (req, res) => {
  let { category, search, page = 1, limit = 12 } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  const offset = (page - 1) * limit;

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (category) {
    query = query.eq('category', category);
  }
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  res.json({
    success: true,
    data,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  });
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  res.json({ success: true, data });
};

// Admin handlers
exports.createProduct = async (req, res) => {
  const productData = req.body;
  
  if (req.file) {
    productData.image_url = await uploadImage(req.file);
  }

  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
    .single();

  if (error) throw error;

  res.status(201).json({ success: true, data, message: 'Product created successfully' });
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const productData = req.body;

  if (req.file) {
    // get old product to delete old image
    const { data: oldProduct } = await supabase.from('products').select('image_url').eq('id', id).single();
    if (oldProduct && oldProduct.image_url) {
      await deleteImage(oldProduct.image_url);
    }
    productData.image_url = await uploadImage(req.file);
  }

  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!data) return res.status(404).json({ success: false, error: 'Product not found' });

  res.json({ success: true, data, message: 'Product updated successfully' });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('image_url')
    .eq('id', id)
    .single();

  if (fetchError || !product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }

  if (product.image_url) {
    await deleteImage(product.image_url);
  }

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) throw error;

  res.json({ success: true, message: 'Product deleted successfully' });
};
