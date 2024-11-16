const { getSentryExpoConfig } = require('@sentry/react-native/metro');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = getSentryExpoConfig(__dirname, {
    annotateReactComponents: true,
});
