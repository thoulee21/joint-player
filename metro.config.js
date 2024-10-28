const { mergeConfig } = require('@react-native/metro-config');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = mergeConfig(getSentryExpoConfig(__dirname), {
    resolver: { useWatchman: true },
});
