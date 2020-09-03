import i18n from "i18next";
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from "react-i18next";

// https://github.com/i18next/i18next-browser-languageDetector

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'nb-NO',
        load: "currentOnly",
        debug: false,
        // keySeparator: true,
        interpolation: {
            escapeValue: false // react already safes from xss
        },

        // backend options
        backend: {
            crossDomain: true,
            loadPath: '/idporten-bekreft-kontaktinfo/locales/{{lng}}/{{ns}}.json'
        },

        // react i18next special options (optional)
        // override if needed - omit if ok with defaults
        react: {
          bindI18n: 'languageChanged',
          bindI18nStore: '',
          transEmptyNodeValue: '',
          transSupportBasicHtmlNodes: true,
          transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
          useSuspense: true,
        }
    });

export default i18n;