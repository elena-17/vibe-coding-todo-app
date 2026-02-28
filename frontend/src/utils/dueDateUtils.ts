/**
 * Utility functions for due date status calculation and formatting
 */

export type DueDateStatus =
  | "overdue"
  | "due-soon"
  | "due-warning"
  | "on-track"
  | null;

/**
 * Calculate the urgency status of a due date relative to the current time.
 * - "overdue": due_date < now
 * - "due-soon": due_date <= now + 24h (orange)
 * - "due-warning": due_date <= now + 3 days (yellow)
 * - "on-track": due_date > now + 3 days (green)
 * - null: no due date provided
 */
export function getDueDateStatus(
  dueDate: string | null | undefined,
): DueDateStatus {
  if (!dueDate) return null;

  const now = new Date();
  const due = new Date(dueDate);

  if (isNaN(due.getTime())) return null;

  if (due < now) return "overdue";

  const msLeft = due.getTime() - now.getTime();
  const hoursLeft = msLeft / (1000 * 60 * 60);

  if (hoursLeft <= 24) return "due-soon";
  if (hoursLeft <= 72) return "due-warning";
  return "on-track";
}

/**
 * Get the Tailwind CSS color class for a given due date status.
 */
export function getDueDateColorClass(status: DueDateStatus): string {
  switch (status) {
    case "overdue":
      return "text-red-600";
    case "due-soon":
      return "text-orange-500";
    case "due-warning":
      return "text-yellow-500";
    case "on-track":
      return "text-green-600";
    default:
      return "text-slate-500";
  }
}

/**
 * Format a due date ISO string into a user-friendly locale string.
 */
export function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);
  if (isNaN(date.getTime())) return dueDate;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
