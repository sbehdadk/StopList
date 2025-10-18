import { getAnalytics, logEvent, setAnalyticsCollectionEnabled } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

// Firebase configuration from google-services.json
const firebaseConfig = {
    apiKey: "AIzaSyDsdGahorNxZU69PUoE4yoj0xK5thl30b0",
    authDomain: "stoplist-4332e.firebaseapp.com",
    projectId: "stoplist-4332e",
    storageBucket: "stoplist-4332e.firebasestorage.app",
    messagingSenderId: "443922037401",
    appId: "1:443922037401:android:d715781ec8d0251bdcd608"
};

// Initialize Firebase
let app;
let analytics;

try {
    app = initializeApp(firebaseConfig);
    // Analytics only works on web, but won't crash on mobile
    if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
    }
} catch (error) {
    console.log('Firebase initialization:', error.message);
}

// Export safe analytics functions
export const logAnalyticsEvent = async (eventName, params = {}) => {
    try {
        if (analytics) {
            await logEvent(analytics, eventName, params);
        }
    } catch (error) {
        // Silently fail - analytics is non-critical
        console.log('Analytics event skipped:', eventName);
    }
};

export const enableAnalytics = async () => {
    try {
        if (analytics) {
            await setAnalyticsCollectionEnabled(analytics, true);
        }
    } catch (error) {
        console.log('Analytics enable skipped:', error.message);
    }
};

export default app;

