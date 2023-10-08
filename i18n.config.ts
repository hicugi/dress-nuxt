import en from "~/locales/en.json";
import kk from "~/locales/kk.json";
import ru from "~/locales/ru.json";

export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  fallbackLocale: "en",
  messages: {
    en,
    kk,
    ru,
  },
}));
