"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { getPriorityColor, getPriorityLabel } from "@/lib/utils";
import { Clock, Edit, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: any;
}

export function TaskCard({
  task,
  onStatusChange,
  onDelete,
  dragHandleProps,
}: TaskCardProps) {
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
            <h3
              className={`font-medium ${
                task.status === 'done' ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {task.title}
            </h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add edit functionality later
                }}
              >
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
              {dragHandleProps && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 cursor-grab"
                  {...dragHandleProps}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <circle cx="9" cy="5" r="1"></circle>
                    <circle cx="9" cy="12" r="1"></circle>
                    <circle cx="9" cy="19" r="1"></circle>
                    <circle cx="15" cy="5" r="1"></circle>
                    <circle cx="15" cy="12" r="1"></circle>
                    <circle cx="15" cy="19" r="1"></circle>
                  </svg>
                </Button>
              )}
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {task.description}
            </p>
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
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}