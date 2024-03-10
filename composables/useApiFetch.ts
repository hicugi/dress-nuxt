import { defu } from "defu";

import type { UseFetchOptions } from "#app";

export async function useApiFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  const accessToken = useCookie("access_token");
  //console.log("useCookie accessToken", accessToken.value);
  const config = useRuntimeConfig();

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.NUXT_API_URL,
    key: url,
    initialCache: false,

    // set user token if connected
    headers: accessToken.value
      ? {
          Authorization: `Bearer ${accessToken.value}`,
          //...useRequestHeaders(["referer", "coockie"]),
        }
      : {},
    //credentials: "include",

    onResponse(_ctx) {
      // _ctx.response._data = new myBusinessResponse(_ctx.response._data)
    },

    onResponseError(_ctx) {
      //console.log("_ctx", _ctx);
      // throw new myBusinessError()
    },
  };

  // for nice deep defaults, please use unjs/defu
  const params = defu(options, defaults);

  let errors = [];
  const { data, error, status } = await useFetch(url, params);

  console.log("=========");
  console.log("apiCore", url, "status", status.value);
  console.log("data", data.value);
  console.log("error", error?.value?.data?.error);
  console.log("error", error.value ? error : error.value);

  if (status.value !== "success" && error.value) {
    console.log(error.value.statusCode);
    switch (error.value.statusCode) {
      case 400:
        errors = error.value.data.errors;
        break;

      case 401:
        //case 419:
        //const authStore = useAuthStore();
        //authStore.user = null;
        await navigateTo({
          name: "auth-login___" + useLangStore().currentLocale,
        });
        break;
    }

    // if (error?.value?.data?.error) {
    //   switch (error?.value?.data?.error) {
    //     case "jwt_token_not_received":
    //       navigateTo("/ru/auth/login");
    //       break;
    //     case "jwt_expired_token":
    //       console.log("xxxx");
    //       navigateTo({ path: "/" });
    //       useRouter().push({ path: "/" });
    //       console.log("xxxx");
    //       break;
    //     case "jwt_invalid_token":
    //       navigateTo("/ru/auth/login");
    //       break;
    //     case "jwt_user_not_have_permission_on_resource":
    //       console.log("jwt_user_not_have_permission_on_resource");
    //       break;
    //   }
    // }
    console.log("=========");
  }
  return { data: data.value, error: error.value, status, errors };
}
