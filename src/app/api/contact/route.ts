import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';

// Initialize Resend with API key (will be set in environment variables)
const resend = new Resend(process.env.RESEND_API_KEY);

// Client email to receive quote requests
const CLIENT_EMAIL = 'pragnatechsols@gmail.com';
// From email (must be verified domain in Resend)
const FROM_EMAIL = 'info@pragnatechsols.com';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 2;

// In-memory store for rate limiting (resets on server restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Check rate limit for an IP
function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  cleanupRateLimitStore();
  
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now > record.resetTime) {
    // New window - allow request and create/reset record
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetIn: RATE_LIMIT_WINDOW };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }
  
  // Increment count and allow
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetIn: record.resetTime - now };
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const minutesRemaining = Math.ceil(rateLimit.resetIn / 60000);
      return NextResponse.json(
        { error: `Too many requests. Please try again in ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}.` },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetIn / 1000).toString(),
          }
        }
      );
    }

    const body: ContactFormData = await request.json();
    const { name, email, phone, company, service, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Save enquiry to Supabase database
    const { error: dbError } = await supabaseAdmin
      .from('enquiries')
      .insert({
        full_name: name,
        email: email,
        phone: phone,
        company_name: company || null,
        service_interested: service,
        message: message,
        status: 'new_enquiry',
      });

    if (dbError) {
      console.error('Error saving enquiry to database:', dbError);
      // Continue with email sending even if DB save fails
    }

    // Send email to client (Pragna Techsols)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: CLIENT_EMAIL,
      subject: `New Quote Request for ${service}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 16px; overflow: hidden; border: 1px solid #475569;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%); padding: 30px; text-align: center;">
                <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: bold;">New Quote Request</h1>
                <p style="margin: 10px 0 0; color: #1e293b; font-size: 14px;">You've received a new inquiry</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 30px;">
                <!-- Service Badge -->
                <div style="text-align: center; margin-bottom: 25px;">
                  <span style="display: inline-block; background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%); color: #0f172a; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                    ${service}
                  </span>
                </div>
                
                <!-- Customer Details -->
                <div style="background-color: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                  <h2 style="margin: 0 0 15px; color: #f1f5f9; font-size: 16px; font-weight: 600;">Customer Details</h2>
                  
                  <div style="margin-bottom: 12px;">
                    <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Name</span>
                    <p style="margin: 4px 0 0; color: #f1f5f9; font-size: 15px;">${name}</p>
                  </div>
                  
                  <div style="margin-bottom: 12px;">
                    <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                    <p style="margin: 4px 0 0; color: #f1f5f9; font-size: 15px;">
                      <a href="mailto:${email}" style="color: #eab308; text-decoration: none;">${email}</a>
                    </p>
                  </div>
                  
                  <div>
                    <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</span>
                    <p style="margin: 4px 0 0; color: #f1f5f9; font-size: 15px;">
                      <a href="tel:${phone}" style="color: #eab308; text-decoration: none;">${phone}</a>
                    </p>
                  </div>
                </div>
                
                <!-- Requirements -->
                <div style="background-color: #1e293b; border-radius: 12px; padding: 20px;">
                  <h2 style="margin: 0 0 15px; color: #f1f5f9; font-size: 16px; font-weight: 600;">Project Requirements</h2>
                  <p style="margin: 0; color: #cbd5e1; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
                
                <!-- CTA -->
                <div style="text-align: center; margin-top: 25px;">
                  <a href="mailto:${email}?subject=Re: Quote Request for ${service}" style="display: inline-block; background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%); color: #0f172a; padding: 12px 30px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none;">
                    Reply to Customer
                  </a>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
                <p style="margin: 0; color: #64748b; font-size: 12px;">
                  This email was sent from your website contact form
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send confirmation email to customer
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Thank You for Your Quote Request - Pragna Techsols',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 16px; overflow: hidden; border: 1px solid #475569;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%); padding: 30px; text-align: center;">
                <h1 style="margin: 0; color: #0f172a; font-size: 24px; font-weight: bold;">Pragna Techsols</h1>
                <p style="margin: 10px 0 0; color: #1e293b; font-size: 14px;">Engineering Excellence</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 30px;">
                <h2 style="margin: 0 0 20px; color: #f1f5f9; font-size: 20px; font-weight: 600;">Thank You, ${name}!</h2>
                
                <p style="margin: 0 0 20px; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                  We've received your quote request for <strong style="color: #eab308;">${service}</strong> and our team is reviewing it now. 
                  You can expect to hear from us within 24-48 hours.
                </p>
                
                <!-- Request Summary -->
                <div style="background-color: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                  <h3 style="margin: 0 0 15px; color: #f1f5f9; font-size: 16px; font-weight: 600;">Your Request Summary</h3>
                  
                  <div style="margin-bottom: 12px;">
                    <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Service</span>
                    <p style="margin: 4px 0 0; color: #eab308; font-size: 15px; font-weight: 500;">${service}</p>
                  </div>
                  
                  <div>
                    <span style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Your Requirements</span>
                    <p style="margin: 4px 0 0; color: #cbd5e1; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${message}</p>
                  </div>
                </div>
                
                <!-- What's Next -->
                <div style="background-color: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                  <h3 style="margin: 0 0 15px; color: #f1f5f9; font-size: 16px; font-weight: 600;">What's Next?</h3>
                  <ul style="margin: 0; padding: 0 0 0 20px; color: #cbd5e1; font-size: 14px; line-height: 1.8;">
                    <li>Our team will review your requirements</li>
                    <li>We'll prepare a detailed quote for your project</li>
                    <li>A team member will contact you to discuss further</li>
                  </ul>
                </div>
                
                <!-- Contact Info -->
                <div style="text-align: center; padding: 20px 0; border-top: 1px solid #334155;">
                  <p style="margin: 0 0 10px; color: #94a3b8; font-size: 14px;">Need immediate assistance?</p>
                  <p style="margin: 0; color: #f1f5f9; font-size: 15px;">
                    <a href="tel:+919876543210" style="color: #eab308; text-decoration: none;">+91 98765 43210</a>
                    &nbsp;|&nbsp;
                    <a href="mailto:pragnatechsols@gmail.com" style="color: #eab308; text-decoration: none;">pragnatechsols@gmail.com</a>
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155;">
                <p style="margin: 0 0 10px; color: #94a3b8; font-size: 13px; font-weight: 500;">Pragna Techsols</p>
                <p style="margin: 0; color: #64748b; font-size: 12px;">
                  Vijayawada, Andhra Pradesh, India
                </p>
                <p style="margin: 10px 0 0; color: #475569; font-size: 11px;">
                  © ${new Date().getFullYear()} Pragna Techsols. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: 'Quote request sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
