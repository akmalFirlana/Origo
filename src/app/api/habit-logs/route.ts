import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs';
import { HabitLog } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const supabase = await createSupabaseServerClient();
    
    let query = supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (from) {
      query = query.gte('date', from);
    }
    
    if (to) {
      query = query.lte('date', to);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching habit logs:', error);
      return Response.json({ error: 'Failed to fetch habit logs' }, { status: 500 });
    }
    
    return Response.json(data as HabitLog[]);
  } catch (error) {
    console.error('Error in GET /api/habit-logs:', error);
    return Response.json({ error: 'Failed to fetch habit logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    const body = await request.json();
    const { habit_id, date, status, note } = body;

    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('habit_logs')
      .insert([{
        habit_id,
        date,
        status,
        note,
        user_id: userId
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating habit log:', error);
      return Response.json({ error: 'Failed to create habit log' }, { status: 500 });
    }
    
    return Response.json(data as HabitLog, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/habit-logs:', error);
    return Response.json({ error: 'Failed to create habit log' }, { status: 500 });
  }
}