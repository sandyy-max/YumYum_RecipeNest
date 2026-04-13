import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { connectDB } from '../config/db.js';

async function run() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin email already exists');
    process.exit(0);
  }

  await User.create({
    name,
    email,
    password,
    role: 'admin',
    accountStatus: 'active',
  });
  console.log('Admin user created');

  const categories = [
    { name: 'Breakfast', slug: 'breakfast', description: 'Morning meals' },
    { name: 'Appetizer', slug: 'appetizer', description: 'Starters' },
    { name: 'Main Course', slug: 'main-course', description: 'Hearty plates' },
    { name: 'Dessert', slug: 'dessert', description: 'Sweet treats' },
  ];
  for (const c of categories) {
    await Category.findOneAndUpdate({ slug: c.slug }, c, { upsert: true });
  }
  console.log('Default categories ensured');

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
