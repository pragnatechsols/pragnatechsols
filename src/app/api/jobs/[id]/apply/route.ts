import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { uploadResume } from '@/lib/cloudinary';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/jobs/[id]/apply - Submit job application (public)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: jobId } = await params;

    // Verify job exists and is active
    const { data: job, error: jobError } = await supabaseAdmin
      .from('jobs')
      .select('id, title')
      .eq('id', jobId)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();

    if (jobError || !job) {
      return NextResponse.json(
        { success: false, error: 'Job not found or no longer accepting applications' },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    
    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const current_location = formData.get('current_location') as string;
    const years_of_experience = parseInt(formData.get('years_of_experience') as string);
    const current_company = formData.get('current_company') as string;
    const portfolio_url = formData.get('portfolio_url') as string;
    const why_hire_you = formData.get('why_hire_you') as string;
    const notice_period = formData.get('notice_period') as string;
    const resume = formData.get('resume') as File;

    // Validate required fields
    if (!full_name || !email || !phone || !current_location || isNaN(years_of_experience) || !why_hire_you || !notice_period || !resume) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate resume file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(resume.type)) {
      return NextResponse.json(
        { success: false, error: 'Resume must be PDF, DOC, or DOCX format' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (resume.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Resume file size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Check for duplicate application
    const { data: existingApp } = await supabaseAdmin
      .from('job_applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('email', email)
      .eq('is_deleted', false)
      .single();

    if (existingApp) {
      return NextResponse.json(
        { success: false, error: 'You have already applied for this position' },
        { status: 400 }
      );
    }

    // Upload resume to Cloudinary
    const resumeBuffer = Buffer.from(await resume.arrayBuffer());
    const uploadResult = await uploadResume(resumeBuffer, resume.name);

    // Save application to database
    const { data: application, error: appError } = await supabaseAdmin
      .from('job_applications')
      .insert({
        job_id: jobId,
        full_name,
        email,
        phone,
        current_location,
        years_of_experience,
        current_company: current_company || null,
        portfolio_url: portfolio_url || null,
        why_hire_you,
        notice_period,
        resume_url: uploadResult.url,
        resume_filename: uploadResult.filename,
        resume_cloudinary_id: uploadResult.publicId,
        status: 'new',
      })
      .select()
      .single();

    if (appError) {
      console.error('Error saving application:', appError);
      return NextResponse.json(
        { success: false, error: 'Failed to submit application' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: application.id,
        job_title: job.title,
      },
    });
  } catch (error) {
    console.error('Error in POST /api/jobs/[id]/apply:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
