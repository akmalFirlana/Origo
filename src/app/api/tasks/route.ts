import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs';
import { Task } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tasks:', error);
      return Response.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
    
    return Response.json(data as Task[]);
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    return Response.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, description, priority, due_date, tags, status } = body;

    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title,
        description,
        priority,
        due_date,
        tags,
        status,
        user_id: userId
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating task:', error);
      return Response.json({ error: 'Failed to create task' }, { status: 500 });
    }
    
    return Response.json(data as Task, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/tasks:', error);
    return Response.json({ error: 'Failed to create task' }, { status: 500 });
  }
}