<script>
import { mapActions, mapState } from "pinia";
import { useLangStore } from "~/stores/LangStore.js";
import { useCurrencyStore } from "~/stores/CurrencyStore.js";
import DropDown from "~/components/DropDown.vue";

export default {
  components: {
    DropDown,
  },
  data() {
    return {
      hiddenItems: true,
    };
  },
  async created() {
    useHead({
      htmlAttrs: {
        lang: useI18n()?.locale?.value,
      },
      link: [
        {
          rel: "icon",
          type: "image/ico",
          href: "/favicon.ico",
        },
      ],
    });
    this.loadCurrencies();
  },
  methods: {
    ...mapActions(useLangStore, ["setLocale"]),
    ...mapActions(useCurrencyStore, ["loadCurrencies", "setCurrency"]),
  },
  computed: {
    ...mapState(useLangStore, ["languages", "currentLang"]),
    ...mapState(useCurrencyStore, ["currencies", "currentCurrency"]),
  },
};
</script>

<template>
  <!-- take from https://flowbite.com/blocks/marketing/header/ -->
  <header class="container px-5 py-3 <sm:py-3 mx-auto">
    <nav>
      <div class="flex flex-wrap justify-between items-center mx-auto">
        <NuxtLink
          :to="
            localePath({
              name: 'rent',
            })
          "
          class="flex items-center"
        >
          <NuxtImg
            src="/logo.svg"
            class="h-12 <sm:h-7"
            :alt="$t('rent.common_title')"
          />
        </NuxtLink>
        <div class="flex items-center lg:order-2">
          <!-- <DropDown
            v-if="currentCurrency"
            :items="currencies"
            :init-item="currentCurrency"
            :change="setCurrency"
            index="code"
            :currencyCode="currentCurrency.code"
            class="mr-2 mt-2 xs:hidden"
          /> -->

          <DropDown
            v-if="currentLang"
            :items="languages"
            :init-item="currentLang"
            :change="setLocale"
            index="code"
            class="mt-2"
          />

          <!-- <a
            href="#"
            class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
            >Log in</a
          > -->
          <!-- <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            :class="{ 'focus:ring-0': hiddenItems }"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
            @click="hiddenItems = !hiddenItems"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <svg
              class="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button> -->
        </div>
      </div>
    </nav>
  </header>
</template>
