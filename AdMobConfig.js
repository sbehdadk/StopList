import { Platform } from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
  setTestDeviceIDAsync,
} from 'expo-ads-admob';

// Your AdMob Ad Unit IDs from screenshot
const AD_UNIT_IDS = {
  banner: {
    android: __DEV__ 
      ? 'ca-app-pub-3940256099942544/6300978111' // Google test ID
      : 'ca-app-pub-4990808025747866/9254694633', // Your real Banner ID
    ios: __DEV__ 
      ? 'ca-app-pub-3940256099942544/2934735716'
      : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // Add iOS ID when ready
  },
  interstitial: {
    android: __DEV__ 
      ? 'ca-app-pub-3940256099942544/1033173712' // Google test ID
      : 'ca-app-pub-4990808025747866/8429338759', // Your real Interstitial ID
    ios: __DEV__ 
      ? 'ca-app-pub-3940256099942544/4411468910'
      : 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX', // Add iOS ID when ready
  },
};

// Initialize AdMob (set test device if needed)
export const initializeAdMob = async () => {
  try {
    // In development, use test ads
    if (__DEV__) {
      await setTestDeviceIDAsync('EMULATOR');
    }
    console.log('✓ AdMob initialized');
  } catch (error) {
    console.error('AdMob initialization failed:', error);
  }
};

// Get platform-specific ad unit ID
export const getAdUnitId = (type) => {
  return AD_UNIT_IDS[type][Platform.OS] || AD_UNIT_IDS[type].android;
};

// Load and show interstitial ad
export const showInterstitialAd = async () => {
  try {
    await AdMobInterstitial.setAdUnitID(getAdUnitId('interstitial'));
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
    console.log('✓ Interstitial ad shown');
  } catch (error) {
    console.log('Interstitial ad error:', error.message);
  }
};

export { AdMobBanner };
