import { defineStore } from "pinia";

import useApiCore from "~/composables/useApiCore";

export const useLangStore = defineStore("lang-store", {
  state: () => ({
    languages: [],
    currentLang: null,
    currentLocale: useI18n()?.locale?.value,
    errors: [],
    error: [],
  }),
  actions: {
    async loadLanguages() {
      await useApiCore("v1/language/list", {
        onResponse({ response }) {
          const languages = response._data.data;
          if (languages.length) {
            const currentLang = languages.find(
              (currentLang) =>
                currentLang.locale === useLangStore().currentLocale
            );
            useLangStore().$patch({
              currentLang,
              languages,
            });
          }
        },
      });
    },
    setLocale(lang, redirect = true) {
      if (this.currentLocale == lang.locale) return;

      this.currentLocale = lang.locale;

      if (process.client) {
        if (redirect) {
          const switchLocalePath = useSwitchLocalePath();
          useRouter()
            .push(switchLocalePath(lang.locale))
            .catch((e) => console.log(e));
        }
      }
    },
  },
});
