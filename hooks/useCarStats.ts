"use client";

import { useEffect, useState } from "react";

import { getCarListingsStats } from "@/lib/actions/stats";

interface CarStats {
  totalListings: number;
  totalBrands: number;
  recentListings: number;
  success: boolean;
}

export function useCarStats() {
  const [stats, setStats] = useState<CarStats>({
    totalListings: 0,
    totalBrands: 0,
    recentListings: 0,
    success: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const result = await getCarListingsStats();
        setStats(result);
      } catch (error) {
        setStats({
          totalListings: 0,
          totalBrands: 0,
          recentListings: 0,
          success: false,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading };
}
