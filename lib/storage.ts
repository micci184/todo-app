import { TASK_STATUSES, type AppState, type Task } from "@/types/task";

export const STORAGE_KEY = "todo-app:kanban-state:v1";

export const DEFAULT_APP_STATE: AppState = {
  tasks: [],
};

export function loadAppState(): AppState {
  if (!canUseLocalStorage()) {
    return DEFAULT_APP_STATE;
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);

    if (!rawState) {
      return DEFAULT_APP_STATE;
    }

    const parsedState: unknown = JSON.parse(rawState);

    if (!isAppState(parsedState)) {
      return DEFAULT_APP_STATE;
    }

    return parsedState;
  } catch (error) {
    console.warn("Failed to load app state from localStorage.", error);
    return DEFAULT_APP_STATE;
  }
}

export function saveAppState(state: AppState): boolean {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.warn("Failed to save app state to localStorage.", error);
    return false;
  }
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function isAppState(value: unknown): value is AppState {
  if (!isRecord(value)) {
    return false;
  }

  return Array.isArray(value.tasks) && value.tasks.every(isTask);
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    isTaskStatus(value.status) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isTaskStatus(value: unknown) {
  return (
    typeof value === "string" &&
    (TASK_STATUSES as readonly string[]).includes(value)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
