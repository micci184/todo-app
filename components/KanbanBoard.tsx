"use client";

import { useMemo, useState } from "react";
import { KanbanColumn } from "@/components/KanbanColumn";
import { TaskForm } from "@/components/TaskForm";
import { createTask } from "@/lib/task";
import {
  TASK_STATUS_LABELS,
  TASK_STATUSES,
  type Task,
  type TaskStatus,
} from "@/types/task";

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const tasksByStatus = useMemo(() => {
    return TASK_STATUSES.reduce<Record<TaskStatus, Task[]>>(
      (groupedTasks, status) => {
        groupedTasks[status] = tasks.filter((task) => task.status === status);
        return groupedTasks;
      },
      {
        todo: [],
        inProgress: [],
        done: [],
      },
    );
  }, [tasks]);

  return (
    <div className="grid gap-6">
      <TaskForm
        onCreateTask={(input) => {
          setTasks((currentTasks) => [
            createTask({
              title: input.title,
              description: input.description,
            }),
            ...currentTasks,
          ]);
        }}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            title={TASK_STATUS_LABELS[status]}
            status={status}
            tasks={tasksByStatus[status]}
          />
        ))}
      </div>
    </div>
  );
}
