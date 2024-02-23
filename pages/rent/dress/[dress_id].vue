<script>
import { mapActions, mapState } from "pinia";
import { useCurrencyStore } from "~/stores/CurrencyStore.js";
import { useDressCatalog } from "~/stores/DressCatalog";
import DressBook from "~/components/rent/catalog/DressBook.vue";
import useMetaSeo from "~/composables/useMetaSeo";
import Categories from "~/components/CategoriesTemplate.vue";

export default {
  components: {
    DressBook,
    Categories,
  },
  data() {
    return {
      photoSelectedIndex: 0,
      frontURL: "",
    };
  },
  async created() {
    const route = useRoute();
    const { data: dress } = await useAsyncData("dress", () =>
      this.getDress({
        dress_id: route.params.dress_id || undefined,
      })
    );

    useMetaSeo({
      title: dress.value.title,
      description: dress.value.description,
      imgPath: dress.value?.photo?.[0]?.image || undefined,
    });

    const runtimeConfig = useRuntimeConfig().public.NUXT_PUBLIC_SITE_URL;
    const localeRoute = useLocalePath();
    this.frontURL = runtimeConfig + localeRoute();
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
        <div class="text-sm flex">
          {{ $t("rent.dress_booking_question_to_manager") }}:
          <NuxtLink
            v-if="dress.user.phone"
            :to="
              'https://wa.me/' +
              dress.user.phone +
              '/' +
              `?text=${frontURL}%0A${$t('rent.dress_booking_i_have_question')}`
            "
            target="_blank"
            class="hover"
          >
            <NuxtImg width="20" class="ml-2" src="/icons8-whatsapp.svg" />
          </NuxtLink>

          <NuxtLink
            v-if="dress.user.telegram_username"
            :to="
              `https://t.me/${dress.user.telegram_username}?text=` +
              encodeURIComponent(
                `${frontURL}%0A${$t('rent.dress_booking_i_have_question')}`
              )
            "
            target="_blank"
            class="hover"
          >
            <NuxtImg width="20" class="ml-2" src="/icons8-telegram.svg" />
          </NuxtLink>
        </div>
        <div class="grid gap-4 <sm:gap-2 md:grid-cols-1">
          <NuxtImg
            class="aspect-square w-full h-250 <sm:h-130 rounded-xl object-cover"
            placeholder="/img/placeholder.gif"
            :src="dress.photo[photoSelectedIndex].image"
            :alt="dress.title"
          />
          <ul class="mt-1 flex gap-5 <sm:gap-2">
            <li v-for="(photo, key) in dress.photo" :key="key" class="h-50">
              <NuxtImg
                :src="photo.image"
                placeholder="/img/placeholder.gif"
                class="aspect-square w-full h-full rounded-xl object-cover cursor-pointer"
                @click="photoSelectedIndex = key"
              />
            </li>
          </ul>
        </div>

        <div class="sticky top-0">
          <div class="mt-8 <sm:mt-2 flex justify-between">
            <div class="w-full space-y-2">
              <h1 class="text-xl font-bold sm:text-2xl <sm:text-sm">
                {{ dress.title }}
              </h1>
              <h3 class="text-sm">
                <Categories :categories="dress.category" />
              </h3>
            </div>
          </div>

          <div class="mt-4">
            <div class="prose max-w-none <sm:text-sm">
              {{ dress.description }}
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

            <DressBook v-if="dress" :dress_id="dress.dress_id" />
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
