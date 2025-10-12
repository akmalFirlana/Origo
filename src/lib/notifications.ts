// Notification utility for Origo app
import { Task, Event } from '@/lib/types';

// Register service worker and request notification permission
export async function registerNotificationService() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered with scope:', registration.scope);
      
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        return true;
      } else {
        console.log('Notification permission denied.');
        return false;
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  } else {
    console.warn('Push messaging is not supported');
    return false;
  }
}

// Show notification for tasks
export function showTaskNotification(task: Task) {
  if (Notification.permission === 'granted') {
    const title = `Task Reminder: ${task.title}`;
    const options = {
      body: task.description || 'You have a task to complete',
      icon: '/origo-icon.png',
      badge: '/origo-badge.png',
      tag: `task-${task.id}`,
      data: { 
        url: '/tasks',
        taskId: task.id 
      }
    };

    // Show notification if we're not in a service worker context
    if (typeof window !== 'undefined') {
      new Notification(title, options);
    }
  }
}

// Show notification for events
export function showEventNotification(event: Event) {
  if (Notification.permission === 'granted') {
    const title = `Event Reminder: ${event.title}`;
    const options = {
      body: event.description || `Event starts at ${new Date(event.start_at).toLocaleTimeString()}`,
      icon: '/origo-icon.png',
      badge: '/origo-badge.png',
      tag: `event-${event.id}`,
      data: { 
        url: '/calendar',
        eventId: event.id 
      }
    };

    // Show notification if we're not in a service worker context
    if (typeof window !== 'undefined') {
      new Notification(title, options);
    }
  }
}

// Check for upcoming tasks and events that need notifications
export function checkUpcomingNotifications(tasks: Task[], events: Event[]) {
  const now = new Date();
  const soon = new Date(now.getTime() + 10 * 60000); // 10 minutes from now

  // Check tasks for due notifications
  tasks.forEach(task => {
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      
      // Check if task is overdue
      if (dueDate < now && task.status !== 'done') {
        showTaskNotification({
          ...task,
          title: `Overdue Task: ${task.title}`
        });
      } 
      // Check if task is due soon
      else if (dueDate >= now && dueDate <= soon && task.status !== 'done') {
        showTaskNotification({
          ...task,
          title: `Due Soon: ${task.title}`
        });
      }
    }
  });

  // Check events for notifications
  events.forEach(event => {
    const startDate = new Date(event.start_at);
    
    // Check if event starts soon (within 10 minutes)
    if (startDate >= now && startDate <= soon) {
      showEventNotification({
        ...event,
        title: `Event Starting Soon: ${event.title}`
      });
    }
  });
}

// Schedule notifications using the Notification API
export function scheduleNotification(title: string, body: string, delay: number, data?: any) {
  if (Notification.permission === 'granted') {
    setTimeout(() => {
      const options = {
        body,
        icon: '/origo-icon.png',
        badge: '/origo-badge.png',
        data: data || {}
      };

      if (typeof window !== 'undefined') {
        new Notification(title, options);
      }
    }, delay * 1000); // delay in seconds
  }
}

// Initialize notification system
export function initializeNotificationSystem() {
  // Register service worker
  registerNotificationService();
  
  // Add event listener for when service worker receives a message
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Received message from service worker:', event.data);
    });
  }
}