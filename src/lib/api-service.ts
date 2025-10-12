// Client-side API service for Origo app

import { 
  Task, 
  Habit, 
  HabitLog, 
  Event, 
  ActivityLog, 
  UserProfile,
  Tag
} from "@/lib/types";

// Base API URL - can be configured via environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

// Helper function to get auth headers with Clerk token
async function getAuthHeaders(): Promise<Record<string, string>> {
  // Clerk will handle authentication automatically with middleware
  // We just need to ensure the request is made with proper headers
  return {
    "Content-Type": "application/json",
  };
}

// Task API service
export async function getTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
}

export async function createTask(taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }

  return response.json();
}

export async function updateTask(taskId: string, taskData: Partial<Task>): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteTask(taskId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }

  return response.json();
}

// Habit API service
export async function getHabits(): Promise<Habit[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/habits`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`Failed to fetch habits: ${response.status} ${response.statusText}`);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching habits:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
}

export async function createHabit(habitData: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Habit> {
  const response = await fetch(`${API_BASE_URL}/habits`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(habitData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create habit: ${response.statusText}`);
  }

  return response.json();
}

export async function updateHabit(habitId: string, habitData: Partial<Habit>): Promise<Habit> {
  const response = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(habitData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update habit: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteHabit(habitId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete habit: ${response.statusText}`);
  }

  return response.json();
}

// Habit Log API service
export async function getHabitLogs(from?: string, to?: string): Promise<HabitLog[]> {
  try {
    let url = `${API_BASE_URL}/habit-logs`;
    if (from) url += `?from=${from}`;
    if (to) url += `${from ? '&' : '?'}to=${to}`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`Failed to fetch habit logs: ${response.status} ${response.statusText}`);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching habit logs:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
}

export async function createHabitLog(logData: Omit<HabitLog, 'id' | 'user_id' | 'created_at'>): Promise<HabitLog> {
  const response = await fetch(`${API_BASE_URL}/habit-logs`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(logData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create habit log: ${response.statusText}`);
  }

  return response.json();
}

export async function updateHabitLog(logId: string, logData: Partial<HabitLog>): Promise<HabitLog> {
  const response = await fetch(`${API_BASE_URL}/habit-logs/${logId}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(logData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update habit log: ${response.statusText}`);
  }

  return response.json();
}

// Event API service
export async function getEvents(from?: string, to?: string): Promise<Event[]> {
  try {
    let url = `${API_BASE_URL}/events`;
    if (from) url += `?from=${from}`;
    if (to) url += `${from ? '&' : '?'}to=${to}`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`Failed to fetch events: ${response.status} ${response.statusText}`);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
}

export async function createEvent(eventData: Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create event: ${response.statusText}`);
  }

  return response.json();
}

export async function updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update event: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteEvent(eventId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete event: ${response.statusText}`);
  }

  return response.json();
}

// Activity Log API service
export async function getActivityLogs(from?: string, to?: string, entityType?: string): Promise<ActivityLog[]> {
  try {
    let url = `${API_BASE_URL}/activity`;
    if (from) url += `?from=${from}`;
    if (to) url += `${from ? '&' : '?'}to=${to}`;
    if (entityType) url += `${from || to ? '&' : '?'}entityType=${entityType}`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`Failed to fetch activity logs: ${response.status} ${response.statusText}`);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
}

// Profile API service
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function createOrUpdateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/profiles`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create or update user profile: ${response.statusText}`);
  }

  return response.json();
}

// Tag API service
export async function getTags(): Promise<Tag[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      console.error(`Failed to fetch tags: ${response.status} ${response.statusText}`);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching tags:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
}

export async function createTag(tagData: Omit<Tag, 'id' | 'user_id' | 'created_at'>): Promise<Tag> {
  const response = await fetch(`${API_BASE_URL}/tags`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify(tagData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create tag: ${response.statusText}`);
  }

  return response.json();
}

export async function updateTag(tagId: string, tagData: Partial<Tag>): Promise<Tag> {
  const response = await fetch(`${API_BASE_URL}/tags/${tagId}`, {
    method: "PUT",
    headers: await getAuthHeaders(),
    body: JSON.stringify(tagData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update tag: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteTag(tagId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/tags/${tagId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete tag: ${response.statusText}`);
  }

  return response.json();
}