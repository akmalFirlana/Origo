// Types for the Origo productivity app

export type Theme = 'light' | 'dark' | 'system';

export type NotificationPreferences = {
  taskReminders: boolean;
  eventReminders: boolean;
  dailyDigest: boolean;
};

export type UserProfile = {
  id: string;
  user_id: string;
  theme_preference: Theme;
  notification_preferences: NotificationPreferences;
  created_at: string;
  updated_at: string;
};

export type Priority = 'urgent_important' | 'important' | 'urgent' | 'optional';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: Priority;
  due_date?: string;
  tags: string[];
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  completed_at?: string;
};

export type EisenhowerMatrix = {
  [key: string]: Task[];
};

export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export type Habit = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  schedule?: {
    daysOfWeek?: number[]; // Array of day numbers (0=Sunday, 1=Monday, etc.)
    perWeekTarget?: number; // Target number of times per week
  }; // Flexible schedule pattern
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type HabitLogStatus = 'done' | 'skipped' | 'missed';

export type HabitLog = {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // Date string in YYYY-MM-DD format
  status: HabitLogStatus;
  note?: string;
  created_at: string;
};

export type Event = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  location?: string;
  start_at: string; // ISO date string
  end_at: string; // ISO date string
  reminders: number[]; // Array of minutes before event to remind
  created_at: string;
  updated_at: string;
};

export type ActivityAction = 'create' | 'update' | 'delete' | 'complete' | 'incomplete' | 'check' | 'uncheck' | 'skip';

export type Tag = {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
};

export type ActivityMetadataValue = string | number | boolean | null | undefined;

export type ActivityMetadata = {
  title?: string;
  status?: string;
  name?: string;
  start_at?: string;
} & Record<string, ActivityMetadataValue>;

export type ActivityLog = {
  id: string;
  user_id: string;
  entity_type: 'task' | 'habit' | 'event' | 'note';
  entity_id: string;
  action: ActivityAction;
  metadata: ActivityMetadata;
  created_at: string;
};