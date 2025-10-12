"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  MoreHorizontal
} from "lucide-react";
import { Event } from "@/lib/types";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, addDays } from "date-fns";
import ProtectedLayout from "../protected-layout";

// Mock data for events
const mockEvents: Event[] = [
  { id: '1', user_id: 'user1', title: 'Team meeting', description: 'Weekly sync', location: 'Conference Room A', start_at: '2025-10-12T10:00:00Z', end_at: '2025-10-12T11:00:00Z', reminders: [15], created_at: '2025-10-10T08:00:00Z', updated_at: '2025-10-10T08:00:00Z' },
  { id: '2', user_id: 'user1', title: 'Doctor appointment', description: 'Annual checkup', location: 'City Hospital', start_at: '2025-10-13T14:00:00Z', end_at: '2025-10-13T15:00:00Z', reminders: [60], created_at: '2025-10-10T09:00:00Z', updated_at: '2025-10-10T09:00:00Z' },
  { id: '3', user_id: 'user1', title: 'Project deadline', description: 'Submit final project', location: 'Office', start_at: '2025-10-15T17:00:00Z', end_at: '2025-10-15T17:00:00Z', reminders: [1440, 60], created_at: '2025-10-10T10:00:00Z', updated_at: '2025-10-10T10:00:00Z' },
  { id: '4', user_id: 'user1', title: 'Lunch with Alex', description: 'Discuss new project', location: 'Downtown Cafe', start_at: '2025-10-16T12:30:00Z', end_at: '2025-10-16T13:30:00Z', reminders: [30], created_at: '2025-10-10T11:00:00Z', updated_at: '2025-10-10T11:00:00Z' },
];

export default function CalendarPage() {
  return (
    <ProtectedLayout>
      <ProtectedCalendarContent />
    </ProtectedLayout>
  );
}

function ProtectedCalendarContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<Event[]>(mockEvents);
  
  // Get the current month's events
  const currentMonthEvents = events.filter(event => 
    isSameMonth(new Date(event.start_at), currentDate)
  );

  // Navigation functions
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Render calendar days
  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <div className="flex items-center gap-1 border rounded-md">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="px-4 py-2 font-medium">
              {format(currentDate, dateFormat)}
            </div>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium py-2 text-muted-foreground">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-1">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        // Get events for this day
        const dayEvents = currentMonthEvents.filter(event => 
          isSameDay(new Date(event.start_at), cloneDay)
        );

        days.push(
          <div
            key={day.toString()}
            className={`min-h-24 p-2 border border-transparent border-t-gray-200 border-l-gray-200 ${
              !isSameMonth(cloneDay, monthStart) ? "bg-gray-100 text-gray-400" : ""
            } ${isSameDay(cloneDay, new Date()) ? "bg-blue-50" : ""}`}
          >
            <div className="flex justify-between">
              <span className={`text-sm ${isSameDay(cloneDay, new Date()) ? "font-bold text-blue-600" : ""}`}>
                {formattedDate}
              </span>
            </div>
            <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
              {dayEvents.slice(0, 2).map(event => (
                <div 
                  key={event.id} 
                  className="text-xs p-1 bg-blue-100 rounded truncate hover:bg-blue-200 cursor-pointer"
                >
                  {format(new Date(event.start_at), "HH:mm")} {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  // Get events for today
  const todayEvents = events.filter(event => 
    isSameDay(new Date(event.start_at), new Date())
  );

  return (
    <div className="p-6 space-y-6">
      {renderHeader()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {format(currentDate, "MMMM yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="calendar">
              {renderDays()}
              {renderCells()}
            </div>
          </CardContent>
        </Card>

        {/* Today's Events and Quick Actions */}
        <div className="space-y-6">
          {/* Today's Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Today&rsquo;s Events
              </CardTitle>
              <CardDescription>
                {format(new Date(), "EEEE, MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayEvents.length > 0 ? (
                  todayEvents.map(event => (
                    <div key={event.id} className="p-3 border rounded-lg hover:bg-accent">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(new Date(event.start_at), "HH:mm")} - {format(new Date(event.end_at), "HH:mm")}
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No events scheduled for today</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Add */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Add</CardTitle>
              <CardDescription>Schedule a new event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Event title" 
                  className="w-full p-2 border rounded-md"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="date" 
                    className="p-2 border rounded-md"
                  />
                  <input 
                    type="time" 
                    className="p-2 border rounded-md"
                  />
                </div>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}