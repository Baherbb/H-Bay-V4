import webpush from 'web-push';
import Notification from '../models/notification.model';
import { NotificationType } from '../models/notification.model';
import { Op } from 'sequelize';

class NotificationService {
    constructor() {
        webpush.setVapidDetails(
            'mailto:' + process.env.VAPID_EMAIL!,
            process.env.VAPID_PUBLIC_KEY!,
            process.env.VAPID_PRIVATE_KEY!
        );
    }

    async saveSubscription(userId: number, subscription: webpush.PushSubscription) {
        const existingSubscription = await Notification.findOne({
            where: {
                user_id: userId,
                subscription: {
                    endpoint: subscription.endpoint
                }
            }
        });

        if (existingSubscription) {
            await existingSubscription.update({
                subscription,
                updated_at: new Date()
            });
            return existingSubscription;
        }

        return await Notification.create({
            user_id: userId,
            title: 'Subscription Initialized',
            message: 'Push notifications enabled',
            type: 'PROMOTION',
            subscription,
            read: true
        });
    }

    async sendNotification(
        userId: number,
        title: string,
        message: string,
        type: NotificationType,
        data?: object
    ) {
        try {
            const subscriptions = await Notification.findAll({
                where: {
                    user_id: userId,
                    subscription: { [Op.ne]: null }
                },
                order: [['created_at', 'DESC']],
                limit: 1
            });

            if (subscriptions.length === 0) {
                throw new Error('No subscription found for user');
            }

            const notification = await Notification.create({
                user_id: userId,
                title,
                message,
                type,
                data,
                subscription: subscriptions[0].subscription,
                read: false
            });

            const payload = JSON.stringify({
                title,
                message,
                data
            });

            await webpush.sendNotification(
                subscriptions[0].subscription as webpush.PushSubscription,
                payload
            );

            return notification;
        } catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }

    async markAsRead(notificationId: number, userId: number) {
        return await Notification.update(
            { read: true },
            {
                where: {
                    id: notificationId,
                    user_id: userId
                }
            }
        );
    }

    async getUserNotifications(userId: number, limit = 10, offset = 0) {
        return await Notification.findAndCountAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            limit,
            offset
        });
    }
}

export default new NotificationService();