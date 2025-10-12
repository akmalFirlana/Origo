import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to get today's date in YYYY-MM-DD format
export function getToday(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Helper function to get the start of the week (Monday)
export function getWeekStart(date: Date = new Date()): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(date.setDate(diff));
}

// Helper function to get the start of the month
export function getMonthStart(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Helper function to format date as 'Month DD, YYYY'
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

// Helper function to format time as 'HH:MM AM/PM'
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  });
}

// Helper function to get priority color based on Eisenhower matrix
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent_important':
      return 'bg-red-500'; // Fire - Urgent & Important
    case 'important':
      return 'bg-blue-500'; // Important but not urgent
    case 'urgent':
      return 'bg-yellow-500'; // Urgent but not important
    case 'optional':
      return 'bg-green-500'; // Optional/Low priority
    default:
      return 'bg-gray-500';
  }
}

// Helper function to get priority label based on Eisenhower matrix
export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'urgent_important':
      return '🔥 Urgent & Important';
    case 'important':
      return '⚡ Important';
    case 'urgent':
      return '⏳ Urgent';
    case 'optional':
      return '🍃 Optional';
    default:
      return priority;
  }
}
