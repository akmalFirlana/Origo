import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs';
import { Tag } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching tags:', error);
      return Response.json({ error: 'Failed to fetch tags' }, { status: 500 });
    }
    
    return Response.json(data as Tag[]);
  } catch (error) {
    console.error('Error in GET /api/tags:', error);
    return Response.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, color } = body;

    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('tags')
      .insert([{
        name,
        color,
        user_id: userId
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tag:', error);
      return Response.json({ error: 'Failed to create tag' }, { status: 500 });
    }
    
    return Response.json(data as Tag, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/tags:', error);
    return Response.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}