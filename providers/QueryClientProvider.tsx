"use client";

import { QueryClientProvider as BaseQueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient();

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseQueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </BaseQueryClientProvider>
  );
}
