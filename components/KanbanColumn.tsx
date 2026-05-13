import { TaskCard } from "@/components/TaskCard";
import type { Task, TaskStatus } from "@/types/task";

type KanbanColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
};

export function KanbanColumn({ title, tasks }: KanbanColumnProps) {
  return (
    <section className="flex min-h-80 flex-col rounded-xl border border-slate-200 bg-slate-100/70 p-3 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-950 dark:text-slate-300">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/70 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
            タスクはありません。
          </div>
        )}
      </div>
    </section>
  );
}
