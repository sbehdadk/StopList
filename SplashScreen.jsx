import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const { height, width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.symbol}>⛔</Text>
        <Text style={styles.title}>StopList</Text>
        <Text style={styles.tagline}>Master the art of{'\n'}NOT doing</Text>
        <View style={styles.quoteContainer}>
          <Text style={styles.quote}>
            "The secret to getting ahead{'\n'}
            is knowing what to avoid"
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  symbol: {
    fontSize: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -2,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 18,
    color: '#8b8b9f',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 40,
    lineHeight: 26,
  },
  quoteContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b6b',
    paddingLeft: 20,
    paddingVertical: 10,
  },
  quote: {
    fontSize: 15,
    color: '#6d6d7f',
    fontStyle: 'italic',
    textAlign: 'left',
    lineHeight: 22,
  },
});

