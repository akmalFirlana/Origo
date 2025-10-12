import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs';
import { Event } from '@/lib/types';

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
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('start_at', { ascending: true });
    
    if (from) {
      query = query.gte('start_at', from);
    }
    
    if (to) {
      query = query.lte('end_at', to);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching events:', error);
      return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
    
    return Response.json(data as Event[]);
  } catch (error) {
    console.error('Error in GET /api/events:', error);
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, description, location, start_at, end_at, reminders } = body;

    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('events')
      .insert([{
        title,
        description,
        location,
        start_at,
        end_at,
        reminders,
        user_id: userId
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating event:', error);
      return Response.json({ error: 'Failed to create event' }, { status: 500 });
    }
    
    return Response.json(data as Event, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/events:', error);
    return Response.json({ error: 'Failed to create event' }, { status: 500 });
  }
}