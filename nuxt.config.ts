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
  routeRules: {
    "/": { redirect: "/rent" },
  },
  devtools: { enabled: false },
  modules: ["@pinia/nuxt", "nuxt-windicss", "@nuxtjs/i18n"],
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs",
  },
  i18n: {
    locales: ["en", "ru", "kk"],
    defaultLocale: "en",
    strategy: "prefix",
    vueI18n: "./i18n.config.ts",
  },
  windicss: {
    preflight: {
      alias: {
        "nuxt-link": "a",
        "nuxt-img": "img",
      },
    },
  },
  // runtimeConfig: {
  //   public: {
  //     API_URL: process.env.API_URL || "http://localhost/api/",
  //   },
  // },
});
