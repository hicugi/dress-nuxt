import { defineStore } from "pinia";

import { useApiFetch } from "~/composables/useApiFetch";

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
      await useApiFetch("v1/language/list").then(({ data, error }) => {
        if (error) return;
        else if (data) {
          const languages = data.data;
          if (languages.length) {
            const currentLang = languages.find(
              (currentLang) =>
                currentLang.locale === useLangStore().currentLocale
            );
            this.$patch({
              currentLang,
              languages,
            });
          }
        }
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
