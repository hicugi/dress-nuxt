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
      form: {
        dress_id: null,
        translations: useLangStore().languages.map((language) => ({
          locale: language.locale,
          title: "",
          description: "",
          placeholder: language.title,
        })),
        prices: useCurrencyStore().currencies.map((currency) => ({
          currency,
          price: 0,
        })),
        quantity: 0,
        categories: [],
        colors: [],
        sizes: [],
        photos: [],
        photos2: [],
      },
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
        if (dress_id == "new") {
          const { categories, colors, sizes } = this;
          this.$reset({});
          this.$patch({ categories, colors, sizes });
        } else
          await useApiFetch("v1/admin/rent/dress", {
            params: { dress_id },
          }).then(({ data, error, errors }) => {
            if (data) {
              const dress = data.data;

              const form = {
                dress_id: dress.dress_id,
                quantity: dress.quantity || 0,
                categories: dress.categories.map(
                  (category) => category.category_id
                ),
                colors: dress.colors.map((color) => color.color_id),
                sizes: dress.sizes.map((size) => size.size_id),
                translations: useLangStore().languages.map((language) => {
                  const translation = dress.translations.find(
                    ({ language: locale }) => locale == language.locale
                  );
                  return {
                    locale: language.locale,
                    title: translation?.title || "",
                    description: translation?.description || "",
                    placeholder: language.title,
                  };
                }),
                prices: useCurrencyStore().currencies.map((currency) => {
                  const price = dress.prices.find(
                    ({ code }) => code == currency.code
                  );
                  return {
                    currency,
                    price: price?.price || 0,
                  };
                }),
                photos: dress.photos.map((photo) => photo.image_small),
                photos2: [],
              };

              this.$patch({ dress, form });
            } else if (errors) {
              this.errors = errors;
            }
          });
      },

      async saveDress(form, e) {
        const formData = new FormData();
        this.errors = [];

        formData.append("dress_id", form.dress_id ?? undefined);

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

        form.prices.forEach((item) => {
          formData.append(`prices[${item.currency.code}]`, item.price);
        });

        formData.append("quantity", form.quantity);

        form.categories.map((category) =>
          formData.append("categories[]", category)
        );

        form.colors.map((color) => formData.append("colors[]", color));
        form.sizes.map((size) => formData.append("sizes[]", size));
        // await form.photos.map((photo, index) => {
        //   console.log(photo);
        //   //const file = DataURIToBlob(photo);
        //   //console.log(file);

        //   fetch(photo)
        //     .then((res) => res.blob())
        //     .then((blob) => {
        //       console.log(blob);
        //       const file = new File([blob], `${index}.jpg`);
        //       formData.append("photos", file);
        //     });
        // });

        form.photos2.map((photo) => {
          console.log(photo);
          formData.append("photos[]", photo);
        });

        await useFetchFront(
          "v1/admin/rent/dress/" + (form.dress_id ? "update" : "save"),
          {
            method: "POST",
            body: formData,
          }
        ).then(({ data, error, errors }) => {
          //console.log("saveDress", form, data, error, errors);
          this.errors = errors;
          if (data)
            navigateTo({
              name: "sadmin-rent-dress___" + useLangStore().currentLocale,
            });
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
