import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://8f255799dc215a920003a9291d1d1e14@o4507198225383424.ingest.de.sentry.io/4507198229184592",
  environment: __DEV__ ? "development" : "production",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  // profilesSampleRate is relative to tracesSampleRate.
  // Here, we'll capture profiles for 100% of transactions.
  profilesSampleRate: 1.0,
  attachScreenshot: true,
  attachViewHierarchy: true,
  _experiments: {
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllImages: false,
      maskAllText: false,
      maskAllVectors: false,
    }),
    Sentry.reactNativeTracingIntegration(),
  ],
  enabled: !__DEV__,
});
