import { Request, Response } from 'express';
import notificationService from '../services/notification.service';
import User from '../models/user.model';

class NotificationController {
    async subscribe(req: Request, res: Response): Promise<void> {
        try {
            const subscription = req.body;
            const user = req.user as User;
            const userId = user.id;

            await notificationService.saveSubscription(userId, subscription);
            
            res.status(201).json({ message: 'Successfully subscribed to push notifications' });
        } catch (error) {
            console.error('Subscription error:', error);
            res.status(500).json({ error: 'Subscription failed' });
        }
    }
    async testNotification(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user as User;
            if (!user || !user.id) {
                res.status(401).json({ 
                    success: false, 
                    error: 'User not authenticated' 
                });
                return;
            }
            const userId = user.id;
            await notificationService.sendNotification(
                userId,
                'Test Notification',
                'If you see this, your notification system is working!',
                'PROMOTION',
                { testData: 'This is a test notification' }
            );
            
            res.json({ success: true, message: 'Test notification sent successfully' });
        } catch (error) {
            console.error('Error sending test notification:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to send test notification' 
            });
        }
    }

    async getNotifications(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user as User;
            const userId = user.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = (page - 1) * limit;

            const notifications = await notificationService.getUserNotifications(userId, limit, offset);
            
            res.json(notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }

    async markAsRead(req: Request, res: Response): Promise<void> {
        try {
            const { notificationId } = req.params;
            const user = req.user as User;
            const userId = user.id;

            await notificationService.markAsRead(parseInt(notificationId), userId);
            
            res.json({ message: 'Notification marked as read' });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            res.status(500).json({ error: 'Failed to mark notification as read' });
        }
    }
}

export default new NotificationController();