import React, { useState } from 'react';
import { Platform, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
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

// Create Banner Ad Component with Loading State
export const AdMobBannerComponent = () => {
  const [adStatus, setAdStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <View style={bannerStyles.container}>
      {adStatus === 'loading' && (
        <View style={bannerStyles.loadingContainer}>
          <ActivityIndicator size="small" color="#ffa500" />
          <Text style={bannerStyles.loadingText}>Loading ad...</Text>
        </View>
      )}
      
      {adStatus === 'error' && __DEV__ && (
        <View style={bannerStyles.errorContainer}>
          <Text style={bannerStyles.errorText}>
            ⚠️ Ad failed: {errorMsg}
          </Text>
        </View>
      )}
      
      <BannerAd
        unitId={getAdUnitId('banner')}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('✅ Banner ad loaded successfully');
          setAdStatus('loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.log('❌ Banner ad failed:', error.message);
          setAdStatus('error');
          setErrorMsg(error.message);
        }}
      />
    </View>
  );
};

const bannerStyles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#ffa500',
    fontSize: 12,
  },
  errorContainer: {
    padding: 8,
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
    marginVertical: 4,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 11,
    textAlign: 'center',
  },
});

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
