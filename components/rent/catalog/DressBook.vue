<script>
import { useDressBooking } from "~/stores/DressBooking";
import { mapActions, mapState, mapWritableState } from "pinia";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import FormErrors from "~/components/FormErrors.vue";

export default {
  components: {
    FormErrors,
    VueTailwindDatepicker,
  },
  props: {
    dress_id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      frontURL: useRuntimeConfig().public.NUXT_PUBLIC_SITE_URL,
    };
  },
  async mounted() {
    await this.getAwaylableDressDates(this.dress_id);
  },
  methods: {
    ...mapActions(useDressBooking, [
      "getAwaylableDressDates",
      "getBusyDates",
      "changeDate",
      "saveBooking",
    ]),
  },
  computed: {
    ...mapState(useDressBooking, [
      "form",
      "date",
      "bookings",
      "success",
      "errors",
      "booking",
      "datepikerKey",
    ]),
    ...mapWritableState(useDressBooking, ["date"]),
  },
};
</script>

<template>
  <div v-if="success" class="text-green-500 text-sm">
    {{ $t("rent.dress_booking_save_success") }}
    {{ $t("rent.dress_booking_save_success_send_to_messenger") }}:
    <div class="block">
      <br />
      <a
        :href="
          'https://wa.me/' +
          booking.dress.user.phone +
          '/' +
          `?text=${frontURL}/${useI18n()?.locale?.value}/dress/${dress_id}%0A` +
          `booking_id: ${booking.booking_id}%0A` +
          `date: ${booking.date}%0A` +
          `email: ${booking.email}%0A` +
          `mobile: ${booking.phone_number}`
        "
        target="_blank"
        class="rounded bg-green-600 px-5 py-3 text-white hover:bg-green-500 text-sm"
      >
        {{ $t("rent.dress_booking_save_success_send_to_messenger_button") }}
      </a>
    </div>
  </div>
  <div v-else="success">
    <div class="mb-3 text-sm">{{ $t("rent.dress_booking_form_title") }}:</div>
    <FormErrors :error="errors.dress_id" />

    <div class="mt-5 text-sm">
      <FormErrors :error="errors.quantity" />
      {{ $t("rent.dress_booking_quantity") }}:
      <input
        v-model="form.quantity"
        type="number"
        name="quantity"
        id="quantity"
        class="w-16 p-2 rounded-md border-1 bg-gray-0 border-gray-300 text-gray-900 text-sm w-half hover:bg-gray-50 hover:text-gray-700 focus:bg-gray-50"
        :placeholder="$t('rent.dress_booking_quantity')"
        required=""
        min="1"
        max="100"
      />
      {{ $t("rent.dress_booking_quantity_available") }}:
      <span :class="date ? 'text-green-500' : 'text-red-500'">
        {{
          this.date
            ? this.bookings.find((item) => item.date === this.date)?.booking[0]
                .free || 0
            : $t("rent.dress_booking_quantity_select_date")
        }}
      </span>
    </div>

    <div class="mt-5">
      <FormErrors :error="errors.date" />
      <VueTailwindDatepicker
        no-input
        as-single
        :key="datepikerKey"
        v-model="date"
        :disable-date="getBusyDates"
        :formatter="{ date: 'YYYY-MM-DD', month: 'MMM' }"
        :i18n="useI18n()?.locale?.value || 'en'"
      />
    </div>

    <div class="mt-5">
      <FormErrors :error="errors.email" />
      <div class="mb-2">
        <input
          v-model="form.email"
          type="text"
          name="email"
          id="email"
          class="block p-2 w-70 rounded-md border-1 bg-gray-0 border-gray-300 text-gray-900 text-sm w-half hover:bg-gray-50 hover:text-gray-700 focus:bg-gray-50"
          :placeholder="$t('rent.dress_booking_enter_email')"
          required
        />
      </div>

      <FormErrors :error="errors.phone_number" />
      <div class="mb-2">
        <input
          v-model="form.phone_number"
          type="tel"
          name="phone_number"
          id="phone_number"
          class="block p-2 w-70 rounded-md border-1 bg-gray-0 border-gray-300 text-gray-900 text-sm w-half hover:bg-gray-50 hover:text-gray-700 focus:bg-gray-50"
          :placeholder="$t('rent.dress_booking_enter_phone_number')"
          required
        />
      </div>
    </div>
    <div class="mt-5 <sm:mt-4 flex gap-4 <sm:justify-center">
      <button
        type="submit"
        class="block rounded bg-green-600 px-5 py-3 text-white hover:bg-green-500"
        @click="this.saveBooking"
      >
        {{ $t("rent.dress_booking_button_title") }}
      </button>
    </div>
  </div>
</template>

<style>
.disabled\:text-vtd-secondary-500:disabled {
  background: rgb(185, 96, 96) !important;
  /* text-decoration: line-through; */
  color: white !important;
}
/* .text-vtd-secondary-500 {
  background: green !important;
} */
</style>
