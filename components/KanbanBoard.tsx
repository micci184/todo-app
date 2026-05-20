"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [hasLoadedStoredState, setHasLoadedStoredState] = useState(false);

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

  const finishDragging = () => {
    setDraggingTaskId(null);
    setDropTargetStatus(null);
  };

  const moveTask = (
    taskId: string,
    targetStatus: TaskStatus,
    targetTaskId?: string,
  ) => {
    setTasks((currentTasks) => {
      const draggedTask = currentTasks.find((task) => task.id === taskId);

      if (!draggedTask || targetTaskId === taskId) {
        return currentTasks;
      }

      const shouldUpdateStatus = draggedTask.status !== targetStatus;
      const movedTask = shouldUpdateStatus
        ? {
            ...draggedTask,
            status: targetStatus,
            updatedAt: new Date().toISOString(),
          }
        : draggedTask;
      const tasksWithoutDragged = currentTasks.filter(
        (task) => task.id !== taskId,
      );

      if (targetTaskId && targetTaskId !== taskId) {
        const targetTaskIndex = tasksWithoutDragged.findIndex(
          (task) => task.id === targetTaskId,
        );

        if (targetTaskIndex >= 0) {
          const reorderedTasks = [...tasksWithoutDragged];
          reorderedTasks.splice(targetTaskIndex, 0, movedTask);
          return reorderedTasks;
        }
      }

      return [...tasksWithoutDragged, movedTask];
    });
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
      setTasks(storedState.tasks);
      setHasLoadedStoredState(true);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredState) {
      return;
    }

    saveAppState({ tasks });
  }, [hasLoadedStoredState, tasks]);

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

  if (!hasLoadedStoredState) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
        タスクを読み込んでいます。
      </div>
    );
  }

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
            onDropTask={(targetStatus, targetTaskId) => {
              if (draggingTaskId) {
                moveTask(draggingTaskId, targetStatus, targetTaskId);
              }

              finishDragging();
            }}
          />
        ))}
      </div>
    </div>
  );
}
