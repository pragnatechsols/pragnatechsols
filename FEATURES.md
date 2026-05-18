# Pragna Techsols - Extended Features

This document outlines the new modules added to the existing Pragna Techsols website.

## New Modules Overview

### 1. Enquiry Management System
- Contact form submissions now save to Supabase database
- Admin dashboard to view and manage all enquiries
- Status management: New Enquiry → Lead → In Talks → Converted
- Mark enquiries as spam
- Internal comments/notes support
- Search, filter, and pagination

### 2. Leads Management Module
- Dedicated leads section for sales pipeline
- Status tracking: New Lead → Contacted → In Discussion → Proposal Sent → Converted/Lost
- Priority levels: High, Medium, Low
- Follow-up date tracking
- Activity timeline
- Table and Kanban board views
- Analytics cards

### 3. Careers Page
- Public careers page at `/careers`
- Job listings with search and filters
- Job detail expansion
- Modern UI matching existing design

### 4. Job Application System
- Apply for jobs directly from careers page
- Resume upload to Cloudinary
- Application form with all required fields
- Duplicate application prevention

### 5. Admin Careers Management
- Create, edit, delete job openings
- Activate/deactivate jobs
- Rich job descriptions
- Skills tags management

### 6. Application Tracking System
- View all job applications
- Status management: New → Shortlisted → Interview Scheduled → Rejected/Hired
- Download/view resumes from Cloudinary
- Internal notes/comments
- Search, filter, and pagination

## Database Schema

Run the SQL in `supabase/schema.sql` to create the required tables:
- `admin_users`
- `enquiries`
- `enquiry_comments`
- `leads`
- `lead_notes`
- `jobs`
- `job_applications`
- `application_comments`

## Environment Variables

Add the following to your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Auth
PASSWORD_SALT=your_secure_random_salt
```

## New Routes

### Public Routes
- `/careers` - Public careers page

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/login` - Admin login
- `/admin/enquiries` - Enquiry management
- `/admin/leads` - Leads management
- `/admin/careers` - Job openings management
- `/admin/applications` - Application tracking
- `/admin/settings` - Admin settings

### API Routes

#### Enquiries
- `GET /api/admin/enquiries` - List enquiries
- `GET /api/admin/enquiries/[id]` - Get single enquiry
- `PATCH /api/admin/enquiries/[id]` - Update status
- `DELETE /api/admin/enquiries/[id]` - Soft delete
- `POST /api/admin/enquiries/[id]/comments` - Add comment
- `GET /api/admin/enquiries/[id]/comments` - Get comments

#### Leads
- `GET /api/admin/leads` - List leads
- `POST /api/admin/leads` - Create lead
- `GET /api/admin/leads/[id]` - Get single lead
- `PATCH /api/admin/leads/[id]` - Update lead
- `DELETE /api/admin/leads/[id]` - Soft delete
- `POST /api/admin/leads/[id]/notes` - Add note
- `GET /api/admin/leads/[id]/notes` - Get notes

#### Jobs
- `GET /api/jobs` - List active jobs (public)
- `GET /api/jobs/[id]` - Get job details (public)
- `POST /api/jobs/[id]/apply` - Submit application (public)
- `GET /api/admin/jobs` - List all jobs (admin)
- `POST /api/admin/jobs` - Create job
- `GET /api/admin/jobs/[id]` - Get job details
- `PATCH /api/admin/jobs/[id]` - Update job
- `DELETE /api/admin/jobs/[id]` - Soft delete

#### Applications
- `GET /api/admin/applications` - List applications
- `GET /api/admin/applications/[id]` - Get application
- `PATCH /api/admin/applications/[id]` - Update status
- `DELETE /api/admin/applications/[id]` - Soft delete
- `POST /api/admin/applications/[id]/comments` - Add comment
- `GET /api/admin/applications/[id]/comments` - Get comments

#### Auth
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/me` - Get current admin

#### Stats
- `GET /api/admin/stats` - Dashboard statistics

## File Structure Added

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Dashboard)
│   │   ├── AdminLayoutClient.tsx
│   │   ├── login/page.tsx
│   │   ├── enquiries/page.tsx
│   │   ├── leads/page.tsx
│   │   ├── careers/page.tsx
│   │   ├── applications/page.tsx
│   │   └── settings/page.tsx
│   ├── careers/page.tsx
│   └── api/
│       ├── admin/
│       │   ├── auth/
│       │   ├── enquiries/
│       │   ├── leads/
│       │   ├── jobs/
│       │   ├── applications/
│       │   └── stats/
│       └── jobs/
├── components/
│   └── ui/
│       ├── ToastProvider.tsx
│       ├── StatusBadge.tsx
│       ├── Modal.tsx
│       ├── ConfirmModal.tsx
│       └── StatCard.tsx
├── lib/
│   ├── supabase.ts
│   ├── cloudinary.ts
│   ├── auth.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── supabase/
    └── schema.sql
```

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables
3. Run the database schema SQL in Supabase
4. Start development server: `npm run dev`
5. Access admin panel at `/admin/login`

Default admin credentials:
- Email: admin@pragnatechsols.com
- Password: admin123

**Note:** Change the default password in production!
