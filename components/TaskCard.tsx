"use client";

import { useState, type DragEvent } from "react";
import type { Task } from "@/types/task";

type TaskCardProps = {
  task: Task;
  isDragging: boolean;
  onUpdate: (
    taskId: string,
    input: Pick<Task, "title" | "description">,
  ) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
};

export function TaskCard({
  task,
  isDragging,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const trimmedTitle = title.trim();

  const resetForm = () => {
    setTitle(task.title);
    setDescription(task.description);
  };

  if (isEditing) {
    return (
      <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();

            if (!trimmedTitle) {
              return;
            }

            onUpdate(task.id, {
              title: trimmedTitle,
              description,
            });
            setIsEditing(false);
          }}
        >
          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              タイトル
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-400 dark:focus:ring-slate-800"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              詳細
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-400 dark:focus:ring-slate-800"
            />
          </label>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsEditing(false);
              }}
              className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!trimmedTitle}
              className="inline-flex h-9 items-center justify-center rounded-md bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
            >
              保存
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article
      draggable
      aria-label={`${task.title} のタスクカード`}
      className={`group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-800 dark:bg-slate-950 ${
        isDragging
          ? "cursor-grabbing opacity-50 ring-2 ring-slate-300 dark:ring-slate-700"
          : "cursor-grab hover:-translate-y-0.5 hover:shadow-md"
      }`}
      onDragStart={(event: DragEvent<HTMLElement>) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", task.id);
        onDragStart(task.id);
      }}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-6 text-slate-950 dark:text-slate-50">
          {task.title}
        </h3>
      </div>
      {task.description ? (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
          {task.description}
        </p>
      ) : (
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
          詳細は未入力です。
        </p>
      )}
      <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
        {isConfirmingDelete ? (
          <div
            role="group"
            aria-label={`${task.title} の削除確認`}
            className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/70 dark:bg-red-950/30"
          >
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              このタスクを削除しますか？
            </p>
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="inline-flex h-8 items-center justify-center rounded-md border border-red-200 bg-white px-3 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-900/70 dark:bg-slate-950 dark:text-red-300 dark:hover:bg-red-950/50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="inline-flex h-8 items-center justify-center rounded-md bg-red-700 px-3 text-xs font-semibold text-white transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 dark:bg-red-500 dark:text-white dark:hover:bg-red-400"
              >
                削除する
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2 opacity-80 transition group-hover:opacity-100 group-focus-within:opacity-100">
            <button
              type="button"
              onClick={() => {
                setIsConfirmingDelete(false);
                resetForm();
                setIsEditing(true);
              }}
              className="inline-flex h-8 items-center justify-center rounded-md px-2.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            >
              編集
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="inline-flex h-8 items-center justify-center rounded-md px-2.5 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
              aria-label={`${task.title} を削除`}
            >
              削除
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
