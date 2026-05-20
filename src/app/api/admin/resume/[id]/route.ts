import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSignedUrl, getSignedDownloadUrl } from '@/lib/cloudinary';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/resume/[id] - Get signed URL for resume
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const download = request.nextUrl.searchParams.get('download') === 'true';

    // Get application with resume info
    const { data: application, error } = await supabaseAdmin
      .from('job_applications')
      .select('resume_url, resume_filename, resume_cloudinary_id')
      .eq('id', id)
      .single();

    if (error || !application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    // If we have the cloudinary public ID, generate a signed URL
    if (application.resume_cloudinary_id) {
      let signedUrl: string;
      
      if (download) {
        signedUrl = getSignedDownloadUrl(
          application.resume_cloudinary_id,
          application.resume_filename || 'resume'
        );
      } else {
        signedUrl = getSignedUrl(application.resume_cloudinary_id);
      }
      
      return NextResponse.json({
        success: true,
        url: signedUrl,
        filename: application.resume_filename,
      });
    }

    // Fallback to stored URL
    return NextResponse.json({
      success: true,
      url: application.resume_url,
      filename: application.resume_filename,
    });
  } catch (error) {
    console.error('Error getting resume URL:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
