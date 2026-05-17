"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { KanbanColumn } from "@/components/KanbanColumn";
import { createTask } from "@/lib/task";
import { loadAppState, saveAppState } from "@/lib/storage";
import {
  TASK_STATUS_LABELS,
  TASK_STATUSES,
  type Task,
  type TaskStatus,
} from "@/types/task";

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<TaskStatus | null>(
    null,
  );
  const hasLoadedStoredState = useRef(false);

  const updateTask = (
    taskId: string,
    input: Pick<Task, "title" | "description">,
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: input.title.trim(),
              description: input.description.trim(),
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  };

  const changeTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId && task.status !== status
          ? {
              ...task,
              status,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  };

  const finishDragging = () => {
    setDraggingTaskId(null);
    setDropTargetStatus(null);
  };

  const createNewTask = (input: { title: string; description: string }) => {
    setTasks((currentTasks) => [
      createTask({
        title: input.title,
        description: input.description,
      }),
      ...currentTasks,
    ]);
  };

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const storedState = loadAppState();
      hasLoadedStoredState.current = true;
      setTasks(storedState.tasks);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredState.current) {
      return;
    }

    saveAppState({ tasks });
  }, [tasks]);

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
    <div className="grid gap-5 sm:gap-6">
      <div className="grid min-w-0 gap-4 lg:grid-cols-3 xl:gap-5">
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            title={TASK_STATUS_LABELS[status]}
            status={status}
            tasks={tasksByStatus[status]}
            draggingTaskId={draggingTaskId}
            isDropTarget={dropTargetStatus === status}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onDragStartTask={setDraggingTaskId}
            onDragEnterColumn={setDropTargetStatus}
            onDragEndTask={finishDragging}
            onCreateTask={status === "todo" ? createNewTask : undefined}
            onDropTask={(targetStatus) => {
              if (draggingTaskId) {
                changeTaskStatus(draggingTaskId, targetStatus);
              }

              finishDragging();
            }}
          />
        ))}
      </div>
    </div>
  );
}
