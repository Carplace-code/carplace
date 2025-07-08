// hooks/useAvailableFilters.ts
import type { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useAvailableFilters(where: Prisma.VersionWhereInput) {
  return useQuery({
    queryKey: ["availableFilters", where],
    queryFn: async () => {
      const res = await axios.post("/api/filters", { where });
      return res.data as {
        brands: string[];
        models: string[];
        years: number[];
        bodyTypes: string[];
      };
    },
    staleTime: 60 * 1000, // cache por 1 min
  });
}
