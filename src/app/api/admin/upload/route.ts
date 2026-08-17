import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

// POST /api/admin/upload - Upload an image (service icon, project logo) to Cloudinary.
// Accepts multipart form-data: { file, folder? }. Returns { url, publicId }.
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folderInput = (formData.get('folder') as string) || 'misc';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Image must be PNG, JPG, WEBP, or SVG' },
        { status: 400 }
      );
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Restrict folder to a known set to avoid arbitrary paths
    const safeFolders: Record<string, string> = {
      services: 'pragna-techsols/services',
      projects: 'pragna-techsols/projects',
      misc: 'pragna-techsols/misc',
    };
    const folder = safeFolders[folderInput] || safeFolders.misc;

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, file.name, folder);

    return NextResponse.json({
      success: true,
      data: { url: result.url, publicId: result.publicId },
    });
  } catch (error) {
    console.error('Error in POST /api/admin/upload:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
  }
}
