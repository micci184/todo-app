import type { Task, TaskStatus } from "@/types/task";

type CreateTaskInput = {
  title: string;
  description: string;
  status?: TaskStatus;
};

export function createTask({
  title,
  description,
  status = "todo",
}: CreateTaskInput): Task {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    description: description.trim(),
    status,
    createdAt: now,
    updatedAt: now,
  };
}
