const { getDefaultConfig: getDefaultExpoConfig } = require('expo/metro-config');
const { mergeConfig, getDefaultConfig } = require('@react-native/metro-config');
const { withSentryConfig } = require('@sentry/react-native/metro');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);
const expoDefaultConfig = getDefaultExpoConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = mergeConfig(defaultConfig, expoDefaultConfig, {
    resolver: {
        watchFolders: [
            // Add your project's source folder path here
            path.resolve(__dirname, 'src')
        ],
        useWatchman: true,
    },
});

module.exports = withSentryConfig(config);
