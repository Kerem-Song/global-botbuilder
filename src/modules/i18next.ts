import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../translations/en.json';
import ja from '../translations/ja.json';
import key from '../translations/key.json';
import ko from '../translations/ko.json';
import { supportedLngs } from './constants';

i18next.use(LanguageDetector).init({
  interpolation: { escapeValue: false },
  debug: true,
  fallbackLng: 'key',
  supportedLngs,
  detection: {
    order: ['path', 'navigator'],
    //order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
  },
  resources: {
    ko,
    en,
    ja,
    key,
  },
});
