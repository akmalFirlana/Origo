"use client";

import React from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Priority } from "@/lib/types";
import { TaskCard } from "./task-card";

interface TaskBoardProps {
  groupedTasks: Record<Priority, Task[]>;
  onTaskPriorityChange: (taskId: string, newPriority: Priority) => void;
  onTaskStatusChange: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

interface TaskItem {
  id: string;
  task: Task;
}

interface Column {
  id: Priority;
  title: string;
  description: string;
  color: string;
}

const columns: Column[] = [
  {
    id: "urgent_important",
    title: "🔥 Urgent & Important",
    description: "Do First",
    color: "red",
  },
  {
    id: "important",
    title: "⚡ Important",
    description: "Schedule",
    color: "blue",
  },
  {
    id: "urgent",
    title: "⏳ Urgent",
    description: "Delegate",
    color: "yellow",
  },
  {
    id: "optional",
    title: "🍃 Optional",
    description: "Eliminate",
    color: "green",
  },
];

export function TaskBoard({
  groupedTasks,
  onTaskPriorityChange,
  onTaskStatusChange,
  onTaskDelete,
}: TaskBoardProps) {
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [tasks, setTasks] = React.useState<Record<Priority, Task[]>>(groupedTasks);

  // Update local state when groupedTasks prop changes
  React.useEffect(() => {
    setTasks(groupedTasks);
  }, [groupedTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTaskItem = (task: Task): TaskItem => ({
    id: `task-${task.id}`,
    task,
  });

  const getTaskFromId = (id: string): Task | undefined => {
    for (const priority in tasks) {
      const task = tasks[priority as Priority].find(
        (t) => `task-${t.id}` === id
      );
      if (task) return task;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = getTaskFromId(active.id as string);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);

    if (over && active.id !== over.id) {
      const activeTask = getTaskFromId(active.id as string);
      const overId = over.id as Priority;

      if (activeTask && columns.some(col => col.id === overId)) {
        // Update the priority of the task
        onTaskPriorityChange(activeTask.id, overId);
      }
    }
  };

  const taskItems = Object.entries(tasks).flatMap(([priority, tasks]) =>
    tasks.map((task) => getTaskItem(task))
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`border p-4 rounded-lg ${
              column.color === "red"
                ? "border-red-500/50 bg-red-500/5"
                : column.color === "blue"
                ? "border-blue-500/50 bg-blue-500/5"
                : column.color === "yellow"
                ? "border-yellow-500/50 bg-yellow-500/5"
                : "border-green-500/50 bg-green-500/5"
            }`}
          >
            <div className="mb-3 pb-2 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {column.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {column.description}
              </p>
            </div>
            <div className="space-y-3">
              <SortableContext
                items={tasks[column.id as Priority].map((task) => getTaskItem(task).id)}
                strategy={verticalListSortingStrategy}
              >
                {tasks[column.id as Priority].map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    onStatusChange={onTaskStatusChange}
                    onDelete={onTaskDelete}
                  />
                ))}
              </SortableContext>
              {tasks[column.id as Priority].length === 0 && (
                <p className="text-center text-muted-foreground py-2">
                  No tasks in this category
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="p-3 border rounded-lg bg-background shadow-lg w-64">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={activeTask.status === "done"}
                onChange={() => onTaskStatusChange(activeTask.id)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-medium ${
                    activeTask.status === "done"
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {activeTask.title}
                </h3>
                {activeTask.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeTask.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function SortableTaskItem({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `task-${task.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="space-y-0">
      <TaskCard
        task={task}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
}