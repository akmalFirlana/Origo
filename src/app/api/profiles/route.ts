import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';
import { UserProfile } from '@/lib/types';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error('Error fetching user profile:', error);
      return Response.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }
    
    return Response.json(data as UserProfile || null);
  } catch (error) {
    console.error('Error in GET /api/profiles:', error);
    return Response.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return Response.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    const body = await request.json();
    const { theme_preference, notification_preferences } = body;

    const supabase = await createSupabaseServerClient();
    
    // Try to update first
    const { error: updateError } = await supabase
      .from('profiles')
      .upsert([{
        user_id: userId,
        theme_preference,
        notification_preferences,
      }]);
    
    if (updateError) {
      console.error('Error creating or updating profile:', updateError);
      return Response.json({ error: 'Failed to create or update profile' }, { status: 500 });
    }
    
    // Fetch the updated profile
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching updated profile:', fetchError);
      return Response.json({ error: 'Failed to fetch updated profile' }, { status: 500 });
    }
    
    return Response.json(data as UserProfile, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/profiles:', error);
    return Response.json({ error: 'Failed to create or update user profile' }, { status: 500 });
  }
}