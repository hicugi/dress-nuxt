import { defineStore } from "pinia";
//import { useAPIFetch } from "~/composables/useApiFetch.ts";
import axios from "~/composables/useApi";

export const useLangStore = defineStore("lang-store", {
  state: () => ({
    languages: [],
    currentLang: null,
    currentLocale: process.client
      ? localStorage.getItem("local") ||
        import.meta.env.VITE_DEFAULT_LOCALE ||
        "en"
      : "en",
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
      localStorage.setItem("locale", lang.locale);
      if (redirect) this.router.push({ params: { locale: lang.locale } });
      if (this.i18n.locale !== lang.locale) this.i18n.locale = lang.locale;
      if (this.currentLocale !== lang.locale) this.currentLocale = lang.locale;
    },
  },
});
