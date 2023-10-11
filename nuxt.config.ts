import axios from "./composables/useApi.js";

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
  runtimeConfig: {
    public: {
      NUXT_DEFAULT_CURRENCE_CODE:
        process.env.NUXT_DEFAULT_CURRENCE_CODE || "USD",
      NUXT_PUBLIC_SITE_URL:
        process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      NUXT_API_URL: process.env.NUXT_API_URL || "http://localhost/api/",
    },
  },
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
  modules: [
    "@pinia/nuxt",
    "nuxt-windicss",
    "@nuxtjs/i18n",
    "nuxt-simple-sitemap",
  ],
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
    defaultLocale: process.env.NUXT_DEFAULT_LOCALE || "en",
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
  sitemap: {
    enabled: true,
    autoI18n: true,
    xsl: false,
    //sitemaps: true,
    urls: async () => {
      const { data } = await axios().get(
        "v1/client/rent/dress/list?per_page=100",
        {
          params: {
            //category_id: this.category.category_id,
            //lang,
            //currency,
          },
        }
      );

      return data.data.map((dress) => ({
        loc: `rent/dress/${dress.dress_id}`,
        lastmod: dress.updated_at,
        changefreq: "weekly",
        priority: 0.8,
        image: dress.photo,
      }));
    },
  },
});
