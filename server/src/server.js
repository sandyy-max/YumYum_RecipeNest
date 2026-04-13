import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

import { createApp } from './app.js';
import { connectDB } from './config/db.js';

const port = Number(process.env.PORT) || 5000;

async function main() {
  await connectDB();
  const app = createApp();
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  server.on('error', (err) => {
    if (err?.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Stop the other process and retry.`);
      process.exit(1);
    }
    console.error(err);
    process.exit(1);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
