import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { Habit } from '@/lib/types';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    
    // Convert userId to string to match the database schema
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId.toString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching habits:', error);
      return Response.json({ error: `Failed to fetch habits: ${error.message}` }, { status: 500 });
    }
    
    return Response.json(data as Habit[]);
  } catch (error: any) {
    console.error('Error in GET /api/habits:', error);
    return Response.json({ error: `Failed to fetch habits: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, description, frequency, schedule, notes } = body;

    const supabase = await createSupabaseServerClient();
    
    // Convert userId to string to match the database schema
    const { data, error } = await supabase
      .from('habits')
      .insert([{
        name,
        description,
        frequency,
        schedule,
        notes,
        user_id: userId.toString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating habit:', error);
      return Response.json({ error: `Failed to create habit: ${error.message}` }, { status: 500 });
    }
    
    return Response.json(data as Habit, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/habits:', error);
    return Response.json({ error: `Failed to create habit: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}