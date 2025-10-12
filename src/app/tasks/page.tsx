"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Clock,
  Flame,
  Zap,
  Timer,
  Leaf,
  Edit,
  Trash2
} from "lucide-react";
import { Task, Priority } from "@/lib/types";
import { getPriorityColor, getPriorityLabel } from "@/lib/utils";
import ProtectedLayout from "../protected-layout";
import { useOrigoData } from "@/lib/hooks/use-origo-data";

export default function TasksPage() {
  return (
    <ProtectedLayout>
      <ProtectedTasksContent />
    </ProtectedLayout>
  );
}

function ProtectedTasksContent() {
  const { tasks, loading, error, updateTask, removeTask } = useOrigoData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "todo" | "in_progress" | "done">("all");
  
  // Group tasks by priority for the Eisenhower matrix
  const groupedTasks = {
    'urgent_important': tasks.filter(t => t.priority === 'urgent_important'),
    'important': tasks.filter(t => t.priority === 'important'),
    'urgent': tasks.filter(t => t.priority === 'urgent'),
    'optional': tasks.filter(t => t.priority === 'optional'),
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Function to handle task status change
  const handleTaskStatusChange = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      await updateTask(taskId, { 
        status: task.status === 'done' ? 'todo' : 'done',
        completed_at: task.status === 'done' ? undefined : new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks with Eisenhower priority matrix</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value as Priority | "all")}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Priorities</option>
            <option value="urgent_important">🔥 Urgent & Important</option>
            <option value="important">⚡ Important</option>
            <option value="urgent">⏳ Urgent</option>
            <option value="optional">🍃 Optional</option>
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as "all" | "todo" | "in_progress" | "done")}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Eisenhower Matrix - 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Urgent & Important */}
        <Card className="border-red-500/50">
          <CardHeader className="bg-red-500/10 pb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-500" />
              <CardTitle className="text-lg">🔥 Urgent & Important</CardTitle>
            </div>
            <CardDescription>Do First</CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-3">
              {groupedTasks['urgent_important'].map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={handleTaskStatusChange} onDelete={removeTask} />
              ))}
              {groupedTasks['urgent_important'].length === 0 && (
                <p className="text-center text-muted-foreground py-2">No urgent & important tasks</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Important but not Urgent */}
        <Card className="border-blue-500/50">
          <CardHeader className="bg-blue-500/10 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">⚡ Important</CardTitle>
            </div>
            <CardDescription>Schedule</CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-3">
              {groupedTasks['important'].map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={handleTaskStatusChange} onDelete={removeTask} />
              ))}
              {groupedTasks['important'].length === 0 && (
                <p className="text-center text-muted-foreground py-2">No important but not urgent tasks</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Urgent but not Important */}
        <Card className="border-yellow-500/50">
          <CardHeader className="bg-yellow-500/10 pb-3">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-lg">⏳ Urgent</CardTitle>
            </div>
            <CardDescription>Delegate</CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-3">
              {groupedTasks['urgent'].map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={handleTaskStatusChange} onDelete={removeTask} />
              ))}
              {groupedTasks['urgent'].length === 0 && (
                <p className="text-center text-muted-foreground py-2">No urgent but not important tasks</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Not Urgent & Not Important */}
        <Card className="border-green-500/50">
          <CardHeader className="bg-green-500/10 pb-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-500" />
              <CardTitle className="text-lg">🍃 Optional</CardTitle>
            </div>
            <CardDescription>Eliminate</CardDescription>
          </CardHeader>
          <CardContent className="pt-3">
            <div className="space-y-3">
              {groupedTasks['optional'].map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={handleTaskStatusChange} onDelete={removeTask} />
              ))}
              {groupedTasks['optional'].length === 0 && (
                <p className="text-center text-muted-foreground py-2">No optional tasks</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Tasks List (when filters are applied) */}
      {(searchTerm || filterPriority !== "all" || filterStatus !== "all") && (
        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>
              Showing {filteredTasks.length} of {tasks.length} tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={handleTaskStatusChange} onDelete={removeTask} />
              ))}
              {filteredTasks.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No tasks match your filters</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Task Card Component
function TaskCard({ task, onStatusChange, onDelete }: { task: Task, onStatusChange: (id: string) => void, onDelete: (id: string) => void }) {
  return (
    <div className="p-3 border rounded-lg hover:bg-accent group">
      <div className="flex items-start gap-3">
        <input 
          type="checkbox" 
          checked={task.status === 'done'}
          onChange={() => onStatusChange(task.id)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className={`font-medium ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={getPriorityColor(task.priority)} variant="secondary">
              {getPriorityLabel(task.priority)}
            </Badge>
            
            {task.due_date && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(task.due_date).toLocaleDateString()}
              </Badge>
            )}
            
            {task.tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}