import axios, { AxiosError, AxiosHeaders } from "axios";
import { BASE_URL } from "./config";
import { IRequestParam } from "./interface";

axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use(
  async (config) => {
    config.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...config.headers,
    } as AxiosHeaders["headers"];

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function requestProcessor<T>({
  url,
  method,
  data,
  headers,
}: IRequestParam): Promise<T> {
  try {
    const res = await axios<T>({
      url,
      method,
      data,
      headers,
    });
    return res.data;
  } catch (error) {
    let err = error as AxiosError;
    return Promise.reject(
      typeof err.response?.data === "object"
        ? err.response.data
        : { message: err.message }
    );
  }
}
