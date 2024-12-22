// notification-sw.js
console.log('Service worker loaded');

self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(self.clients.claim()); // Take control of all pages immediately
});

self.addEventListener('push', (event) => {
    console.log('Push received:', event.data?.text());
    
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.message,
            data: data.data,
            requireInteraction: true,
            tag: 'notification',
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked');
    event.notification.close();

    event.waitUntil(
        clients.matchAll({type: 'window'}).then(clientList => {
            if (clientList.length > 0) {
                let client = clientList[0];
                client.focus();
                return client.postMessage({
                    type: 'NOTIFICATION_CLICKED',
                    data: event.notification.data
                });
            }
        })
    );
});