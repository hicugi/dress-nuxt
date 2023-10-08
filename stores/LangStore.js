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
      console.log(this.navigateTo);
      console.log("prev", this.currentLocale);
      if (this.currentLocale !== lang.locale) {
        this.currentLocale = lang.locale;
        console.log(this.currentLocale, redirect);

        if (process.client) localStorage.setItem("locale", lang.locale);

        if (redirect) {
          const switchLocalePath = useSwitchLocalePath();
          const router = useRouter();

          router
            .push(switchLocalePath(lang.locale))
            .catch((e) => console.log(e));
        }
        // if (this.i18n.locale !== lang.locale) this.i18n.locale = lang.locale;
      }
    },
  },
});
