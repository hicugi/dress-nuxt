import axios from "axios";

export default () => {
  return axios.create({
    baseURL: useRuntimeConfig().public.NUXT_API_URL,
  });
};
