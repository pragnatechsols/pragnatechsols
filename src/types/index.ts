// ============================================
// PRAGNA TECHSOLS - TYPE DEFINITIONS
// ============================================

// ============================================
// ENQUIRY TYPES
// ============================================
export type EnquiryStatus = 'new_enquiry' | 'lead' | 'in_talks' | 'converted' | 'spam';

export interface Enquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  service_interested: string;
  message: string;
  status: EnquiryStatus;
  is_spam: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface EnquiryComment {
  id: string;
  enquiry_id: string;
  admin_id: string | null;
  admin_name: string;
  comment: string;
  created_at: string;
}

export interface EnquiryWithComments extends Enquiry {
  comments: EnquiryComment[];
}

// ============================================
// LEAD TYPES
// ============================================
export type LeadStatus = 'new_lead' | 'contacted' | 'in_discussion' | 'proposal_sent' | 'converted' | 'lost';
export type LeadPriority = 'high' | 'medium' | 'low';
export type ActivityType = 'note' | 'status_change' | 'priority_change' | 'assignment' | 'follow_up';

export interface Lead {
  id: string;
  enquiry_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  service_interested: string;
  message: string | null;
  lead_status: LeadStatus;
  priority: LeadPriority;
  follow_up_date: string | null;
  assigned_to: string | null;
  assigned_to_name: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  admin_id: string | null;
  admin_name: string;
  note: string;
  activity_type: ActivityType;
  created_at: string;
}

export interface LeadWithNotes extends Lead {
  notes: LeadNote[];
}

// ============================================
// JOB TYPES
// ============================================
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'internship' | 'remote';

export interface Job {
  id: string;
  title: string;
  department: string;
  experience: string;
  location: string;
  employment_type: EmploymentType;
  description: string;
  skills: string[];
  salary_range: string | null;
  is_active: boolean;
  is_deleted: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// APPLICATION TYPES
// ============================================
export type ApplicationStatus = 'new' | 'shortlisted' | 'interview_scheduled' | 'rejected' | 'hired';

export interface JobApplication {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  current_location: string;
  years_of_experience: number;
  current_company: string | null;
  portfolio_url: string | null;
  why_hire_you: string;
  notice_period: string;
  resume_url: string;
  resume_filename: string;
  resume_cloudinary_id: string | null;
  status: ApplicationStatus;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  job?: Job;
}

export interface ApplicationComment {
  id: string;
  application_id: string;
  admin_id: string | null;
  admin_name: string;
  comment: string;
  created_at: string;
}

export interface ApplicationWithDetails extends JobApplication {
  job: Job;
  comments: ApplicationComment[];
}

// ============================================
// ADMIN TYPES
// ============================================
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// STATS TYPES
// ============================================
export interface EnquiryStats {
  new_count: number;
  lead_count: number;
  in_talks_count: number;
  converted_count: number;
  spam_count: number;
  total_active: number;
}

export interface LeadStats {
  new_lead_count: number;
  contacted_count: number;
  in_discussion_count: number;
  proposal_sent_count: number;
  converted_count: number;
  lost_count: number;
  total_leads: number;
  pending_leads: number;
}

export interface ApplicationStats {
  new_count: number;
  shortlisted_count: number;
  interview_count: number;
  rejected_count: number;
  hired_count: number;
  total_applications: number;
}

// ============================================
// API TYPES
// ============================================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// FORM TYPES
// ============================================
export interface EnquiryFormData {
  full_name: string;
  email: string;
  phone: string;
  company_name?: string;
  service_interested: string;
  message: string;
}

export interface JobApplicationFormData {
  full_name: string;
  email: string;
  phone: string;
  current_location: string;
  years_of_experience: number;
  current_company?: string;
  portfolio_url?: string;
  why_hire_you: string;
  notice_period: string;
  resume: File;
}

export interface JobFormData {
  title: string;
  department: string;
  experience: string;
  location: string;
  employment_type: EmploymentType;
  description: string;
  skills: string[];
  salary_range?: string;
  is_active: boolean;
}

// ============================================
// FILTER TYPES
// ============================================
export interface EnquiryFilters {
  status?: EnquiryStatus;
  search?: string;
  sortBy?: 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  includeSpam?: boolean;
}

export interface LeadFilters {
  status?: LeadStatus;
  priority?: LeadPriority;
  assigned_to?: string;
  search?: string;
  sortBy?: 'created_at' | 'updated_at' | 'follow_up_date';
  sortOrder?: 'asc' | 'desc';
}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  job_id?: string;
  search?: string;
  sortBy?: 'created_at' | 'updated_at' | 'years_of_experience';
  sortOrder?: 'asc' | 'desc';
}

export interface JobFilters {
  department?: string;
  employment_type?: EmploymentType;
  is_active?: boolean;
  search?: string;
}
