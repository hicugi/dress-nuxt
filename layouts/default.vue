<script>
import Header from "./defaultHeader.vue";

export default {
  components: {
    Header,
  },
  data() {
    return {};
  },
};
</script>
<template>
  <div>
    <Header />
    <slot />
  </div>
</template>
