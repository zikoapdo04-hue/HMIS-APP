import type { Timestamp } from 'firebase/firestore'
import type { NotificationType, NotificationPriority } from '../core/enums'

/**
 * Firestore collection: `notifications`
 */
export interface NotificationModel {
  id:        string
  userId:    string              // recipient uid
  title:     string
  body:      string
  type:      NotificationType
  priority:  NotificationPriority
  createdAt: Timestamp
  isRead:    boolean
  isDeleted: boolean
  entityId:  string | null       // linked appointment/bill id
  route:     string | null       // screen to navigate to on tap
  payload:   Record<string, unknown> | null
  groupKey:  string | null       // for notification grouping
}

export type NotificationDTO = Omit<NotificationModel, 'createdAt'> & {
  createdAt: string
}
