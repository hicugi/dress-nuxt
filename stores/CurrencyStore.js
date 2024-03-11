import { defineStore } from "pinia";

import { useApiFetch } from "~/composables/useApiFetch";

export const useCurrencyStore = defineStore("currency-store", {
  state: () => ({
    currencies: [],
    currentCurrency: null,
    currentCode: process.client
      ? localStorage.getItem("currencyCode") ??
        useRuntimeConfig().public.NUXT_DEFAULT_CURRENCE_CODE ??
        "USD"
      : useRuntimeConfig().public.NUXT_DEFAULT_CURRENCE_CODE,
    errors: [],
    error: [],
  }),
  actions: {
    async loadCurrencies() {
      await useApiFetch("v1/currency/list").then(({ data, error, errors }) => {
        if (data) {
          let patch = {
            currencies: [...data.data],
          };

          const currentCurrency = patch.currencies.find((currency) => {
            return currency.code === this.currentCode;
          });

          if (currentCurrency) {
            const symbol = currentCurrency.symbol;
            patch.currentCurrency = { ...currentCurrency, symbol };
          }

          this.$patch(patch);
        }
        this.errors = errors;
      });
    },
    setCurrency(currency, redirect = true) {
      if (process.client) localStorage.setItem("currencyCode", currency.code);

      if (redirect) this.router.push({ params: { currency: currency.code } });

      if (this.currentCurrency.code !== currency.code) {
        const symbol = currency.symbol;
        this.currentCurrency = { ...currency, symbol };
      }
    },
  },
});
