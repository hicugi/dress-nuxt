import { defineStore } from "pinia";

import { useApiFetch } from "~/composables/useApiFetch";

export const useAuthStore = defineStore("auth-store", {
  state: () => ({
    email: "admin@admin.com",
    password: "ygb8o260nm34upvqdjkz",
    errors: [],
    user: null,
  }),
  actions: {
    async login() {
      this.errors = [];
      await useApiFetch("v1/auth/login", {
        method: "post",
        body: {
          email: this.email,
          password: this.password,
        },
      })
        .then(({ data, error }) => {
          useAuthStore().$patch({
            //password: "",
            //email: "",
            user: data.value.data,
          });

          const accessToken = useCookie("access_token");
          accessToken.value = data.value.access_token;
          console.log("accessToken SET", accessToken);
          navigateTo("/ru/sadmin/rent/dress");
        })
        .catch((error) => {
          this.errors = error?.response?.data?.errors || [];
          this.access_token = "";
          this.refresh_token = "";
        });
    },
    logout() {
      if (this.access_token) axios.post("/v1/auth/logout");

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      //localStorage.removeItem('userPermissions')
      this.$reset();
      this.router.push({ name: "login" });
    },
    refresh() {
      if (this.refresh_token) {
        axios
          .post("/v1/auth/refresh", { refresh_token: this.refresh_token })
          .then((resp) => {
            const { access_token, refresh_token, user } = resp.data;
            this.access_token = access_token;
            this.refresh_token = refresh_token;
            this.user = user;

            axios.defaults.headers.common.Authorization = `Bearer ${this.access_token}`;
          })
          .catch(() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            //localStorage.removeItem('userPermissions')
            delete axios.defaults.headers.common.Authorization;
            this.$reset();
            this.router.push({ name: "login" });
          });
      }
    },
    async getAuthUser() {
      if (!this.user) {
        await useApiFetch("/v1/user/auth")
          .then((resp) => {
            this.user = resp.data.data;
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
  },
});
