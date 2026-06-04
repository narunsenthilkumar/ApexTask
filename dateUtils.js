// dateUtils.js
// Utility functions for deadline calculations using date-fns
import { parseISO, differenceInCalendarDays } from 'date-fns';

/**
 * Returns deadline status based on current date and task dueDate.
 * - 'overdue' if dueDate is in the past
 * - 'dueSoon' if due within 3 days
 * - 'upcoming' otherwise
 */
export function getDeadlineStatus(dueDate) {
  if (!dueDate) return 'upcoming';
  const today = new Date();
  const target = parseISO(dueDate);
  const diff = differenceInCalendarDays(target, today);
  if (diff < 0) return 'overdue';
  if (diff <= 3) return 'dueSoon';
  return 'upcoming';
}

/** Helper to format date for display */
export function formatDate(dueDate) {
  if (!dueDate) return '';
  const date = parseISO(dueDate);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
