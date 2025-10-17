// Mock Firebase
jest.mock('@react-native-firebase/analytics', () => {
    return () => ({
        logEvent: jest.fn(() => Promise.resolve()),
        setAnalyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
    });
});

jest.mock('@react-native-firebase/crashlytics', () => {
    return () => ({
        setCrashlyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
    });
});

// Mock expo-constants
jest.mock('expo-constants', () => ({
    expoConfig: {
        version: '1.0.0',
    },
}));

// Mock AdMob
jest.mock('./AdMobConfig', () => ({
    initializeAdMob: jest.fn(() => Promise.resolve()),
    loadInterstitialAd: jest.fn(),
    showInterstitialAd: jest.fn(),
    BannerAd: 'BannerAd',
    BannerAdSize: { ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER' },
    getAdUnitId: jest.fn(() => 'test-ad-unit-id'),
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
    setNotificationHandler: jest.fn(),
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
    scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
    cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
}));

