import i18next, { ModuleType } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import { storage } from './reduxPersistMMKV';

export const getSystemLanguage = (): string => {
  const locales = getLocales();
  return locales[0].languageTag;
};

const languageDetector = {
  type: 'languageDetector' as ModuleType,
  async: true,
  detect: function (callback: (arg0: string) => void) {
    // 获取上次选择的语言
    const storedRoot = JSON.parse(
      storage.getString('persist:root') || '{}'
    );
    const lng = JSON.parse(
      storedRoot.locale || '{}'
    ).value;

    // 如果是跟随本地，则获取系统语言
    if (lng === 'locale') {
      callback(getSystemLanguage());
    } else {
      callback(lng);
    }
  }
};

// 初始化i18next配置
i18next
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    fallbackLng: 'en-US', // 切换语言失败时的使用的语言
    // debug: __DEV__, // 开发环境开启调试
    resources: {
      'en-US': {
        translation: require('../locales/en-US.json'),
      },
      'zh-CN': {
        translation: require('../locales/zh-CN.json'),
      },
      'zh-TW': {
        translation: require('../locales/zh-TW.json'),
      },
    },
    react: {
      useSuspense: false,
    },
  });

export default i18next;
