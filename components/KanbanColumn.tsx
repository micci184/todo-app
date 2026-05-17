"use client";

import { useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import type { Task, TaskStatus } from "@/types/task";

type KanbanColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  draggingTaskId: string | null;
  isDropTarget: boolean;
  onUpdateTask: (
    taskId: string,
    input: Pick<Task, "title" | "description">,
  ) => void;
  onDeleteTask: (taskId: string) => void;
  onDragStartTask: (taskId: string) => void;
  onDragEnterColumn: (status: TaskStatus) => void;
  onDragEndTask: () => void;
  onCreateTask?: (input: { title: string; description: string }) => void;
  onDropTask: (status: TaskStatus) => void;
};

export function KanbanColumn({
  title,
  status,
  tasks,
  draggingTaskId,
  isDropTarget,
  onUpdateTask,
  onDeleteTask,
  onDragStartTask,
  onDragEnterColumn,
  onDragEndTask,
  onCreateTask,
  onDropTask,
}: KanbanColumnProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const trimmedTitle = newTaskTitle.trim();

  const createTaskFromTitle = () => {
    if (!onCreateTask || !trimmedTitle) {
      return;
    }

    onCreateTask({
      title: trimmedTitle,
      description: "",
    });
    setNewTaskTitle("");
  };

  return (
    <section
      aria-label={`${title} column`}
      className={`flex min-h-64 min-w-0 flex-col rounded-xl border p-3 transition sm:min-h-80 ${
        isDropTarget
          ? "border-slate-500 bg-slate-200/80 ring-2 ring-slate-300 dark:border-slate-400 dark:bg-slate-800/80 dark:ring-slate-700"
          : "border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900/70"
      }`}
      onDragEnter={() => onDragEnterColumn(status)}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDropTask(status);
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <h2 className="min-w-0 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-950 dark:text-slate-300">
          {tasks.length}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDragging={draggingTaskId === task.id}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onDragStart={onDragStartTask}
              onDragEnd={onDragEndTask}
            />
          ))
        ) : (
          <div className="flex min-h-28 flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/70 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400 sm:p-6">
            タスクはありません。
          </div>
        )}
        {onCreateTask ? (
          <form
            className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-950/50"
            onSubmit={(event) => {
              event.preventDefault();
              createTaskFromTitle();
            }}
          >
            <label className="sr-only" htmlFor="new-task-title">
              新しいタスクのタイトル
            </label>
            <textarea
              id="new-task-title"
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  createTaskFromTitle();
                }
              }}
              rows={2}
              placeholder="+ カードのタイトルを入力"
              className="w-full resize-none rounded-md border border-transparent bg-transparent px-2 py-2 text-base text-slate-950 outline-none transition placeholder:text-slate-500 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-200 dark:text-slate-50 dark:placeholder:text-slate-400 dark:focus:border-slate-700 dark:focus:bg-slate-900 dark:focus:ring-slate-800 sm:text-sm"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={createTaskFromTitle}
                disabled={!trimmedTitle}
                className="inline-flex h-9 items-center justify-center rounded-md bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
              >
                追加
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
