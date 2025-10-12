"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  Filter,
  Search,
  TrendingUp,
  CheckCircle2,
  CalendarDays,
  Circle,
  Flame,
  Zap,
  Timer,
  Leaf
} from "lucide-react";
import { ActivityLog, ActivityAction } from "@/lib/types";
import ProtectedLayout from "../protected-layout";
import { useOrigoData } from "@/lib/hooks/use-origo-data";
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import NotificationProvider from "@/components/notification-provider";

export default function ActivityPage() {
  return (
    <ProtectedLayout>
      <NotificationProvider />
      <ProtectedActivityContent />
    </ProtectedLayout>
  );
}

function ProtectedActivityContent() {
  const { activityLogs, loading, error, loadData } = useOrigoData();
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "task" | "habit" | "event">("all");
  const [filterAction, setFilterAction] = useState<ActivityAction | "all">("all");
  const [filterDate, setFilterDate] = useState<"all" | "today" | "yesterday" | "week" | "month">("all");

  // Apply filters to activity logs
  useEffect(() => {
    let result = [...activityLogs];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(log => 
        log.metadata.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.metadata.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      result = result.filter(log => log.entity_type === filterType);
    }

    // Apply action filter
    if (filterAction !== "all") {
      result = result.filter(log => log.action === filterAction);
    }

    // Apply date filter
    if (filterDate !== "all") {
      const now = new Date();
      result = result.filter(log => {
        const logDate = parseISO(log.created_at);
        switch (filterDate) {
          case "today":
            return isToday(logDate);
          case "yesterday":
            return isYesterday(logDate);
          case "week":
            return isThisWeek(logDate);
          case "month":
            return isThisMonth(logDate);
          default:
            return true;
        }
      });
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setFilteredLogs(result);
  }, [activityLogs, searchTerm, filterType, filterAction, filterDate]);

  // Get activity icon based on entity type and action
  const getActivityIcon = (entityType: string, action: ActivityAction) => {
    switch (entityType) {
      case "task":
        if (action === "complete") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        if (action === "create") return <Circle className="w-4 h-4 text-blue-500" />;
        return <Circle className="w-4 h-4 text-gray-500" />;
      case "habit":
        if (action === "check") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
        if (action === "skip") return <Timer className="w-4 h-4 text-yellow-500" />;
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case "event":
        return <CalendarDays className="w-4 h-4 text-blue-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get activity color based on action
  const getActivityColor = (action: ActivityAction) => {
    switch (action) {
      case "create":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "update":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "complete":
        return "bg-green-100 text-green-800 border-green-200";
      case "delete":
        return "bg-red-100 text-red-800 border-red-200";
      case "check":
        return "bg-green-100 text-green-800 border-green-200";
      case "skip":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format action text
  const formatActionText = (action: ActivityAction, entityType: string) => {
    switch (action) {
      case "create":
        return `Created ${entityType}`;
      case "update":
        return `Updated ${entityType}`;
      case "delete":
        return `Deleted ${entityType}`;
      case "complete":
        return `Completed ${entityType}`;
      case "incomplete":
        return `Marked ${entityType} as incomplete`;
      case "check":
        return `Checked ${entityType}`;
      case "uncheck":
        return `Un-checked ${entityType}`;
      case "skip":
        return `Skipped ${entityType}`;
      default:
        return `${action} ${entityType}`;
    }
  };

  // Format entity name
  const formatEntityName = (log: ActivityLog) => {
    if (log.metadata.title) return log.metadata.title;
    if (log.metadata.name) return log.metadata.name;
    return `${log.entity_type} #${log.entity_id.substring(0, 8)}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground">Track all your actions and changes</p>
        </div>
        <Button onClick={loadData} variant="outline">
          <Clock className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          <CardDescription>Filter your activity by type, action, or date</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Select value={filterType} onValueChange={(value: "all" | "task" | "habit" | "event") => setFilterType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
                <SelectItem value="habit">Habits</SelectItem>
                <SelectItem value="event">Events</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterAction} onValueChange={(value: ActivityAction | "all") => setFilterAction(value as ActivityAction | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Created</SelectItem>
                <SelectItem value="update">Updated</SelectItem>
                <SelectItem value="complete">Completed</SelectItem>
                <SelectItem value="delete">Deleted</SelectItem>
                <SelectItem value="check">Checked</SelectItem>
                <SelectItem value="skip">Skipped</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterDate} onValueChange={(value: "all" | "today" | "yesterday" | "week" | "month") => setFilterDate(value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <TrendingUp className="w-5 h-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityLogs.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <Flame className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityLogs.filter(log => log.entity_type === "task").length}</div>
            <p className="text-xs text-muted-foreground">Task activities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Habits</CardTitle>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityLogs.filter(log => log.entity_type === "habit").length}</div>
            <p className="text-xs text-muted-foreground">Habit activities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <CalendarIcon className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activityLogs.filter(log => log.entity_type === "event").length}</div>
            <p className="text-xs text-muted-foreground">Event activities</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            {filteredLogs.length} {filteredLogs.length === 1 ? "activity" : "activities"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mt-4 font-medium">No activities found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your activities will appear here as you interact with tasks, habits, and events
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="mt-0.5">
                    {getActivityIcon(log.entity_type, log.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">
                        {formatEntityName(log)}
                      </h3>
                      <Badge className={getActivityColor(log.action)}>
                        {formatActionText(log.action, log.entity_type)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(parseISO(log.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {log.entity_type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}