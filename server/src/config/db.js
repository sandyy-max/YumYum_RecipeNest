import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function cleanEnv(val) {
  if (!val) return '';
  return String(val).trim().replace(/^["']|["']$/g, '');
}

export async function connectDB() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const envPath = path.resolve(__dirname, '../../.env');

  let uri = '';
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    const normalized = raw.replace(/\uFEFF/g, '');
    const match = normalized.match(/^\s*MONGODB_URI\s*=\s*(.+)\s*$/m);
    if (match?.[1]) uri = cleanEnv(match[1]);
  }
  if (!uri) {
    uri = cleanEnv(process.env.MONGODB_URI);
  }
  if (!uri) {
    throw new Error('MONGODB_URI is not set (check server/.env and restart)');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
