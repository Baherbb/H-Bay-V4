import axios from 'axios';
import {
    PushSubscription,
    NotificationResponse,
    NotificationServiceInterface
} from '../types/notification.types';

class NotificationService implements NotificationServiceInterface {
    private readonly baseUrl: string;
    private readonly vapidPublicKey: string;
    private swRegistration: ServiceWorkerRegistration | null = null;

    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
        this.vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY || 'BAjBj3h9FTvKZz1ZOIGvYzmopaEEvUDSwJUjR4HAMkmZ6zUFHcrunTugz0OoWrIda6wue5aXcQ37y4f_UlEyyGM';
        
        if (!this.vapidPublicKey) {
            console.error('VAPID public key is not configured');
        }
        
        if (this.vapidPublicKey && !this.isValidVapidKey(this.vapidPublicKey)) {
            console.error('Invalid VAPID key format');
        }
    }
    private isValidVapidKey(key: string): boolean {
        const base64Regex = /^[A-Za-z0-9\-_]+=*$/;
        return base64Regex.test(key);
    }

    private getAuthConfig() {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        };
    }

    private async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker is not supported in this browser');
        }

        return navigator.serviceWorker.register('/notification-sw.js');
    }

    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        try {
            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        } catch (error) {
            throw new Error('Invalid VAPID key format: Unable to decode base64 string');
        }
    }
    
    private async ensureServiceWorkerRegistration(): Promise<ServiceWorkerRegistration> {
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker is not supported in this browser');
        }

        if (this.swRegistration) {
            return this.swRegistration;
        }

        try {
            const existingRegistrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(existingRegistrations.map(reg => reg.unregister()));

            this.swRegistration = await navigator.serviceWorker.register('/notification-sw.js');

            await navigator.serviceWorker.ready;

            if (this.swRegistration.active) {
                console.log('Service worker is active');
                return this.swRegistration;
            }

            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Service worker activation timeout'));
                }, 5000);

                this.swRegistration!.addEventListener('activate', () => {
                    clearTimeout(timeout);
                    console.log('Service worker activated');
                    resolve(this.swRegistration!);
                });
            });
        } catch (error) {
            console.error('Service worker registration failed:', error);
            throw new Error(`Service worker registration failed: ${error}`);
        }
    }

    async subscribeToPushNotifications(): Promise<void> {
        if (!this.vapidPublicKey) {
            throw new Error('VAPID public key is not configured in environment variables');
        }

        if (!this.isValidVapidKey(this.vapidPublicKey)) {
            throw new Error('Invalid VAPID key format. Please check your environment configuration.');
        }

        try {
            const registration = await this.ensureServiceWorkerRegistration();
            
            let subscription = await registration.pushManager.getSubscription();
            
            if (subscription) {
                await subscription.unsubscribe();
            }

            const convertedVapidKey = this.urlBase64ToUint8Array(this.vapidPublicKey);
            
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
            });

            await axios.post(
                `${this.baseUrl}/notification/subscribe`,
                subscription.toJSON(),
                this.getAuthConfig()
            );
        } catch (error: any) {
            console.error('Subscription error:', error);
            throw new Error(
                error.message.includes('applicationServerKey') 
                    ? 'Invalid VAPID key configuration. Please check your environment variables.' 
                    : error.message
            );
        }
    }

    async getNotifications(page: number = 1, limit: number = 10): Promise<NotificationResponse> {
        try {
            const response = await axios.get<NotificationResponse>(
                `${this.baseUrl}/notification?page=${page}&limit=${limit}`,
                this.getAuthConfig()
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            throw error;
        }
    }

    async markAsRead(notificationId: number): Promise<void> {
        try {
            await axios.patch(
                `${this.baseUrl}/notification/${notificationId}/read`,
                {},
                this.getAuthConfig()
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            throw error;
        }
    }

    async sendTestNotification(): Promise<void> {
        try {
            await axios.post(
                `${this.baseUrl}/notification/test`,
                {},
                this.getAuthConfig()
            );
        } catch (error) {
            console.error('Failed to send test notification:', error);
            throw error;
        }
    }
    

    async unsubscribeFromPushNotifications(): Promise<void> {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            
            if (subscription) {
                await subscription.unsubscribe();
            }
        } catch (error) {
            console.error('Failed to unsubscribe from push notifications:', error);
            throw error;
        }
    }
}

export default new NotificationService();
