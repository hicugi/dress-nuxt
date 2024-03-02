import { defineStore } from "pinia";

import { useCurrencyStore } from "../CurrencyStore.js";
import { useLangStore } from "../LangStore.js";
import useApiCore from "~/composables/useApiCore";

export const useAdminRentDressCatalogStore = defineStore(
  "admin-rentn-dress-catalog",
  {
    state: () => ({
      dresses: [],
      dress: null,
    }),
    actions: {
      async loadDressCatalog({ category_id }) {
        const lang = useLangStore().currentLocale;
        const currency = useCurrencyStore().currentCode;
        await useApiCore("v1/admin/rent/dress/list?per_page=100", {
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
    },
  }
);
