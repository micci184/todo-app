"use client";

import { useEffect, useId, useState } from "react";
import { TASK_STATUS_LABELS, type Task } from "@/types/task";

type CardDetailModalProps = {
  task: Task;
  onClose: () => void;
  onUpdateTask: (
    taskId: string,
    input: Pick<Task, "title" | "description">,
  ) => void;
};

export function CardDetailModal({
  task,
  onClose,
  onUpdateTask,
}: CardDetailModalProps) {
  const titleInputId = useId();
  const descriptionInputId = useId();
  const modalTitleId = useId();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const trimmedTitle = title.trim();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const saveTask = () => {
    if (!trimmedTitle) {
      return;
    }

    onUpdateTask(task.id, {
      title: trimmedTitle,
      description,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:py-10"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby={modalTitleId}
        aria-modal="true"
        role="dialog"
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Card Detail
            </p>
            <h2
              id={modalTitleId}
              className="mt-1 break-words text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50"
            >
              {task.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            閉じる
          </button>
        </div>

        <dl className="mt-5 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/70 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ステータス
            </dt>
            <dd className="mt-1 font-medium text-slate-800 dark:text-slate-100">
              {TASK_STATUS_LABELS[task.status]}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              作成日
            </dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-200">
              {formatDateTime(task.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
              更新日
            </dt>
            <dd className="mt-1 text-slate-700 dark:text-slate-200">
              {formatDateTime(task.updatedAt)}
            </dd>
          </div>
        </dl>

        <form
          className="mt-5 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            saveTask();
          }}
        >
          <label className="grid gap-2" htmlFor={titleInputId}>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              タイトル
            </span>
            <input
              id={titleInputId}
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-400 dark:focus:ring-slate-800 sm:h-10 sm:text-sm"
            />
          </label>

          <label className="grid gap-2" htmlFor={descriptionInputId}>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              詳細
            </span>
            <textarea
              id={descriptionInputId}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={5}
              placeholder="詳細は未入力です。"
              className="resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-400 dark:focus:ring-slate-800 sm:text-sm"
            />
          </label>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex-none"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!trimmedTitle}
              className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-slate-950 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:disabled:bg-slate-700 dark:disabled:text-slate-400 sm:flex-none"
            >
              保存
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "不明";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
