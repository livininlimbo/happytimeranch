const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure fonts are properly handled for web builds
config.resolver.alias = {
  ...config.resolver.alias,
  '@expo/vector-icons': path.resolve(__dirname, 'node_modules/@expo/vector-icons'),
};

// Add font extensions
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2');

// Configure web-specific settings
config.transformer.assetRegistryPath = 'react-native/Libraries/Image/AssetRegistry';

module.exports = config;