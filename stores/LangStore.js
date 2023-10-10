import { defineStore } from "pinia";
import axios from "~/composables/useApi";

export const useLangStore = defineStore("lang-store", {
  state: () => ({
    languages: [],
    currentLang: null,
    currentLocale:
      useI18n()?.locale?.value ?? process.env.NUXT_DEFAULT_LOCALE ?? "en",
    errors: [],
    error: [],
  }),
  actions: {
    async loadLanguages() {
      await axios()
        .get("v1/language/list")
        .then((response) => {
          const languages = response.data.data;
          if (languages.length)
            languages.find((currentLang) => {
              if (currentLang.locale === this.currentLocale) {
                this.$patch({
                  currentLang,
                  languages,
                });
              }
            });
        })
        .catch((error) => {
          console.log(error);
          this.errors = error.response.data.errors;
        });
    },
    setLocale(lang, redirect = true) {
      if (this.currentLocale == lang.locale) return;

      this.currentLocale = lang.locale;

      if (process.client) {
        localStorage.setItem("locale", lang.locale);

        if (redirect) {
          const switchLocalePath = useSwitchLocalePath();
          useRouter()
            .push(switchLocalePath(lang.locale))
            .catch((e) => console.log(e));
        }
      }
      // if (this.i18n.locale !== lang.locale) this.i18n.locale = lang.locale;
    },
  },
});
