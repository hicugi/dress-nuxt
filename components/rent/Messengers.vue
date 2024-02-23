<script setup>
const runtimeConfig = useRuntimeConfig().public.NUXT_PUBLIC_SITE_URL;
const localeRoute = useLocalePath();
const frontURL = runtimeConfig + localeRoute();

const props = defineProps({
  whatsapp: String,
  telegram: String,
});
</script>

<template>
  <div class="text-sm flex <sm:mb-1 justify-center items-center">
    {{ $t("rent.dress_booking_question_to_manager") }}:
    <NuxtLink
      v-if="props.whatsapp"
      :to="`https://wa.me/${props.whatsapp}/?text=${frontURL}%0A${$t(
        'rent.dress_booking_i_have_question'
      )}`"
      target="_blank"
      class="hover"
    >
      <NuxtImg width="20" class="ml-2" src="/icons8-whatsapp.svg" />
    </NuxtLink>

    <NuxtLink
      v-if="props.telegram"
      :to="`https://t.me/${props.telegram}`"
      target="_blank"
      class="hover"
    >
      <NuxtImg width="22" class="ml-2" src="/icons8-telegram.svg" />
    </NuxtLink>
  </div>
</template>
