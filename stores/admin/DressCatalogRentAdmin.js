import { defineStore } from "pinia";

import { useCurrencyStore } from "../CurrencyStore.js";
import { useLangStore } from "../LangStore.js";
import { useApiFetch } from "~/composables/useApiFetch";
import { useFetchFront } from "~/composables/useFetchFront";

export const useAdminRentDressCatalogStore = defineStore(
  "admin-rent-dress-catalog-store",
  {
    state: () => ({
      categories: [],
      colors: [],
      sizes: [],
      dresses: [],
      dress: null,
      errors: [],
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
          this.$patch({ dresses: data.data });
        });
      },

      async getDress(dress_id) {
        await useApiFetch("v1/admin/rent/dress", { params: { dress_id } }).then(
          ({ data, error }) => {
            if (data) this.dress = data.data;
            else if (error) {
              this.errors = error.data;
            }
          }
        );
      },

      async saveDress(form, e) {
        const formData = new FormData();
        this.errors = [];

        form.translations.forEach((translation) => {
          formData.append(
            `translations[${translation.locale}][title]`,
            translation.title
          );
          formData.append(
            `translations[${translation.locale}][description]`,
            translation.description
          );
        });

        formData.append("quantity", form.quantity);

        form.categories.map((category) =>
          formData.append("categories[]", category)
        );

        form.colors.map((color) => formData.append("colors[]", color));
        form.sizes.map((size) => formData.append("sizes[]", size));

        await useFetchFront("v1/admin/rent/dress/save", {
          method: "POST",
          body: formData,
        }).then(({ data, error, errors }) => {
          console.log("saveDress", form, data, error, errors);
          if (errors) this.errors = errors;
        });
      },

      async getCategories() {
        if (!this.categories.length)
          await useApiFetch("/v1/admin/rent/category/list").then(
            ({ data, error, errors }) => {
              if (data) this.$patch({ categories: data.data });
            }
          );
      },
      async getSizes() {
        if (!this.sizes.length)
          await useApiFetch("/v1/admin/rent/size/list").then(
            ({ data, error, errors }) => {
              if (data) this.$patch({ sizes: data.data });
            }
          );
      },
      async getColors() {
        if (!this.colors.length)
          await useApiFetch("/v1/admin/rent/color/list").then(
            ({ data, error, errors }) => {
              if (data) this.$patch({ colors: data.data });
            }
          );
      },
    },
  }
);
