import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { Tag } from '@/lib/types';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    
    // Convert userId to string to match the database schema
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId.toString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tags:', error);
      return Response.json({ error: `Failed to fetch tags: ${error.message}` }, { status: 500 });
    }
    
    return Response.json(data as Tag[]);
  } catch (error: any) {
    console.error('Error in GET /api/tags:', error);
    return Response.json({ error: `Failed to fetch tags: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, color } = body;

    const supabase = await createSupabaseServerClient();
    
    // Convert userId to string to match the database schema
    const { data, error } = await supabase
      .from('tags')
      .insert([{
        name,
        color,
        user_id: userId.toString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tag:', error);
      return Response.json({ error: `Failed to create tag: ${error.message}` }, { status: 500 });
    }
    
    return Response.json(data as Tag, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/tags:', error);
    return Response.json({ error: `Failed to create tag: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}