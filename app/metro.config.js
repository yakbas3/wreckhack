const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add CSV to assetExts
config.resolver.assetExts.push('csv');

module.exports = config; 