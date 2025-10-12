import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  getTasks as apiGetTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  getHabits as apiGetHabits,
  createHabit as apiCreateHabit,
  updateHabit as apiUpdateHabit,
  deleteHabit as apiDeleteHabit,
  getEvents as apiGetEvents,
  createEvent as apiCreateEvent,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent,
  getActivityLogs as apiGetActivityLogs,
  getHabitLogs as apiGetHabitLogs,
  createHabitLog as apiCreateHabitLog,
  getTags as apiGetTags,
  createTag as apiCreateTag,
  getUserProfile as apiGetUserProfile,
  createOrUpdateUserProfile as apiCreateOrUpdateUserProfile,
  Task,
  Habit,
  Event,
  ActivityLog,
  HabitLog,
  Tag,
  UserProfile
} from '@/lib/api-service';

export const useOrigoData = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data for the signed-in user
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      loadData();
    } else if (isLoaded && !isSignedIn) {
      // User is not signed in, reset state
      setTasks([]);
      setHabits([]);
      setEvents([]);
      setActivityLogs([]);
      setHabitLogs([]);
      setTags([]);
      setProfile(null);
      setLoading(false);
    }
  }, [isSignedIn, isLoaded, user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Load all data concurrently with individual error handling
      const [
        tasksData,
        habitsData,
        eventsData,
        activityLogsData,
        habitLogsData,
        tagsData,
        profileData
      ] = await Promise.all([
        apiGetTasks().catch(err => {
          console.error('Error loading tasks:', err);
          return [];
        }),
        apiGetHabits().catch(err => {
          console.error('Error loading habits:', err);
          return [];
        }),
        apiGetEvents().catch(err => {
          console.error('Error loading events:', err);
          return [];
        }),
        apiGetActivityLogs().catch(err => {
          console.error('Error loading activity logs:', err);
          return [];
        }),
        apiGetHabitLogs().catch(err => {
          console.error('Error loading habit logs:', err);
          return [];
        }),
        apiGetTags().catch(err => {
          console.error('Error loading tags:', err);
          return [];
        }),
        apiGetUserProfile().catch(err => {
          console.error('Error loading user profile:', err);
          return null;
        })
      ]);
      
      setTasks(tasksData);
      setHabits(habitsData);
      setEvents(eventsData);
      setActivityLogs(activityLogsData);
      setHabitLogs(habitLogsData);
      setTags(tagsData);
      setProfile(profileData);
    } catch (err) {
      console.error('Error loading data:', err);
      // Even if there's an overall error, try to set what we could load
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Task functions
  const addTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>) => {
    if (!user) return;
    
    try {
      const newTask = await apiCreateTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (taskId: string, taskData: Partial<Task>) => {
    if (!user) return;
    
    try {
      const updatedTask = await apiUpdateTask(taskId, taskData);
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  const removeTask = async (taskId: string) => {
    if (!user) return;
    
    try {
      await apiDeleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };

  // Habit functions
  const addHabit = async (habitData: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    try {
      const newHabit = await apiCreateHabit(habitData);
      setHabits(prev => [...prev, newHabit]);
      return newHabit;
    } catch (err) {
      console.error('Error creating habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to create habit');
      throw err;
    }
  };

  const updateHabit = async (habitId: string, habitData: Partial<Habit>) => {
    if (!user) return;
    
    try {
      const updatedHabit = await apiUpdateHabit(habitId, habitData);
      setHabits(prev => prev.map(habit => habit.id === habitId ? updatedHabit : habit));
      return updatedHabit;
    } catch (err) {
      console.error('Error updating habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update habit');
      throw err;
    }
  };

  const removeHabit = async (habitId: string) => {
    if (!user) return;
    
    try {
      await apiDeleteHabit(habitId);
      setHabits(prev => prev.filter(habit => habit.id !== habitId));
    } catch (err) {
      console.error('Error deleting habit:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete habit');
      throw err;
    }
  };

  // Add habit log
  const addHabitLog = async (logData: Omit<HabitLog, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    
    try {
      const newLog = await apiCreateHabitLog(logData);
      setHabitLogs(prev => [...prev, newLog]);
      return newLog;
    } catch (err) {
      console.error('Error creating habit log:', err);
      setError(err instanceof Error ? err.message : 'Failed to create habit log');
      throw err;
    }
  };

  // Event functions
  const addEvent = async (eventData: Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    try {
      const newEvent = await apiCreateEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    if (!user) return;
    
    try {
      const updatedEvent = await apiUpdateEvent(eventId, eventData);
      setEvents(prev => prev.map(event => event.id === eventId ? updatedEvent : event));
      return updatedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    }
  };

  const removeEvent = async (eventId: string) => {
    if (!user) return;
    
    try {
      await apiDeleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    }
  };

  // Tag functions
  const addTag = async (tagData: Omit<Tag, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return;
    
    try {
      const newTag = await apiCreateTag(tagData);
      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (err) {
      console.error('Error creating tag:', err);
      setError(err instanceof Error ? err.message : 'Failed to create tag');
      throw err;
    }
  };

  return {
    // Data
    tasks,
    habits,
    events,
    activityLogs,
    habitLogs,
    tags,
    profile,
    loading,
    error,
    
    // Functions
    loadData,
    addTask,
    updateTask,
    removeTask,
    addHabit,
    updateHabit,
    removeHabit,
    addHabitLog,
    addEvent,
    updateEvent,
    removeEvent,
    addTag,
  };
};