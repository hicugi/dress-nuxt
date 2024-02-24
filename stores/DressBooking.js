import dayjs from "dayjs";
import { defineStore } from "pinia";

import axios from "~/composables/useApi";
import useApiCore from "~/composables/useApiCore";

export const useDressBooking = defineStore("dress-booking", {
  state: () => ({
    booking: false,
    bookings: [],
    date: "",
    form: {
      dress_id: "",
      quantity: 1,
      email: process.client ? localStorage.getItem("email") ?? "" : "",
      phone_number: process.client
        ? localStorage.getItem("phone_number") ?? ""
        : "",
    },
    success: null,
    errors: [],
    error: [],
    datepikerKey: 0,
  }),
  actions: {
    async getAwaylableDressDates(dress_id) {
      this.form.dress_id = dress_id;
      await useApiCore("v1/client/rent/booking/available", {
        params: { dress_id },
      })
        .then((response) => {
          this.bookings = response.data.value.data;
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },
    getBusyDates(date) {
      const d = dayjs(date).format("YYYY-MM-DD");

      return (
        date < new Date(+new Date() - 1000 * 60 * 60 * 24 * 1) ||
        date > new Date(+new Date() + 1000 * 60 * 60 * 24 * 35) ||
        this.bookings.find(
          (item) => item.date === d && item.booking[0].free < 1
        )
      );
    },
    async changeDate(date) {
      //console.log("xx", date);
    },
    saveBooking(e) {
      e.preventDefault();
      this.errors = [];
      axios()
        .post("/v1/client/rent/booking/save", {
          ...this.form,
          date: this.date ?? "",
        })
        .then((response) => {
          this.$patch({
            booking: response.data.data,
            success: true,
          });
          if (process.client) {
            localStorage.setItem("email", this.form.email);
            localStorage.setItem("phone_number", this.form.phone_number);
          }
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
          if (
            this.errors?.quantity?.includes(
              "dress_booking_save_dress_quantity_less_then_needed"
            )
          ) {
            this.getAwaylableDressDates(this.form.dress_id).then(() => {
              this.$patch({
                datepikerKey: this.datepikerKey++,
                date: "",
              });
            });
          }
        });
    },
  },
});
