import { NotificationPriority } from '../core/enums'

/**
 * Priority weight — mirrors Dart's NotificationPriority extension.
 * Higher weight = shown first in sorted lists.
 */
export const PRIORITY_WEIGHT: Record<NotificationPriority, number> = {
  [NotificationPriority.Critical]: 4,
  [NotificationPriority.High]:     3,
  [NotificationPriority.Normal]:   2,
  [NotificationPriority.Low]:      1,
}

export function getPriorityWeight(priority: NotificationPriority): number {
  return PRIORITY_WEIGHT[priority]
}

/** Sort notifications: highest priority first, then newest first */
export function sortNotifications<T extends { priority: NotificationPriority; createdAt: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const weightDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
    if (weightDiff !== 0) return weightDiff
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

/** CSS color for a given priority — used in notification badge/dot */
export const PRIORITY_COLOR: Record<NotificationPriority, string> = {
  [NotificationPriority.Critical]: '#EF4444',
  [NotificationPriority.High]:     '#F59E0B',
  [NotificationPriority.Normal]:   '#3B82F6',
  [NotificationPriority.Low]:      '#9CA3AF',
}
