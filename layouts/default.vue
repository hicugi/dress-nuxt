<script>
import { mapActions } from "pinia";
import Header from "./defaultHeader.vue";
import { useLangStore } from "~/stores/LangStore.js";

export default {
  components: {
    Header,
  },
  data() {
    return {};
  },
  created() {
    this.loadLanguages();
  },
  methods: {
    ...mapActions(useLangStore, ["loadLanguages", "setLocale"]),
  },
};
</script>
<template>
  <div>
    <Header />
    <slot />
  </div>
</template>
