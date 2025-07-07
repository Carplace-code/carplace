import { useQuery } from "@tanstack/react-query";

import axios from "@/lib/axios";

export function useBrandModels() {
  return useQuery<Record<string, string[]>>({
    queryKey: ["brandModels"],
    queryFn: () => axios.get("/brand-models").then((res) => res.data),
  });
}
