import * as Sentry from '@sentry/react-native';
import { InteractionManager } from 'react-native';
import RNFS from 'react-native-fs';
import {
  consoleTransport,
  fileAsyncTransport,
  logger,
  mapConsoleTransport,
  sentryTransport,
} from 'react-native-logs';

export const logFilePath = RNFS.DocumentDirectoryPath + '/log';

const transports = [
  fileAsyncTransport,
  sentryTransport,
  consoleTransport,
  mapConsoleTransport,
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
    // to avoid too many sentry logs
    errorLevels: 'error',
  },
  async: true,
  asyncFunc: InteractionManager.runAfterInteractions,
});

export const rootLog = log.extend('root');
export const mvLog = log.extend('mv');
export const userLog = log.extend('user');
export const playerLog = log.extend('player');
