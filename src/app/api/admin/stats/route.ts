import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/admin/stats - Get dashboard statistics
export async function GET() {
  try {
    // Enquiry stats
    const { data: enquiryStats } = await supabaseAdmin
      .from('enquiries')
      .select('status, is_spam')
      .eq('is_deleted', false);

    const enquiryCounts = {
      new_count: 0,
      lead_count: 0,
      in_talks_count: 0,
      converted_count: 0,
      spam_count: 0,
      total_active: 0,
    };

    enquiryStats?.forEach((e) => {
      if (e.is_spam) {
        enquiryCounts.spam_count++;
      } else {
        enquiryCounts.total_active++;
        switch (e.status) {
          case 'new_enquiry':
            enquiryCounts.new_count++;
            break;
          case 'lead':
            enquiryCounts.lead_count++;
            break;
          case 'in_talks':
            enquiryCounts.in_talks_count++;
            break;
          case 'converted':
            enquiryCounts.converted_count++;
            break;
        }
      }
    });

    // Lead stats
    const { data: leadStats } = await supabaseAdmin
      .from('leads')
      .select('lead_status')
      .eq('is_deleted', false);

    const leadCounts = {
      new_lead_count: 0,
      contacted_count: 0,
      in_discussion_count: 0,
      proposal_sent_count: 0,
      converted_count: 0,
      lost_count: 0,
      total_leads: 0,
      pending_leads: 0,
    };

    leadStats?.forEach((l) => {
      leadCounts.total_leads++;
      switch (l.lead_status) {
        case 'new_lead':
          leadCounts.new_lead_count++;
          leadCounts.pending_leads++;
          break;
        case 'contacted':
          leadCounts.contacted_count++;
          leadCounts.pending_leads++;
          break;
        case 'in_discussion':
          leadCounts.in_discussion_count++;
          leadCounts.pending_leads++;
          break;
        case 'proposal_sent':
          leadCounts.proposal_sent_count++;
          leadCounts.pending_leads++;
          break;
        case 'converted':
          leadCounts.converted_count++;
          break;
        case 'lost':
          leadCounts.lost_count++;
          break;
      }
    });

    // Application stats
    const { data: appStats } = await supabaseAdmin
      .from('job_applications')
      .select('status')
      .eq('is_deleted', false);

    const appCounts = {
      new_count: 0,
      shortlisted_count: 0,
      interview_count: 0,
      rejected_count: 0,
      hired_count: 0,
      total_applications: 0,
    };

    appStats?.forEach((a) => {
      appCounts.total_applications++;
      switch (a.status) {
        case 'new':
          appCounts.new_count++;
          break;
        case 'shortlisted':
          appCounts.shortlisted_count++;
          break;
        case 'interview_scheduled':
          appCounts.interview_count++;
          break;
        case 'rejected':
          appCounts.rejected_count++;
          break;
        case 'hired':
          appCounts.hired_count++;
          break;
      }
    });

    // Jobs stats
    const { count: activeJobs } = await supabaseAdmin
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('is_deleted', false);

    const { count: totalJobs } = await supabaseAdmin
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false);

    return NextResponse.json({
      success: true,
      data: {
        enquiries: enquiryCounts,
        leads: leadCounts,
        applications: appCounts,
        jobs: {
          active_jobs: activeJobs || 0,
          total_jobs: totalJobs || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
