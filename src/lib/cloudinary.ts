import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  filename: string;
}

export async function uploadResume(
  file: Buffer,
  filename: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'pragna-techsols/resumes',
        resource_type: 'raw',
        public_id: `resume_${Date.now()}_${filename.replace(/\.[^/.]+$/, '')}`,
        format: filename.split('.').pop(),
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            filename: filename,
          });
        }
      }
    );

    uploadStream.end(file);
  });
}

export async function deleteFile(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    return true;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return false;
  }
}

export function getSecureUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    secure: true,
    resource_type: 'raw',
  });
}

export default cloudinary;
