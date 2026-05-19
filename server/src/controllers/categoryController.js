const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/categories.json');

const read = () => JSON.parse(fs.readFileSync(FILE, 'utf-8'));
const write = (data) => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

exports.getCategories = (req, res) => {
  const categories = read();
  const data = categories.map((name, id) => ({ id, name }));
  res.json({ success: true, data });
};

exports.createCategory = (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Category name is required' });
  }
  const categories = read();
  const trimmed = name.trim();
  if (categories.includes(trimmed)) {
    return res.status(409).json({ success: false, error: 'Category already exists' });
  }
  categories.push(trimmed);
  write(categories);
  res.status(201).json({ success: true, data: { id: categories.length - 1, name: trimmed } });
};

exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  const categories = read();
  const idx = parseInt(id, 10);
  if (idx < 0 || idx >= categories.length) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }
  categories.splice(idx, 1);
  write(categories);
  res.json({ success: true, message: 'Category deleted' });
};
