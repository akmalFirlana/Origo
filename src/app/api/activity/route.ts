import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { ActivityLog } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const entityType = searchParams.get('entityType');

    const supabase = await createSupabaseServerClient();
    
    let query = supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (from) {
      query = query.gte('created_at', from);
    }
    
    if (to) {
      query = query.lte('created_at', to);
    }
    
    if (entityType) {
      query = query.eq('entity_type', entityType);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching activity logs:', error);
      return Response.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
    }
    
    return Response.json(data as ActivityLog[]);
  } catch (error) {
    console.error('Error in GET /api/activity:', error);
    return Response.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
  }
}