import express from 'express';
import notificationController from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/subscribe', authMiddleware, notificationController.subscribe);
router.get('/', authMiddleware, notificationController.getNotifications);
router.patch('/:notificationId/read', authMiddleware, notificationController.markAsRead);
router.post('/test', authMiddleware, notificationController.testNotification);

export default router;

