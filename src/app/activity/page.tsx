"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity as ActivityIcon, 
  Calendar, 
  CheckSquare, 
  CalendarDays, 
  Filter,
  Search
} from "lucide-react";
import { ActivityLog, ActivityAction } from "@/lib/types";
import { format } from "date-fns";
import ProtectedLayout from "../protected-layout";
import { SignedIn } from "@clerk/nextjs";

// Mock data for activity logs
const mockActivityLogs: ActivityLog[] = [
  { id: '1', user_id: 'user1', entity_type: 'task', entity_id: 'task1', action: 'create', metadata: { title: 'Complete project proposal' }, created_at: '2025-10-12T08:00:00Z' },
  { id: '2', user_id: 'user1', entity_type: 'task', entity_id: 'task1', action: 'update', metadata: { title: 'Complete project proposal', status: 'in_progress' }, created_at: '2025-10-12T09:00:00Z' },
  { id: '3', user_id: 'user1', entity_type: 'habit', entity_id: 'habit1', action: 'check', metadata: { name: 'Morning meditation' }, created_at: '2025-10-12T10:00:00Z' },
  { id: '4', user_id: 'user1', entity_type: 'event', entity_id: 'event1', action: 'create', metadata: { title: 'Team meeting' }, created_at: '2025-10-12T11:00:00Z' },
  { id: '5', user_id: 'user1', entity_type: 'task', entity_id: 'task2', action: 'complete', metadata: { title: 'Buy groceries' }, created_at: '2025-10-12T12:00:00Z' },
  { id: '6', user_id: 'user1', entity_type: 'habit', entity_id: 'habit2', action: 'check', metadata: { name: 'Exercise' }, created_at: '2025-10-12T13:00:00Z' },
  { id: '7', user_id: 'user1', entity_type: 'event', entity_id: 'event2', action: 'update', metadata: { title: 'Doctor appointment', start_at: '2025-10-13T14:00:00Z' }, created_at: '2025-10-12T14:00:00Z' },
  { id: '8', user_id: 'user1', entity_type: 'task', entity_id: 'task3', action: 'create', metadata: { title: 'Schedule team meeting' }, created_at: '2025-10-12T15:00:00Z' },
];

export default function ActivityPage() {
  return (
    <ProtectedLayout>
      <ProtectedActivityContent />
    </ProtectedLayout>
  );
}

function ProtectedActivityContent() {
  const [activityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [filterType, setFilterType] = useState<'all' | 'task' | 'habit' | 'event'>('all');
  const [filterAction, setFilterAction] = useState<ActivityAction | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter activity logs based on filters
  const filteredLogs = activityLogs.filter(log => {
    const matchesType = filterType === 'all' || log.entity_type === filterType;
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesSearch = searchTerm === "" || 
      log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.metadata).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesAction && matchesSearch;
  });

  // Group logs by date
  const groupedLogs: Record<string, ActivityLog[]> = {};
  filteredLogs.forEach(log => {
    const date = log.created_at.split('T')[0]; // Get date part only
    if (!groupedLogs[date]) {
      groupedLogs[date] = [];
    }
    groupedLogs[date].push(log);
  });

  const getActionText = (action: ActivityAction, entityType: string, metadata: any) => {
    switch (action) {
      case 'create':
        return `Created a new ${entityType}`;
      case 'update':
        return `Updated the ${entityType}`;
      case 'delete':
        return `Deleted a ${entityType}`;
      case 'complete':
        return `Completed a ${entityType}`;
      case 'incomplete':
        return `Marked ${entityType} as incomplete`;
      case 'check':
        return `Checked off: ${metadata.name || metadata.title || entityType}`;
      case 'uncheck':
        return `Unchecked: ${metadata.name || metadata.title || entityType}`;
      case 'skip':
        return `Skipped: ${metadata.name || metadata.title || entityType}`;
      default:
        return `${action} ${entityType}`;
    }
  };

  const getActionColor = (action: ActivityAction) => {
    switch (action) {
      case 'create':
        return 'bg-blue-500';
      case 'update':
        return 'bg-yellow-500';
      case 'delete':
        return 'bg-red-500';
      case 'complete':
      case 'check':
        return 'bg-green-500';
      case 'incomplete':
      case 'uncheck':
      case 'skip':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getEntityTypeIcon = (entityType: string) => {
    switch (entityType) {
      case 'task':
        return <CheckSquare className="w-4 h-4" />;
      case 'habit':
        return <CalendarDays className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      default:
        return <ActivityIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Activity</h1>
          <p className="text-muted-foreground">Track your productivity history and changes</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 p-2 border rounded-md"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as 'all' | 'task' | 'habit' | 'event')}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Types</option>
                <option value="task">Tasks</option>
                <option value="habit">Habits</option>
                <option value="event">Events</option>
              </select>
              
              <select 
                value={filterAction} 
                onChange={(e) => setFilterAction(e.target.value as ActivityAction | 'all')}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Actions</option>
                <option value="create">Created</option>
                <option value="update">Updated</option>
                <option value="delete">Deleted</option>
                <option value="complete">Completed</option>
                <option value="check">Checked</option>
                <option value="skip">Skipped</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="w-5 h-5" />
            Activity Timeline
          </CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.entries(groupedLogs).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedLogs).map(([date, logs]) => (
                <div key={date}>
                  <h3 className="text-lg font-semibold mb-4">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  
                  <div className="space-y-4">
                    {logs.map(log => (
                      <div key={log.id} className="flex gap-4">
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${getActionColor(log.action)}`}></div>
                        
                        <div className="flex-1 pb-4 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="p-1 rounded-full bg-gray-100">
                              {getEntityTypeIcon(log.entity_type)}
                            </div>
                            <span className="font-medium">
                              {format(new Date(log.created_at), 'h:mm a')}
                            </span>
                          </div>
                          
                          <p className="text-foreground">
                            {getActionText(log.action, log.entity_type, log.metadata)}
                          </p>
                          
                          {log.metadata.title && log.entity_type !== 'habit' && (
                            <p className="text-sm text-muted-foreground mt-1 ml-7">
                              "{log.metadata.title}"
                            </p>
                          )}
                          
                          {log.metadata.name && log.entity_type === 'habit' && (
                            <p className="text-sm text-muted-foreground mt-1 ml-7">
                              "{log.metadata.name}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ActivityIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium mb-1">No activities found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more activities</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}