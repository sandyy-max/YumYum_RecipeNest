import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const configured = Boolean(cloudName && apiKey && apiSecret);

if (configured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export function isCloudinaryConfigured() {
  return configured;
}

export async function uploadImageBuffer(buffer, options = {}) {
  if (!configured) {
    throw new Error('Cloudinary is not configured');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'recipe_nest',
        resource_type: 'image',
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}
