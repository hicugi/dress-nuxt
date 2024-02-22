import { defineStore } from "pinia";

import { useCurrencyStore } from "./CurrencyStore.js";
import { useLangStore } from "./LangStore.js";
import useApiCore from "~/composables/useApiCore";

export const useDressCatalog = defineStore("dress-catalog", {
  state: () => ({
    dresses: [],
    dress: null,

    categories: [],
    category: {
      category_id: undefined,
      title: useI18n().t("rent.category_list_all_categories"),
      description: useI18n().t("rent.common_description"),
      slug: "all",
      photos: [{ image: useRuntimeConfig() + "/img/og-image.jpg" }],
    },
    errors: [],
    error: [],
  }),
  actions: {
    async loadDressCatalog({ category_id }) {
      const lang = useLangStore().currentLocale;
      const currency = useCurrencyStore().currentCode;
      //const currencySymbol = useCurrencyStore().currentSymbol;
      await useApiCore("v1/client/rent/dress/list?per_page=100", {
        params: {
          category_id: category_id ?? undefined,
          lang,
          currency,
        },
      })
        .then((response) => {
          this.dresses = response.data.value.data;
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },

    async setCategory(item) {
      await this.loadDressCatalog({ category_id: item.category_id });
      this.$patch({
        category: item,
      });
    },

    switchCategory(item) {
      const currentRoute = useRouter().currentRoute;

      if (process.client) {
        useRouter()
          .replace({
            ...currentRoute,
            params: {
              ...currentRoute.params,
              slug: item.slug,
            },
          })
          .catch((e) => console.log(e));
      }
    },

    async changeDate(date) {},

    async loadCategories() {
      const runtimeConfig = useRuntimeConfig().public.NUXT_PUBLIC_SITE_URL;
      const lang = useLangStore().currentLocale;
      const i18n = useI18n();
      await useApiCore("v1/client/rent/category/list?per_page=100", {
        params: {
          lang,
        },
      })
        .then((response) => {
          const categories = [
            {
              category_id: undefined,
              title: i18n.t("rent.category_list_all_categories"),
              slug: "all",
              description: i18n.t("rent.common_description"),
              photos: [{ image: runtimeConfig + "/img/og-image.jpg" }],
            },

            ...response.data.value.data.map((category) => {
              return { ...category, slug: stringToSlug(category.title) };
            }),
          ];

          this.$patch({
            categories,
            category: categories[0],
          });
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },

    async getDress(params) {
      if (params) {
        params.lang = useLangStore().currentLocale;
        params.currency = useCurrencyStore().currentCode;
        return await useApiCore("v1/client/rent/dress", { params: params })
          .then((response) => {
            this.dress = response.data.value.data;
            return this.dress;
          })
          .catch((error) => {
            this.errors = error.response.data.errors;
          });
      }
    },
  },
});
