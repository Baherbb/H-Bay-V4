export interface PushSubscription {
    endpoint: string;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export interface NotificationData {
    id: number;
    title: string;
    message: string;
    type: 'ORDER_UPDATE' | 'PRICE_DROP' | 'BACK_IN_STOCK' | 'NEW_PRODUCT' | 'PROMOTION';
    read: boolean;
    data?: any;
    created_at: string;
    updated_at: string;
}

export interface NotificationResponse {
    count: number;
    rows: NotificationData[];
}

export interface NotificationServiceInterface {
    subscribeToPushNotifications(): Promise<void>;
    getNotifications(page?: number, limit?: number): Promise<NotificationResponse>;
    markAsRead(notificationId: number): Promise<void>;
    unsubscribeFromPushNotifications(): Promise<void>;
}