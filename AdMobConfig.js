import { Platform } from 'react-native';
import mobileAds, {
    AdEventType,
    BannerAd,
    BannerAdSize,
    InterstitialAd,
    TestIds
} from 'react-native-google-mobile-ads';

// REPLACE THESE WITH YOUR ACTUAL AD UNIT IDs FROM ADMOB
const AD_UNIT_IDS = {
    banner: {
        android: __DEV__ ? TestIds.BANNER : 'ca-app-pub-4990808025747866/9254694633',
        ios: __DEV__ ? TestIds.BANNER : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    interstitial: {
        android: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-4990808025747866/8429338759',
        ios: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
    rewarded: {
        android: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
        ios: __DEV__ ? TestIds.REWARDED : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    },
};

// Initialize AdMob
export const initializeAdMob = async () => {
    try {
        await mobileAds().initialize();
        console.log('✓ AdMob initialized');
    } catch (error) {
        console.error('AdMob initialization failed:', error);
    }
};

// Get platform-specific ad unit ID
export const getAdUnitId = (type) => {
    return AD_UNIT_IDS[type][Platform.OS];
};

// Create and load interstitial ad
let interstitialAd = null;
let interstitialLoaded = false;

export const loadInterstitialAd = () => {
    interstitialAd = InterstitialAd.createForAdRequest(getAdUnitId('interstitial'));

    const unsubscribeLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        interstitialLoaded = true;
        console.log('✓ Interstitial ad loaded');
    });

    const unsubscribeClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        interstitialLoaded = false;
        // Reload the ad for next time
        loadInterstitialAd();
    });

    interstitialAd.load();

    return () => {
        unsubscribeLoaded();
        unsubscribeClosed();
    };
};

export const showInterstitialAd = () => {
    if (interstitialLoaded && interstitialAd) {
        interstitialAd.show();
    } else {
        console.log('Interstitial ad not ready yet');
    }
};

export { BannerAd, BannerAdSize };

