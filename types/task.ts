export const TASK_STATUSES = ["todo", "inProgress", "done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type AppState = {
  tasks: Task[];
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  inProgress: "In Progress",
  done: "Done",
};
