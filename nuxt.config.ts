//import axios from "./composables/useApi.js";

// const loadLanguages = async () => {
//   return await axios()
//     .get("v1/language/list")
//     .then((response) => {
//       const a = response.data.data;
//       const b = a.map(({ locale }) => locale);
//       return b;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
    //pageTransition: { name: "page", mode: "out-in" },
    //work but with bugs
  },
  routeRules: {
    "/": { redirect: "/rent" },
  },
  devtools: { enabled: false },
  modules: ["@pinia/nuxt", "nuxt-windicss", "@nuxtjs/i18n"],
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  },
  i18n: {
    lazy: true,
    langDir: "locales",
    locales: [
      {
        code: "en",
        file: "en.json",
      },
      {
        code: "ru",
        file: "ru.json",
      },
      {
        code: "kk",
        file: "kk.json",
      },
    ],
    defaultLocale: "en",
    strategy: "prefix",
    vueI18n: "./i18n.config.ts",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n",
      redirectOn: "root",
    },
  },
  // imports: {
  //   presets: [
  //     {
  //       from: "vue-i18n",
  //       imports: ["useI18n"],
  //     },
  //   ],
  // },
  windicss: {
    preflight: {
      alias: {
        "nuxt-link": "a",
        "nuxt-img": "img",
      },
    },
  },
  vite: { build: { minify: true } },
  ssr: true,
  // runtimeConfig: {
  //   public: {
  //     API_URL: process.env.API_URL || "http://localhost/api/",
  //   },
  // },
});
