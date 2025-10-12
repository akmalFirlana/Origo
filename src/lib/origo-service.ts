import { createSupabaseServerClient } from "@/lib/supabase";
import { 
  Task, 
  Habit, 
  HabitLog, 
  Event, 
  ActivityLog, 
  UserProfile,
  Priority,
  TaskStatus,
  HabitFrequency,
  HabitLogStatus,
  ActivityAction
} from "@/lib/types";

// Task Service
export async function getTasks(userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
  
  return data as Task[];
}

export async function createTask(taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>, userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ ...taskData, user_id: userId }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
  
  return data as Task;
}

export async function updateTask(taskId: string, taskData: Partial<Task>, userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...taskData, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
  
  return data as Task;
}

export async function deleteTask(taskId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task');
  }
  
  return { success: true };
}

// Habit Service
export async function getHabits(userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching habits:', error);
    throw new Error('Failed to fetch habits');
  }
  
  return data as Habit[];
}

export async function createHabit(habitData: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>, userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('habits')
    .insert([{ ...habitData, user_id: userId }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating habit:', error);
    throw new Error('Failed to create habit');
  }
  
  return data as Habit;
}

export async function updateHabit(habitId: string, habitData: Partial<Habit>, userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('habits')
    .update({ ...habitData, updated_at: new Date().toISOString() })
    .eq('id', habitId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating habit:', error);
    throw new Error('Failed to update habit');
  }
  
  return data as Habit;
}

export async function deleteHabit(habitId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting habit:', error);
    throw new Error('Failed to delete habit');
  }
  
  return { success: true };
}

// Habit Log Service
export async function getHabitLogs(userId: string, from?: string, to?: string) {
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
    throw new Error('Failed to fetch habit logs');
  }
  
  return data as HabitLog[];
}

export async function createHabitLog(logData: Omit<HabitLog, 'id' | 'user_id' | 'created_at'>, userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('habit_logs')
    .insert([{ ...logData, user_id: userId }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating habit log:', error);
    throw new Error('Failed to create habit log');
  }
  
  return data as HabitLog;
}

export async function updateHabitLog(logId: string, logData: Partial<HabitLog>, userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('habit_logs')
    .update({ ...logData })
    .eq('id', logId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating habit log:', error);
    throw new Error('Failed to update habit log');
  }
  
  return data as HabitLog;
}

// Event Service
export async function getEvents(userId: string, from?: string, to?: string) {
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
    throw new Error('Failed to fetch events');
  }
  
  return data as Event[];
}

export async function createEvent(eventData: Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at'>, userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('events')
    .insert([{ ...eventData, user_id: userId }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event');
  }
  
  return data as Event;
}

export async function updateEvent(eventId: string, eventData: Partial<Event>, userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('events')
    .update({ ...eventData, updated_at: new Date().toISOString() })
    .eq('id', eventId)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating event:', error);
    throw new Error('Failed to update event');
  }
  
  return data as Event;
}

export async function deleteEvent(eventId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error deleting event:', error);
    throw new Error('Failed to delete event');
  }
  
  return { success: true };
}

// Activity Log Service
export async function getActivityLogs(userId: string, from?: string, to?: string, entityType?: string) {
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
    throw new Error('Failed to fetch activity logs');
  }
  
  return data as ActivityLog[];
}

// Profile Service
export async function getUserProfile(userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
  
  return data as UserProfile | null;
}

export async function createOrUpdateUserProfile(userId: string, profileData: Partial<UserProfile>) {
  const supabase = await createSupabaseServerClient();
  
  // Try to update first
  const { data: updateData, error: updateError } = await supabase
    .from('profiles')
    .update({ ...profileData, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  
  // If no rows were updated, try to insert
  if (updateError || !updateData) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ user_id: userId, ...profileData }])
      .select()
      .single();
    
    if (error && error.code !== '23505') { // 23505 is unique violation, which means update should work
      console.error('Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
    
    return data as UserProfile;
  }
  
  // If update worked, fetch the updated profile
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching updated user profile:', error);
    throw new Error('Failed to fetch updated user profile');
  }
  
  return data as UserProfile;
}