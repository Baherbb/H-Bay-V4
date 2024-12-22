import React, { useState } from 'react';
import notificationService from '../../services/notification.service';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const NotificationTest: React.FC = () => {
    const { token, isAuthenticated } = useAuth();
    const [status, setStatus] = useState<{
        permission: string;
        subscription: boolean;
        notification: boolean;
    }>({
        permission: 'unknown',
        subscription: false,
        notification: false
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [debug, setDebug] = useState<string[]>([]);

    const addDebugInfo = (info: string) => {
        setDebug(prev => [...prev, `${new Date().toISOString()}: ${info}`]);
    };

    const sendTestNotification = async () => {
        try {
            setLoading(true);
            addDebugInfo('Sending test notification...');
            
            if (!isAuthenticated || !token) {
                throw new Error('Not authenticated');
            }
            
            addDebugInfo(`Using API URL: ${process.env.REACT_APP_API_URL}/api/notification/test`);
            
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/notification/test`,
                {},
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            addDebugInfo(`Server response: ${JSON.stringify(response.data)}`);
            setStatus(prev => ({ ...prev, notification: true }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message;
            setError(`Failed to send test notification: ${errorMessage}`);
            addDebugInfo(`Notification send failed: ${errorMessage}`);
            console.error('Notification error:', error);
        } finally {
            setLoading(false);
        }
    };
    const checkPermission = async () => {
        if (!('Notification' in window)) {
            setError('Notifications are not supported in this browser');
            return;
        }
        const permission = await Notification.permission;
        addDebugInfo(`Permission status: ${permission}`);
        setStatus(prev => ({ ...prev, permission }));
        return permission;
    };

    const testSubscription = async () => {
        try {
            setLoading(true);
            addDebugInfo('Starting subscription process...');
            
            // Check if service worker is supported
            if (!('serviceWorker' in navigator)) {
                throw new Error('Service Worker is not supported in this browser');
            }
            addDebugInfo('Service Worker is supported');
    
            // Clear any existing service workers
            const existingRegistrations = await navigator.serviceWorker.getRegistrations();
            if (existingRegistrations.length > 0) {
                addDebugInfo('Clearing existing service workers...');
                await Promise.all(existingRegistrations.map(reg => reg.unregister()));
            }
    
            // Subscribe to notifications
            addDebugInfo('Attempting to subscribe to push notifications...');
            await notificationService.subscribeToPushNotifications();
            
            setStatus(prev => ({ ...prev, subscription: true }));
            addDebugInfo('Subscription successful');
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message;
            setError(`Failed to subscribe: ${errorMessage}`);
            addDebugInfo(`Subscription failed: ${errorMessage}`);
            console.error('Subscription error:', error);
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    const runFullTest = async () => {
        setError(null);
        setDebug([]); 
        addDebugInfo('Starting full test...');
        
        try {
            if (!isAuthenticated) {
                throw new Error('Not authenticated. Please log in first.');
            }
    
            addDebugInfo(`Authentication status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
            addDebugInfo(`Token present: ${token ? 'Yes' : 'No'}`);
            
            
            const permission = await checkPermission();
            if (permission === 'denied') {
                throw new Error('Notification permission denied. Please enable notifications in your browser settings.');
            }
            
            if (permission !== 'granted') {
                const newPermission = await Notification.requestPermission();
                if (newPermission !== 'granted') {
                    throw new Error('Notification permission not granted');
                }
                setStatus(prev => ({ ...prev, permission: newPermission }));
            }
    
            
            await testSubscription();
            
            
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
                throw new Error('Failed to verify subscription');
            }
            
            addDebugInfo('Subscription verified successfully');
    
            // Step 4: Send Test Notification
            await sendTestNotification();
            
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || error.message;
            setError(errorMessage);
            addDebugInfo(`Test failed: ${errorMessage}`);
            console.error('Test error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Notification System Test</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div className="p-3 bg-gray-100 rounded">
                    <p className="font-semibold">Notification Permission:</p>
                    <p className={`mt-1 ${
                        status.permission === 'granted' ? 'text-green-600' : 
                        status.permission === 'denied' ? 'text-red-600' : 
                        'text-yellow-600'
                    }`}>
                        {status.permission}
                    </p>
                </div>

                <div className="p-3 bg-gray-100 rounded">
                    <p className="font-semibold">Subscription Status:</p>
                    <p className={status.subscription ? 'text-green-600' : 'text-yellow-600'}>
                        {status.subscription ? 'Subscribed' : 'Not Subscribed'}
                    </p>
                </div>

                <div className="p-3 bg-gray-100 rounded">
                    <p className="font-semibold">Test Notification Status:</p>
                    <p className={status.notification ? 'text-green-600' : 'text-yellow-600'}>
                        {status.notification ? 'Sent Successfully' : 'Not Sent'}
                    </p>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={runFullTest}
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Testing...' : 'Run Full Test'}
                    </button>
                    
                    <button
                        onClick={() => {
                            setStatus({
                                permission: 'unknown',
                                subscription: false,
                                notification: false
                            });
                            setDebug([]);
                        }}
                        className="w-full py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Reset Status
                    </button>
                </div>

                {/* Debug Information */}
                <div className="mt-4 p-3 bg-gray-100 rounded">
                    <p className="font-semibold">Debug Information:</p>
                    <pre className="mt-2 text-xs whitespace-pre-wrap">
                        {debug.join('\n')}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default NotificationTest;