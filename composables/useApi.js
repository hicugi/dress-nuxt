import axios from "axios";

export default () => {
  return axios.create({
    baseURL: process.env.NUXT_API_URL || "http://localhost/api/",
  });
};
