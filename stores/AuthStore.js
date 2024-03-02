import { defineStore } from "pinia";

import useApiCore from "~/composables/useApiCore";

export const useAuthStore = defineStore("auth-store", {
  state: () => ({
    email: "",
    password: "",
    errors: [],
    access_token: process.client
      ? localStorage.getItem("access_token") ?? ""
      : "",
    refresh_token: process.client
      ? localStorage.getItem("refresh_token") ?? ""
      : "",
    user: null,
  }),
  actions: {
    async login() {
      console.log(this.email);
      this.errors = [];
      await $fetch("v1/auth/login", {
        baseURL: useRuntimeConfig().public.NUXT_API_URL,
        method: "post",
        body: {
          email: this.email,
          password: this.password,
        },
      })
        .then((resp) => {
          this.$patch({
            password: "",
            email: "",
            access_token: resp.data.access_token,
            refresh_token: resp.data.refresh_token,
            user: resp.data.user,
          });

          console.log("auth", resp.data);

          if (process.client) {
            localStorage.setItem("access_token", this.access_token);
            localStorage.setItem("refresh_token", this.refresh_token);
          }
          //useRouter().push({ path: "/sadmin/rent/dress" });

          //axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        })
        .catch((error) => {
          this.errors = error?.response?.data?.errors || [];
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("userPermissions");
          //delete axios.defaults.headers.common.Authorization;
        });
    },
    logout() {
      if (this.access_token) axios.post("/v1/auth/logout");

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      //localStorage.removeItem('userPermissions')
      delete axios.defaults.headers.common.Authorization;
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
      if (this.access_token && !this.user) {
        axios.defaults.headers.common.Authorization = `Bearer ${this.access_token}`;
        await axios
          .get("/v1/user/auth")
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
