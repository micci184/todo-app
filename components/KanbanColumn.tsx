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
  onDropTask,
}: KanbanColumnProps) {
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
      </div>
    </section>
  );
}
