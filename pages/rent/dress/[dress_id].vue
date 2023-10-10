<script>
import { mapActions, mapState } from "pinia";
import { useCurrencyStore } from "~/stores/CurrencyStore.js";
import { useDressCatalog } from "~/stores/DressCatalog";
import DressBook from "~/components/rent/catalog/DressBook.vue";
import VLazyImage from "v-lazy-image";

export default {
  components: {
    DressBook,
    VLazyImage,
  },
  data() {
    return {
      photoSelectedIndex: 0,
    };
  },
  beforeMount() {
    this.getDress({
      dress_id: this.$route.params.dress_id || undefined,
    }).then(({ title, description, photo }) => {
      const runtimeConfig = useRuntimeConfig().public.NUXT_PUBLIC_SITE_URL;
      const localeRoute = useLocalePath();
      useSeoMeta({
        title,
        description,
        ogTitle: title,
        ogDescription: description,
        ogImage: photo?.[0].image,
        ogUrl: runtimeConfig + localeRoute(),
        twitterTitle: title,
        twitterDescription: description,
        twitterImage: photo?.[0].image,
        twitterCard: "summary_large_image",
      });
    });
  },
  methods: {
    ...mapActions(useCurrencyStore, ["loadCurrencies"]),
    ...mapActions(useDressCatalog, ["getDress", "saveBooking"]),
  },
  computed: {
    ...mapState(useCurrencyStore, ["currentCurrency", "currencies"]),
    ...mapState(useDressCatalog, ["dress"]),
  },
};
</script>

<template>
  <!-- take from https://www.hyperui.dev/components/ecommerce/products -->
  <section v-if="dress">
    <div class="relative mx-auto max-w-screen-xl px-4 py-8 <sm:py-4">
      <div class="grid grid-cols-1 items-start gap-8 <sm:gap-2 md:grid-cols-2">
        <div class="grid gap-4 <sm:gap-2 md:grid-cols-1">
          <v-lazy-image
            class="aspect-square w-full h-250 <sm:h-130 rounded-xl object-cover"
            src-placeholder="/img/placeholder.gif"
            :src="dress.photo[photoSelectedIndex].image"
            :alt="dress.title"
          />
          <ul class="mt-1 flex gap-5 <sm:gap-2">
            <li v-for="(photo, key) in dress.photo" :key="key" class="h-50">
              <v-lazy-image
                :src="photo.image"
                src-placeholder="/img/placeholder.gif"
                class="aspect-square w-full h-full rounded-xl object-cover cursor-pointer"
                @click="photoSelectedIndex = key"
              />
            </li>
          </ul>
        </div>

        <div class="sticky top-0">
          <div class="mt-8 <sm:mt-2 flex justify-between">
            <div class="w-full space-y-2">
              <h1 class="text-xl font-bold sm:text-2xl">
                {{ dress.title }}
              </h1>

              <p class="text-sm">
                {{ dress.category.map((item) => item.title).join(", ") }}
              </p>
            </div>
          </div>

          <div class="mt-4">
            <div class="prose max-w-none">
              <p>
                {{ dress.description }}
              </p>
            </div>
          </div>

          <form class="mt-4">
            <fieldset class="flex" v-if="dress.color.length">
              <legend class="mb-1 text-sm font-medium contents">
                {{ $t("rent.dress_color") }}:&nbsp;
              </legend>
              <label
                v-for="color in dress.color"
                :for="'color_' + color.color"
                class="cursor-pointer ml-1"
              >
                <input
                  type="radio"
                  :id="'color_' + color.color"
                  name="color"
                  class="peer sr-only"
                />

                <span
                  class="block h-6 w-6 rounded-full border border-gray-200 ring-1 ring-transparent ring-offset-1 peer-checked:ring-gray-300"
                  :style="'background-color: ' + color.color"
                />
              </label>
            </fieldset>

            <fieldset v-if="dress.size.length" class="mt-4 flex">
              <legend class="text-sm font-medium contents">
                {{ $t("rent.dress_size") }}:
              </legend>
              <label
                v-for="size in dress.size"
                :for="'size_' + size.size"
                class="cursor-pointer ml-2"
              >
                <input
                  type="radio"
                  name="size"
                  :id="'size_' + size.size"
                  class="peer sr-only"
                />

                <span
                  class="group inline-flex h-6 w-auto pr-2 pl-2 items-center justify-center rounded-md border text-xs peer-checked:bg-black peer-checked:text-white"
                >
                  {{ size.size }}
                </span>
              </label>
            </fieldset>

            <div class="mt-4 flex gap-2">
              <p class="text-sm font-medium">{{ $t("rent.dress_price") }}:</p>
              <p class="text-sm">
                {{ currentCurrency ? currentCurrency.symbol : "" }}
                {{
                  dress.price
                    .toLocaleString("kk", {
                      //style: "currency",
                      //currency: currencyCode,
                      minimumFractionDigits: Math.ceil(dress.price % 1) * 2,
                    })
                    .replace(" ", ",")
                }}
                / {{ $t("rent.dress_price_in_day") }}
              </p>
            </div>

            <div v-if="dress">
              <hr class="mt-3 mb-3" />
              <DressBook :dress_id="dress.dress_id" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
