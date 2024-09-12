"use client";

import { api } from "@/service/api";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import { useEffect } from "react";
import { create } from "zustand";

interface UserStore {
  user: any | null;
  setUser: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export const UseAuth = create<UserStore>((set) => ({
  user: null,
  error: null,
  setUser: async () => {
    const token = getCookie("token");
    if (!token) {
      set({ error: "No token" });
      return;
    }

    try {
      const response = await api.get("/api/users/me", {
        headers: {
          Authorization: `${token}`,
        },
      });
      set({ user: response.data, error: null });
    } catch (error) {
      set({ error: "Invalid token" });
    }
  },
  logout: async () => {
    deleteCookie("token")
    set({ user: null });
  },
}));

export const useUser = () => {
  const { user, setUser, error } = UseAuth();

  useEffect(() => {
    const fetchData = async () => {
      await setUser();
    };
    fetchData();
  }, [setUser, error]);

  return { user, error };
};
