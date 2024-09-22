"use client";

import { api } from "@/service/api";
import { Users } from "@/types";
import { deleteCookie, getCookie } from "cookies-next";
import { useEffect } from "react";
import { create } from "zustand";

interface UserStore {
  user: Users | null;
  setUser: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

export const UseAuth = create<UserStore>((set) => ({
  user: null,
  error: null,
  setUser: async () => {
    const token = getCookie("token");
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    if (!token) {
      set({ error: "No token" });
      return;
    }

    try {
      const response = await api.get(
        `/api/users/me?mes=${currentMonth}&ano=${currentYear}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      set({ user: response.data, error: null });
    } catch (error) {
      set({ error: "Invalid token" });
    }
  },
  logout: async () => {
    deleteCookie("token");
    set({ user: null });
  },
}));

export const useUser = () => {
  const { user, setUser, error } = UseAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user === null) {
        await setUser();
      }
    };
    fetchData();
  }, [user, setUser]);

  return { user, error };
};
