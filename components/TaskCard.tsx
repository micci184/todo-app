import type { Task } from "@/types/task";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h3 className="text-sm font-semibold leading-6 text-slate-950 dark:text-slate-50">
        {task.title}
      </h3>
      {task.description ? (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
          {task.description}
        </p>
      ) : (
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
          詳細は未入力です。
        </p>
      )}
    </article>
  );
}
