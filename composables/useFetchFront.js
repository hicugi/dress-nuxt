import { useAuthStore } from "~/stores/AuthStore";

export const useFetchFront = async (url, options = {}) => {
  const config = useRuntimeConfig();
  const accessToken = useCookie("access_token");
  console.log("useCookie accessToken", accessToken.value);
  const { data, error, errors } = await $fetch(url, {
    baseURL: config.public.NUXT_API_URL,
    ...options,
    headers: { Authorization: `Bearer ${accessToken.value}` },
    // onRequest({ request, options }) {
    //   // Set the request headers
    //   if (useAuthStore().access_token) {
    //     options.headers = options.headers || {};
    //     options.headers.authorization = "...";
    //   }
    // },
    onRequestError({ request, options, error }) {
      //console.log("onResponseError", error);
    },
    async onResponseError({ response, options }) {
      //console.log("onResponseError", response, options);
      // if (response.status === 401) {
      //   await useFetch('/auth/refresh', {
      //     baseURL: config.public.apiBaseUrl,
      //     method: 'POST',
      //     server: false,
      //     credentials: 'include',
      //     onResponse({ response }) {
      //       setToken(response._data.token) // store token
      //     },
      //   },
      // }
    },
  })
    .then((response) => {
      return { data: response, error: null, errors: [] };
    })
    .catch(async (error) => {
      // console.log(error);
      // console.log(error.response);
      // console.log(error.data);
      switch (error.response.status) {
        case 400:
          return { data: null, error: null, errors: error.data.errors };
          break;
        case 401:
          await navigateTo({
            name: "auth-login___" + useLangStore().currentLocale,
          });
          return { data: null, error: error.data.error, errors: [] };
          break;
        default:
          return { data: null, error, errors: [] };
      }
    });

  // console.log("=========");
  // console.log("apiCore", url);
  // console.log("data", data);

  return { data, error, errors };

  //   if (error?.value?.data?.error) {
  //     switch (error?.value?.data?.error) {
  //       case "jwt_token_not_received":
  //         navigateTo("/ru/auth/login");
  //         break;
  //       case "jwt_expired_token":
  //         navigateTo("/ru/auth/login");
  //         break;
  //       case "jwt_invalid_token":
  //         navigateTo("/ru/auth/login");
  //         break;
  //       case "jwt_user_not_have_permission_on_resource":
  //         console.log("jwt_user_not_have_permission_on_resource");
  //         break;
  //     }
  //   }

  //   console.log("=========");
  //   console.log("apiCore", url);
  //   console.log("data", data.value);
  //   console.log("error", error);
  //   console.log("=========");
  //   return { data: data.value, error: error.value };
};
