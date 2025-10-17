module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-native-firebase|@react-native-community|react-native-gesture-handler|react-native-reanimated|react-native-modal|react-native-google-mobile-ads)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};
