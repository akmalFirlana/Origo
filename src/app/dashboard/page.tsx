"use client";

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
  Plus,
  Bell
} from "lucide-react";
import { getToday } from "@/lib/utils";
import { Task, Habit, Event } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import ProtectedLayout from "../protected-layout";
import { useOrigoData } from "@/lib/hooks/use-origo-data";
import { useEffect, useState } from "react";
import { checkUpcomingNotifications } from "@/lib/notifications";
import NotificationProvider from "@/components/notification-provider";

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <NotificationProvider />
      <ProtectedDashboardContent />
    </ProtectedLayout>
  );
}

function ProtectedDashboardContent() {
  const { user } = useUser();
  const { 
    tasks, 
    habits, 
    events, 
    loading, 
    error,
    loadData 
  } = useOrigoData();
  
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

  // Calculate today's stats
  const today = getToday();
  const todayTasks = tasks.filter(task => task.due_date === today);
  const urgentImportantTasks = tasks.filter(task => task.priority === 'urgent_important');
  
  // Calculate habit completion stats (this would be more complex in reality)
  const habitCompletionRate = Math.min(100, Math.round((habits.length > 0 ? 67 : 0))); // Placeholder calculation

  // Check for upcoming notifications
  useEffect(() => {
    // Get notification permission status
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
      
      // Check for upcoming tasks and events periodically
      const interval = setInterval(() => {
        if (tasks.length > 0 || events.length > 0) {
          checkUpcomingNotifications(tasks, events);
        }
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [tasks, events]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName || 'User'}. Here&rsquo;s what&rsquo;s happening today.</p>
        </div>
        <div className="flex gap-2">
          {notificationPermission !== 'granted' && (
            <Button variant="outline" onClick={requestNotificationPermission}>
              <Bell className="w-4 h-4 mr-2" />
              Enable Notifications
            </Button>
          )}
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
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
              <CardTitle>Today&rsquo;s Tasks</CardTitle>
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