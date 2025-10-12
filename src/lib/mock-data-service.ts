// Local mock data service for Origo app
// Used as fallback when Supabase is not available or during development

import { 
  Task, 
  Habit, 
  HabitLog, 
  Event, 
  ActivityLog, 
  UserProfile,
  Tag,
  Priority,
  HabitLogStatus,
  ActivityAction
} from "@/lib/types";

// Mock data storage
let mockTasks: Task[] = [];
let mockHabits: Habit[] = [];
let mockHabitLogs: HabitLog[] = [];
let mockEvents: Event[] = [];
let mockActivityLogs: ActivityLog[] = [];
let mockTags: Tag[] = [];
let mockProfile: UserProfile | null = null;

// Initialize with some sample data
export function initializeMockData(userId: string) {
  if (mockTasks.length === 0) {
    mockTasks = [
      {
        id: '1',
        user_id: userId,
        title: 'Complete project proposal',
        description: 'Finish the Q3 project proposal document',
        priority: 'urgent_important',
        due_date: '2025-10-15',
        tags: ['work', 'important'],
        status: 'todo',
        created_at: '2025-10-10T09:00:00Z',
        updated_at: '2025-10-10T09:00:00Z'
      },
      {
        id: '2',
        user_id: userId,
        title: 'Team meeting',
        description: 'Weekly team sync',
        priority: 'important',
        due_date: '2025-10-12',
        tags: ['meeting'],
        status: 'in_progress',
        created_at: '2025-10-10T10:00:00Z',
        updated_at: '2025-10-10T10:00:00Z'
      },
      {
        id: '3',
        user_id: userId,
        title: 'Review documentation',
        description: 'Go through new API documentation',
        priority: 'urgent',
        due_date: '2025-10-13',
        tags: ['learning'],
        status: 'todo',
        created_at: '2025-10-10T11:00:00Z',
        updated_at: '2025-10-10T11:00:00Z'
      }
    ];
  }

  if (mockHabits.length === 0) {
    mockHabits = [
      {
        id: '1',
        user_id: userId,
        name: 'Morning Meditation',
        description: '10 minutes of meditation to start the day',
        frequency: 'daily',
        schedule: { perWeekTarget: 7 },
        notes: 'Best done before breakfast',
        created_at: '2025-10-10T08:00:00Z',
        updated_at: '2025-10-10T08:00:00Z'
      },
      {
        id: '2',
        user_id: userId,
        name: 'Evening Journal',
        description: 'Write down 3 things you are grateful for',
        frequency: 'daily',
        schedule: { perWeekTarget: 7 },
        notes: 'Reflect on the day',
        created_at: '2025-10-10T08:01:00Z',
        updated_at: '2025-10-10T08:01:00Z'
      }
    ];
  }

  if (mockEvents.length === 0) {
    mockEvents = [
      {
        id: '1',
        user_id: userId,
        title: 'Project Deadline',
        description: 'Submit final project',
        location: 'Office',
        start_at: '2025-10-15T17:00:00Z',
        end_at: '2025-10-15T18:00:00Z',
        reminders: [60],
        created_at: '2025-10-10T07:00:00Z',
        updated_at: '2025-10-10T07:00:00Z'
      },
      {
        id: '2',
        user_id: userId,
        title: 'Doctor Appointment',
        description: 'Annual checkup',
        location: 'City Hospital',
        start_at: '2025-10-13T14:00:00Z',
        end_at: '2025-10-13T15:00:00Z',
        reminders: [60],
        created_at: '2025-10-10T07:01:00Z',
        updated_at: '2025-10-10T07:01:00Z'
      }
    ];
  }
}

// Task API functions
export async function getTasks(): Promise<Task[]> {
  return mockTasks;
}

export async function createTask(taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>, userId: string): Promise<Task> {
  const newTask: Task = {
    ...taskData,
    id: `task-${Date.now()}`,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: taskData.status === 'done' ? new Date().toISOString() : undefined
  };
  
  mockTasks.push(newTask);
  return newTask;
}

export async function updateTask(taskId: string, taskData: Partial<Task>, userId: string): Promise<Task> {
  const index = mockTasks.findIndex(t => t.id === taskId && t.user_id === userId);
  if (index !== -1) {
    mockTasks[index] = { 
      ...mockTasks[index], 
      ...taskData, 
      updated_at: new Date().toISOString(),
      completed_at: taskData.status === 'done' ? new Date().toISOString() : mockTasks[index].completed_at
    };
    return mockTasks[index];
  }
  throw new Error('Task not found');
}

export async function deleteTask(taskId: string, userId: string): Promise<boolean> {
  const initialLength = mockTasks.length;
  mockTasks = mockTasks.filter(t => t.id !== taskId || t.user_id !== userId);
  return mockTasks.length < initialLength;
}

// Habit API functions
export async function getHabits(): Promise<Habit[]> {
  return mockHabits;
}

export async function createHabit(habitData: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>, userId: string): Promise<Habit> {
  const newHabit: Habit = {
    ...habitData,
    id: `habit-${Date.now()}`,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockHabits.push(newHabit);
  return newHabit;
}

export async function updateHabit(habitId: string, habitData: Partial<Habit>, userId: string): Promise<Habit> {
  const index = mockHabits.findIndex(h => h.id === habitId && h.user_id === userId);
  if (index !== -1) {
    mockHabits[index] = { 
      ...mockHabits[index], 
      ...habitData, 
      updated_at: new Date().toISOString()
    };
    return mockHabits[index];
  }
  throw new Error('Habit not found');
}

export async function deleteHabit(habitId: string, userId: string): Promise<boolean> {
  const initialLength = mockHabits.length;
  mockHabits = mockHabits.filter(h => h.id !== habitId || h.user_id !== userId);
  return mockHabits.length < initialLength;
}

// Habit Log API functions
export async function getHabitLogs(): Promise<HabitLog[]> {
  return mockHabitLogs;
}

export async function createHabitLog(logData: Omit<HabitLog, 'id' | 'user_id' | 'created_at'>, userId: string): Promise<HabitLog> {
  const newLog: HabitLog = {
    ...logData,
    id: `log-${Date.now()}`,
    user_id: userId,
    created_at: new Date().toISOString()
  };
  
  mockHabitLogs.push(newLog);
  return newLog;
}

// Event API functions
export async function getEvents(): Promise<Event[]> {
  return mockEvents;
}

export async function createEvent(eventData: Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at'>, userId: string): Promise<Event> {
  const newEvent: Event = {
    ...eventData,
    id: `event-${Date.now()}`,
    user_id: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockEvents.push(newEvent);
  return newEvent;
}

export async function updateEvent(eventId: string, eventData: Partial<Event>, userId: string): Promise<Event> {
  const index = mockEvents.findIndex(e => e.id === eventId && e.user_id === userId);
  if (index !== -1) {
    mockEvents[index] = { 
      ...mockEvents[index], 
      ...eventData, 
      updated_at: new Date().toISOString()
    };
    return mockEvents[index];
  }
  throw new Error('Event not found');
}

export async function deleteEvent(eventId: string, userId: string): Promise<boolean> {
  const initialLength = mockEvents.length;
  mockEvents = mockEvents.filter(e => e.id !== eventId || e.user_id !== userId);
  return mockEvents.length < initialLength;
}

// Activity Log API functions
export async function getActivityLogs(): Promise<ActivityLog[]> {
  return mockActivityLogs;
}

export async function createActivityLog(activityData: Omit<ActivityLog, 'id' | 'user_id' | 'created_at'>, userId: string): Promise<ActivityLog> {
  const newLog: ActivityLog = {
    ...activityData,
    id: `activity-${Date.now()}`,
    user_id: userId,
    created_at: new Date().toISOString()
  };
  
  mockActivityLogs.push(newLog);
  return newLog;
}

// Tag API functions
export async function getTags(): Promise<Tag[]> {
  return mockTags;
}

export async function createTag(tagData: Omit<Tag, 'id' | 'user_id' | 'created_at'>, userId: string): Promise<Tag> {
  const newTag: Tag = {
    ...tagData,
    id: `tag-${Date.now()}`,
    user_id: userId,
    created_at: new Date().toISOString()
  };
  
  mockTags.push(newTag);
  return newTag;
}

// Profile API functions
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!mockProfile) {
    mockProfile = {
      id: `profile-${Date.now()}`,
      user_id: userId,
      theme_preference: 'system',
      notification_preferences: {
        taskReminders: true,
        eventReminders: true,
        dailyDigest: false
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
  return mockProfile;
}

export async function createOrUpdateUserProfile(profileData: Partial<UserProfile>, userId: string): Promise<UserProfile> {
  if (!mockProfile || mockProfile.user_id !== userId) {
    mockProfile = {
      id: `profile-${Date.now()}`,
      user_id: userId,
      theme_preference: profileData.theme_preference || 'system',
      notification_preferences: profileData.notification_preferences || {
        taskReminders: true,
        eventReminders: true,
        dailyDigest: false
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else {
    mockProfile = {
      ...mockProfile,
      ...profileData,
      updated_at: new Date().toISOString()
    };
  }
  
  return mockProfile;
}