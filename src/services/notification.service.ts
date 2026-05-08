import { orderBy, where } from 'firebase/firestore'
import { DatabaseService } from './database.service'
import { COLLECTIONS } from '../core/constants'
import type { NotificationModel } from '../models/notification.model'

export class NotificationService extends DatabaseService<NotificationModel> {
  constructor() {
    super(COLLECTIONS.NOTIFICATIONS)
  }

  getForUser(userId: string): Promise<NotificationModel[]> {
    return this.getWhere('userId', '==', userId, [
      where('isDeleted', '==', false),
      orderBy('createdAt', 'desc'),
    ])
  }

  getUnreadCount(userId: string): Promise<number> {
    return this.getAll([
      where('userId', '==', userId),
      where('isRead', '==', false),
      where('isDeleted', '==', false),
    ]).then(items => items.length)
  }

  markAsRead(id: string): Promise<void> {
    return this.update(id, { isRead: true })
  }

  markAllAsRead(userId: string): Promise<void[]> {
    return this.getForUser(userId).then(items =>
      Promise.all(items.filter(n => !n.isRead).map(n => this.markAsRead(n.id))),
    )
  }

  softDelete(id: string): Promise<void> {
    return this.update(id, { isDeleted: true })
  }

  subscribeToUser(userId: string, onData: (notifications: NotificationModel[]) => void) {
    return this.subscribeToQuery(
      [
        where('userId', '==', userId),
        where('isDeleted', '==', false),
        orderBy('createdAt', 'desc'),
      ],
      onData,
    )
  }
}

export const notificationService = new NotificationService()
