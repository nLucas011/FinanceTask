import axios from "axios";
import { getCookies } from "cookies-next";

export function getAPIClient() {
  const { "token": token } = getCookies();

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (token) {
    api.defaults.headers["Authorization"] = `Bearer ${token}`;
  }

  return api;
}

export const api = getAPIClient();
