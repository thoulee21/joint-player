import * as Sentry from '@sentry/react-native';
import RNFS from 'react-native-fs';
import {
  consoleTransport,
  fileAsyncTransport,
  logger,
  sentryTransport,
} from 'react-native-logs';

const transports = [
  fileAsyncTransport,
  sentryTransport,
  consoleTransport,
];

export const log = logger.createLogger({
  transport: transports
    .filter((t) => {
      if (__DEV__) {
        return t !== sentryTransport;
      } else {
        return t !== consoleTransport;
      }
    }),
  transportOptions: {
    FS: {
      ...RNFS,
      documentDirectory: RNFS.DocumentDirectoryPath as never,
      writeAsStringAsync: RNFS.writeFile as never,
    },
    SENTRY: {
      ...Sentry,
      addBreadcrumb: Sentry.addBreadcrumb as never,
    },
  },
});

export const rootLog = log.extend('root');
export const mvLog = log.extend('mv');
export const userLog = log.extend('user');
export const playerLog = log.extend('player');
