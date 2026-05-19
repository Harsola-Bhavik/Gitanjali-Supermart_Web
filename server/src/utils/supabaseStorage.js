const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const logger = require('../config/logger');

const BUCKET_NAME = 'product-images';

exports.uploadImage = async (file) => {
  try {
    const ext = path.extname(file.originalname);
    const filename = `products/${Date.now()}-${uuidv4()}${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filename);

    return publicUrlData.publicUrl;
  } catch (error) {
    logger.error('Error uploading image to Supabase', error);
    throw new Error('Image upload failed');
  }
};

exports.deleteImage = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const urlParts = imageUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === BUCKET_NAME);
    if (bucketIndex === -1) return;

    // Join the remaining parts to get the path in the bucket
    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    logger.error('Error deleting image from Supabase', error);
    // Don't throw here so we don't break the product deletion process if image delete fails
  }
};
