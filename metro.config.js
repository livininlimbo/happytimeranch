const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add font extensions to asset extensions
config.resolver.assetExts.push('ttf', 'otf', 'woff', 'woff2');

// Ensure fonts are properly handled in web builds
config.transformer.assetRegistryPath = 'react-native/Libraries/Image/AssetRegistry';

module.exports = config;