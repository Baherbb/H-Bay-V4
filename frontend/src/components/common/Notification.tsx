import React, { useEffect, useState } from 'react';
import notificationService from '../../services/notification.service';
import { NotificationData } from '../../types/notification.types';
import { useAuth } from '../../contexts/AuthContext';

interface NotificationsProps {
    limit?: number;
}

const Notifications: React.FC<NotificationsProps> = ({ limit = 10 }) => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notificationStatus, setNotificationStatus] = useState({
        permission: 'default' as NotificationPermission,
        subscription: false
    });

    useEffect(() => {
        if (isAuthenticated) {
            loadNotifications();
            checkNotificationStatus();
        }
    }, [page, limit, isAuthenticated]);

    const checkNotificationStatus = async () => {
        if (!('Notification' in window)) {
            setError('Notifications are not supported in this browser');
            return;
        }

        const permission = Notification.permission;
        setNotificationStatus(prev => ({ ...prev, permission }));

        if (permission === 'granted') {
            await setupPushNotifications();
        }
    };

    const setupPushNotifications = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!('serviceWorker' in navigator)) {
                throw new Error('Service Worker is not supported in this browser');
            }

            const existingRegistrations = await navigator.serviceWorker.getRegistrations();
            if (existingRegistrations.length > 0) {
                await Promise.all(existingRegistrations.map(reg => reg.unregister()));
            }

            await notificationService.subscribeToPushNotifications();
            setNotificationStatus(prev => ({ ...prev, subscription: true }));

        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message;
            setError(`Failed to setup notifications: ${errorMessage}`);
            console.error('Notification setup error:', error);
        } finally {
            setLoading(false);
        }
    };

    const requestNotificationPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            setNotificationStatus(prev => ({ ...prev, permission }));
            
            if (permission === 'granted') {
                await setupPushNotifications();
            }
        } catch (error: any) {
            setError(`Failed to request permission: ${error.message}`);
        }
    };

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await notificationService.getNotifications(page, limit);
            setNotifications(response.rows);
            setTotalCount(response.count);
        } catch (error: any) {
            setError(`Failed to load notifications: ${error.message}`);
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(notifications.map(notification =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            ));
        } catch (error: any) {
            setError(`Failed to mark notification as read: ${error.message}`);
            console.error('Error marking notification as read:', error);
        }
    };
    const handleTestNotification = async () => {
        try {
            setLoading(true);
            await notificationService.sendTestNotification();
            setError(null);
        } catch (error: any) {
            setError(`Failed to send test notification: ${error.message}`);
            console.error('Test notification error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    {notificationStatus.permission === 'granted' && (
        <div className="mb-4">
            <button
                onClick={handleTestNotification}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
            >
                Send Test Notification
            </button>
        </div>
    )}

    return (
        <div className="max-w-4xl mx-auto p-4">
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Notification Permission Status */}
            {notificationStatus.permission !== 'granted' && (
                <div className="mb-4 p-4 bg-yellow-100 rounded">
                    <p className="text-yellow-700">
                        {notificationStatus.permission === 'default'
                            ? 'Please enable notifications to receive updates'
                            : 'Notifications are blocked. Please enable them in your browser settings.'}
                    </p>
                    {notificationStatus.permission === 'default' && (
                        <button
                            onClick={requestNotificationPermission}
                            className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                            Enable Notifications
                        </button>
                    )}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center p-8">
                    <div className="text-gray-600">Loading...</div>
                </div>
            ) : (
                <>
                    {notifications.length === 0 ? (
                        <div className="text-center p-8 text-gray-600">
                            No notifications found
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-lg shadow ${
                                        notification.read ? 'bg-gray-50' : 'bg-white border-l-4 border-blue-500'
                                    }`}
                                >
                                    <h3 className="font-semibold text-lg">{notification.title}</h3>
                                    <p className="text-gray-600 mt-1">{notification.message}</p>
                                    {!notification.read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {totalCount > limit && (
                        <div className="flex justify-between items-center mt-6">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-gray-600">
                                Page {page} of {Math.ceil(totalCount / limit)}
                            </span>
                            <button
                                disabled={page * limit >= totalCount}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Notifications;