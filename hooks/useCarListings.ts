// src/hooks/useListings.ts
import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import axios from "@/lib/axios";

type CarListingWithInclude<TInclude extends Prisma.CarListingInclude> = Prisma.CarListingGetPayload<{
  include: TInclude;
}>;

interface UseGetCarListingsOptions<
  TInclude extends Prisma.CarListingInclude,
  TOrderBy extends Prisma.CarListingOrderByWithRelationInput,
> {
  include?: TInclude;
  pageSize?: number;
  orderBy?: TOrderBy;
}

export function useGetCarListings<
  TInclude extends Prisma.CarListingInclude,
  TOrderBy extends Prisma.CarListingOrderByWithRelationInput,
>(options?: UseGetCarListingsOptions<TInclude, TOrderBy>) {
  const { include, pageSize, orderBy } = options || {};

  return useQuery<CarListingWithInclude<TInclude>[], Error>({
    queryKey: ["car_listings", include, pageSize, orderBy],
    queryFn: () =>
      axios
        .get<CarListingWithInclude<TInclude>[]>("/car_listings", {
          params: {
            include: include ? JSON.stringify(include) : undefined,
            pageSize,
            orderBy: orderBy ? JSON.stringify(orderBy) : undefined,
          },
        })
        .then((res) => res.data),
  });
}

export function useGetCarListing<TInclude extends Prisma.CarListingInclude = object>({
  id,
  include,
}: {
  id?: string;
  include?: TInclude;
}) {
  return useQuery<CarListingWithInclude<TInclude>, Error>({
    queryKey: ["car_listing", id, include],
    enabled: Boolean(id),
    queryFn: () =>
      axios
        .get<CarListingWithInclude<TInclude>>(`/car_listings/${id}`, {
          params: { include: include ? JSON.stringify(include) : undefined },
        })
        .then((res) => res.data),
  });
}
