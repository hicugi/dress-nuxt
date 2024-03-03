import { defineStore } from "pinia";

import { useCurrencyStore } from "../CurrencyStore.js";
import { useLangStore } from "../LangStore.js";
import { useApiFetch } from "~/composables/useApiFetch";

export const useAdminRentDressCatalogStore = defineStore(
  "admin-rent-dress-catalog-store",
  {
    state: () => ({
      dresses: [],
      dress: null,
    }),
    actions: {
      async loadDressCatalog({ category_id }) {
        const lang = useLangStore().currentLocale;
        const currency = useCurrencyStore().currentCode;

        await useApiFetch("v1/admin/rent/dress/list?per_page=100", {
          params: {
            category_id: category_id ?? undefined,
            lang,
            currency,
          },
        }).then(({ data, error }) => {
          this.dresses = data.value.data;
        });
      },
    },
  }
);
