import { useI18n } from "#imports";
import { defineStore } from "pinia";
import { useLangStore } from "./LangStore.js";
import { useCurrencyStore } from "./CurrencyStore.js";

import axios from "~/composables/useApi";

export const useDressCatalog = defineStore("dress-catalog", {
  state: () => ({
    dresses: [],
    dress: null,

    categories: [],
    category: {
      category_id: undefined,
      title: useI18n().t("rent.category_list_all_categories"),
    },
    errors: [],
    error: [],
  }),
  actions: {
    async loadDressCatalog({ category_id }) {
      const lang = useLangStore().currentLocale;
      const currency = useCurrencyStore().currentCode;
      //const currencySymbol = useCurrencyStore().currentSymbol;
      await axios()
        .get("/v1/client/rent/dress/list?per_page=100", {
          params: {
            category_id: category_id ?? undefined,
            lang,
            currency,
          },
        })
        .then((response) => {
          this.dresses = response.data.data;
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },

    async changeCategory(item) {
      console.log(item);
      await this.loadDressCatalog({ category_id: item.category_id });

      this.$patch({
        category: item,
      });
    },

    async changeDate(date) {
      //console.log("xx", date);
    },

    async loadCategories() {
      const lang = useLangStore().currentLocale;
      const i18n = useI18n();
      await axios()
        .get("/v1/client/rent/category/list?per_page=100", {
          params: {
            category_id: this.category.category_id,
            lang,
          },
        })
        .then((response) => {
          const categories = [
            {
              category_id: undefined,
              title: i18n.t("rent.category_list_all_categories"),
            },
            ...response.data.data,
          ];

          this.$patch({
            categories,
            category: categories[0],
          });
        });
      // .catch((error) => {
      //   this.errors = error.response.data.errors;
      // });
    },

    async getDress(params) {
      if (params) {
        params.lang = useLangStore().currentLocale;
        params.currency = useCurrencyStore().currentCode;
        return await axios()
          .get("/v1/client/rent/dress", { params: params })
          .then((response) => {
            this.dress = response.data.data;
            return this.dress;
          })
          .catch((error) => {
            this.errors = error.response.data.errors;
          });
      }
    },
  },
});
