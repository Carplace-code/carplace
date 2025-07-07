"use client";

import { useAuth } from "@clerk/nextjs";
import type { Metadata } from "next";
import { useEffect } from "react";

import axios from "@/lib/axios";

export const metadata: Metadata = {
  title: "CarPlace",
  description: "Find your next car easily",
};

export default function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    const id = axios.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        // eslint-disable-next-line no-param-reassign
        if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error),
    );

    // eslint-disable-next-line consistent-return
    return () => axios.interceptors.request.eject(id);
  }, [getToken, isLoaded]);

  return children;
}
