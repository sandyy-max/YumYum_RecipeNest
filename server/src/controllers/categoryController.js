import { body, param } from 'express-validator';
import Category from '../models/Category.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const listCategories = asyncHandler(async (_req, res) => {
  let categories = await Category.find().sort({ name: 1 }).lean();
  if (!categories.length) {
    const defaults = [
      { name: 'Breakfast', slug: 'breakfast', description: 'Morning meals' },
      { name: 'Appetizer', slug: 'appetizer', description: 'Starter recipes' },
      { name: 'Main Course', slug: 'main-course', description: 'Main dishes' },
      { name: 'Dessert', slug: 'dessert', description: 'Sweet recipes' },
    ];
    await Category.insertMany(defaults, { ordered: false }).catch(() => {});
    categories = await Category.find().sort({ name: 1 }).lean();
  }
  res.json({ categories });
});

export const createCategoryValidators = [
  body('name').trim().notEmpty(),
  body('description').optional().isString(),
  body('slug').optional().trim().isString(),
  body('imageUrl').optional().isString(),
];

export const updateCategoryValidators = [
  param('id').isMongoId(),
  body('name').optional().trim().notEmpty(),
  body('description').optional().isString(),
  body('slug').optional().trim().isString(),
  body('imageUrl').optional().isString(),
];

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description = '', slug, imageUrl = '' } = req.body;
  const finalSlug = slug ? slugify(slug) : slugify(name);
  const exists = await Category.findOne({ slug: finalSlug });
  if (exists) {
    res.status(400).json({ message: 'Category slug already exists' });
    return;
  }
  const cat = await Category.create({
    name,
    description,
    slug: finalSlug,
    imageUrl,
  });
  res.status(201).json({ category: cat });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  if (updates.name && !updates.slug) {
    updates.slug = slugify(updates.name);
  }
  if (updates.slug) {
    updates.slug = slugify(updates.slug);
  }
  const cat = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!cat) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }
  res.json({ category: cat });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cat = await Category.findByIdAndDelete(id);
  if (!cat) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }
  res.json({ message: 'Category deleted' });
});
