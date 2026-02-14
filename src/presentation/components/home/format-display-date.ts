/**
 * Formats an ISO date for display (Today, Yesterday, or "Mon DD").
 */
export function formatDisplayDate(isoDate: string): string {
  const d = new Date(isoDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dDay = new Date(d);
  dDay.setHours(0, 0, 0, 0);
  if (dDay.getTime() === today.getTime()) return 'Today';
  if (dDay.getTime() === yesterday.getTime()) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
