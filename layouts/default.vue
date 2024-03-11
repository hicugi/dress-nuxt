<script setup>
import Header from "./defaultHeader.vue";
import { useLangStore } from "~/stores/LangStore.js";
import { useCurrencyStore } from "~/stores/CurrencyStore.js";

useLangStore().loadLanguages();
useCurrencyStore().loadCurrencies();
</script>
<template>
  <div>
    <Header />
    <slot />
  </div>
</template>
