"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  SkipForward,
  TrendingUp,
  CalendarDays,
  Target
} from "lucide-react";
import { Habit, HabitLog, HabitFrequency, HabitLogStatus } from "@/lib/types";
import { getToday } from "@/lib/utils";
import ProtectedLayout from "../protected-layout";
import { useOrigoData } from "@/lib/hooks/use-origo-data";
import { HabitCompletionChart, HabitStreakChart } from "@/components/habits/habit-charts";
import { format, eachDayOfInterval, subWeeks, isSameDay } from "date-fns";
import NotificationProvider from "@/components/notification-provider";

export default function HabitsPage() {
  return (
    <ProtectedLayout>
      <NotificationProvider />
      <ProtectedHabitsContent />
    </ProtectedLayout>
  );
}

function ProtectedHabitsContent() {
  const { habits, habitLogs, loading, error, addHabitLog } = useOrigoData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFrequency, setFilterFrequency] = useState<HabitFrequency | "all">("all");
  
  // Calculate today's habits and logs
  const today = getToday();
  const todayHabits = habits.map(habit => {
    const log = habitLogs.find(log => log.habit_id === habit.id && log.date === today);
    return {
      habit,
      log: log || null
    };
  });

  // Calculate habit statistics for charts
  const lastWeek = eachDayOfInterval({
    start: subWeeks(new Date(), 1),
    end: new Date()
  }).map(date => format(date, 'yyyy-MM-dd'));
  
  const habitCompletionData = habits.map(habit => {
    // Count completed logs in the last week for this habit
    const completedCount = lastWeek.reduce((count, date) => {
      const log = habitLogs.find(
        log => log.habit_id === habit.id && 
               log.date === date && 
               log.status === 'done'
      );
      return count + (log ? 1 : 0);
    }, 0);
    
    return {
      name: habit.name,
      completed: completedCount,
      target: habit.schedule?.perWeekTarget || 7, // Default to 7 for daily habits
      streak: calculateStreak(habit, habitLogs)
    };
  });
  
  const habitStreakData = habits.map(habit => ({
    name: habit.name,
    value: calculateStreak(habit, habitLogs)
  }));

  // Filter habits based on search and filters
  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          habit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFrequency = filterFrequency === "all" || habit.frequency === filterFrequency;
    
    return matchesSearch && matchesFrequency;
  });

  // Function to handle habit check
  const handleHabitCheck = async (habitId: string, status: HabitLogStatus) => {
    try {
      await addHabitLog({
        habit_id: habitId,
        date: today,
        status,
        note: '' // Optional note
      });
    } catch (err) {
      console.error('Failed to update habit log:', err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Habits</h1>
          <p className="text-muted-foreground">Build productive routines and track your progress</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Habit
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <select 
            value={filterFrequency} 
            onChange={(e) => setFilterFrequency(e.target.value as HabitFrequency | "all")}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Frequencies</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      {/* Today&rsquo;s Habits */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today&rsquo;s Habits</CardTitle>
              <CardDescription>{new Date(today).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </div>
            <Badge variant="outline">{todayHabits.filter(h => h.log?.status === 'done').length} / {todayHabits.length} completed</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayHabits.map(({ habit, log }) => (
              <HabitCard 
                key={habit.id} 
                habit={habit} 
                log={log}
                onCheck={(status) => handleHabitCheck(habit.id, status)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Habit Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Habit Completion (Last 7 Days)</CardTitle>
            <CardDescription>Track your habit completion over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <HabitCompletionChart data={habitCompletionData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Habit Streaks</CardTitle>
            <CardDescription>Current streak days for each habit</CardDescription>
          </CardHeader>
          <CardContent>
            <HabitStreakChart data={habitStreakData} />
          </CardContent>
        </Card>
      </div>

      {/* Habit Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weekly Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {habits.length > 0 
                ? Math.max(...habits.map(habit => calculateStreak(habit, habitLogs))) 
                : 0} days
            </div>
            <p className="text-sm text-muted-foreground">Your best current streak</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {habits.length > 0 
                ? Math.round((habitLogs.filter(log => log.status === 'done').length / 
                     Math.max(habitLogs.length, 1)) * 100) + '%' 
                : '0%'}
            </div>
            <p className="text-sm text-muted-foreground">Overall completion rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Active Habits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{habits.length}</div>
            <p className="text-sm text-muted-foreground">You&rsquo;re tracking</p>
          </CardContent>
        </Card>
      </div>

      {/* All Habits List */}
      <Card>
        <CardHeader>
          <CardTitle>All Habits</CardTitle>
          <CardDescription>Manage your habit collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHabits.map(habit => (
              <div key={habit.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{habit.name}</h3>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{habit.frequency}</Badge>
                      <Badge variant="outline">
                        {habit.schedule?.perWeekTarget}/{habit.frequency === 'daily' ? 'day' : habit.frequency === 'weekly' ? 'week' : 'month'}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to calculate streak
function calculateStreak(habit: Habit, habitLogs: HabitLog[]): number {
  let streak = 0;
  const today = new Date();
  
  // Get logs for this specific habit
  const habitLogsForHabit = habitLogs
    .filter(log => log.habit_id === habit.id && log.status === 'done')
    .map(log => new Date(log.date))
    .sort((a, b) => b.getTime() - a.getTime()); // Sort descending by date

  // If no logs, return 0
  if (habitLogsForHabit.length === 0) return 0;

  // If the last completion wasn't today and the habit is daily, streak is broken
  const lastCompleted = habitLogsForHabit[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if the habit was completed yesterday or today
  if (!isSameDay(lastCompleted, today) && !isSameDay(lastCompleted, yesterday)) {
    // Streak is broken, find the last consecutive sequence
    let expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - 1);
    
    for (const logDate of habitLogsForHabit) {
      if (isSameDay(logDate, expectedDate)) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break; // Streak is broken
      }
    }
  } else {
    // Streak may still be active, continue counting
    let expectedDate = new Date(today);
    if (!isSameDay(lastCompleted, today)) {
      expectedDate.setDate(expectedDate.getDate() - 1);
    }
    
    for (const logDate of habitLogsForHabit) {
      if (isSameDay(logDate, expectedDate)) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break; // Streak is broken
      }
    }
  }

  return streak;
}

// Habit Card Component
function HabitCard({ 
  habit, 
  log, 
  onCheck 
}: { 
  habit: Habit; 
  log: HabitLog | null; 
  onCheck: (status: HabitLogStatus) => void; 
}) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{habit.frequency}</Badge>
            <Badge variant="outline">
              {habit.schedule?.perWeekTarget}/{habit.frequency === 'daily' ? 'day' : habit.frequency === 'weekly' ? 'week' : 'month'}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-1">
          {log?.status === 'done' ? (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onCheck('missed')}
              className="border-green-500 text-green-500 hover:bg-green-500/10"
            >
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onCheck('done')}
              className="border-green-500 text-green-500 hover:bg-green-500/10"
            >
              <Circle className="w-4 h-4" />
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onCheck('skipped')}
            className={log?.status === 'skipped' 
              ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10' 
              : 'border-gray-300 hover:bg-gray-100'}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-muted-foreground">
        {log?.status === 'done' && '✓ Completed today'}
        {log?.status === 'skipped' && '→ Skipped today'}
        {log?.status === 'missed' && '○ Not completed'}
        {!log && '○ Not tracked yet'}
      </div>
    </div>
  );
}