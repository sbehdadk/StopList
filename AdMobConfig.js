import { Platform } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

// Your AdMob Ad Unit IDs
const AD_UNIT_IDS = {
  banner: {
    android: __DEV__ 
      ? TestIds.BANNER // Google test ID
      : 'ca-app-pub-4990808025747866/9254694633', // Your real Banner ID
    ios: __DEV__ 
      ? TestIds.BANNER
      : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // Add iOS ID when ready
  },
  interstitial: {
    android: __DEV__ 
      ? TestIds.INTERSTITIAL // Google test ID
      : 'ca-app-pub-4990808025747866/8429338759', // Your real Interstitial ID
    ios: __DEV__ 
      ? TestIds.INTERSTITIAL
      : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // Add iOS ID when ready
  },
};

// Get platform-specific ad unit ID
export const getAdUnitId = (type) => {
  return AD_UNIT_IDS[type][Platform.OS] || AD_UNIT_IDS[type].android;
};

// Initialize AdMob (no initialization needed with this package)
export const initializeAdMob = async () => {
  console.log('✓ AdMob ready (using react-native-google-mobile-ads)');
};

// Create Banner Ad Component
export const AdMobBannerComponent = () => {
  return (
    <BannerAd
      unitId={getAdUnitId('banner')}
      size={BannerAdSize.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: false,
      }}
      onAdLoaded={() => {
        console.log('✓ Banner ad loaded');
      }}
      onAdFailedToLoad={(error) => {
        console.log('Banner ad failed:', error.message);
      }}
    />
  );
};

// Interstitial Ad
let interstitial = null;
let interstitialLoaded = false;

export const loadInterstitialAd = () => {
  interstitial = InterstitialAd.createForAdRequest(getAdUnitId('interstitial'), {
    requestNonPersonalizedAdsOnly: false,
  });

  const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    interstitialLoaded = true;
    console.log('✓ Interstitial ad loaded');
  });

  const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    interstitialLoaded = false;
    // Reload for next time
    loadInterstitialAd();
  });

  interstitial.load();

  return () => {
    unsubscribeLoaded();
    unsubscribeClosed();
  };
};

export const showInterstitialAd = () => {
  if (interstitialLoaded && interstitial) {
    interstitial.show();
  } else {
    console.log('Interstitial ad not ready yet');
  }
};

export { BannerAd, BannerAdSize };
