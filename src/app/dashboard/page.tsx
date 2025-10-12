"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CalendarDays, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Clock,
  Flame,
  Sun,
  Moon,
  Plus
} from "lucide-react";
import { getToday } from "@/lib/utils";
import { Task, Habit, Event } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import ProtectedLayout from "../protected-layout";
import { SignedIn } from "@clerk/nextjs";

// Mock data for now - these will be replaced with actual API calls
const mockTasks: Task[] = [
  { id: '1', user_id: 'user1', title: 'Complete project proposal', priority: 'urgent_important', due_date: '2025-10-13', status: 'todo', created_at: '2025-10-12', tags: ['work', 'important'], description: 'Finish the proposal for the new client project' },
  { id: '2', user_id: 'user1', title: 'Buy groceries', priority: 'urgent', due_date: '2025-10-12', status: 'in_progress', created_at: '2025-10-12', tags: ['personal'], description: 'Get ingredients for dinner' },
  { id: '3', user_id: 'user1', title: 'Schedule team meeting', priority: 'important', due_date: '2025-10-15', status: 'todo', created_at: '2025-10-12', tags: ['work'], description: 'Weekly sync with the development team' },
];

const mockHabits: Habit[] = [
  { id: '1', user_id: 'user1', name: 'Morning meditation', description: '10 minutes of mindfulness', frequency: 'daily', target_frequency: 7, created_at: '2025-10-10', updated_at: '2025-10-10' },
  { id: '2', user_id: 'user1', name: 'Exercise', description: '30 minutes of cardio', frequency: 'daily', target_frequency: 5, created_at: '2025-10-10', updated_at: '2025-10-10' },
  { id: '3', user_id: 'user1', name: 'Read', description: 'Read for 20 minutes', frequency: 'daily', target_frequency: 7, created_at: '2025-10-10', updated_at: '2025-10-10' },
];

const mockEvents: Event[] = [
  { id: '1', user_id: 'user1', title: 'Team meeting', description: 'Weekly sync', location: 'Conference Room A', start_at: '2025-10-12T10:00:00Z', end_at: '2025-10-12T11:00:00Z', reminders: [15], created_at: '2025-10-10', updated_at: '2025-10-10' },
  { id: '2', user_id: 'user1', title: 'Doctor appointment', description: 'Annual checkup', location: 'City Hospital', start_at: '2025-10-13T14:00:00Z', end_at: '2025-10-13T15:00:00Z', reminders: [60], created_at: '2025-10-10', updated_at: '2025-10-10' },
];

import { SignedIn } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <ProtectedDashboardContent />
    </ProtectedLayout>
  );
}

function ProtectedDashboardContent() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    // In a real app, we would fetch data based on the logged-in user
    setTasks(mockTasks);
    setHabits(mockHabits);
    setEvents(mockEvents);
  }, []);

  // Calculate today's stats
  const today = getToday();
  const todayTasks = tasks.filter(task => task.due_date === today);
  const urgentImportantTasks = tasks.filter(task => task.priority === 'urgent_important');
  
  // Calculate habit completion stats
  const habitCompletionRate = 67; // This would be calculated from actual habit logs

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName || 'User'}. Here's what's happening today.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Quick Add
        </Button>
      </div>

      {/* Today's Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Today
            </CardDescription>
            <CardTitle className="text-2xl">{today}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayTasks.length}</div>
            <p className="text-xs text-muted-foreground">tasks due today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Important
            </CardDescription>
            <CardTitle className="text-2xl">Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentImportantTasks.length}</div>
            <p className="text-xs text-muted-foreground">urgent & important</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Habits
            </CardDescription>
            <CardTitle className="text-2xl">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habitCompletionRate}%</div>
            <Progress value={habitCompletionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">this week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Events
            </CardDescription>
            <CardTitle className="text-2xl">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">events scheduled</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Today's Tasks</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <CardDescription>Tasks due today and upcoming</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{task.priority}</Badge>
                      {task.due_date && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {task.due_date}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              ))}
              
              {todayTasks.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No tasks due today</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Habits */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Habit Progress</CardTitle>
              <Button variant="outline" size="sm">Track</Button>
            </div>
            <CardDescription>Your daily habits and streaks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habits.map(habit => (
                <div key={habit.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                  <div>
                    <h3 className="font-medium">{habit.name}</h3>
                    <p className="text-sm text-muted-foreground">{habit.description}</p>
                  </div>
                  <Button size="sm">✓ Done</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Upcoming Events</CardTitle>
            <Button variant="outline" size="sm">View Calendar</Button>
          </div>
          <CardDescription>Your scheduled events and appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(event.start_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(event.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {event.location && (
                      <span>{event.location}</span>
                    )}
                  </div>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
            ))}
            
            {events.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No upcoming events</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}