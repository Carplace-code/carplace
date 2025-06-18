// src/hooks/useVersions.ts
import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import axios from "@/lib/axios";

type VersionWithInclude<TInclude extends Prisma.VersionInclude> = Prisma.VersionGetPayload<{ include: TInclude }>;

interface Meta {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

/** All the parameters your API supports */
interface UseGetVersionsOptions<
  TInclude extends Prisma.VersionInclude,
  TWhere extends Prisma.VersionWhereInput,
  TOrderBy extends Prisma.VersionOrderByWithRelationInput,
> {
  include?: TInclude;
  where?: TWhere;
  orderBy?: TOrderBy;
  page?: number;
  pageSize?: number;
}

export function useGetVersions<
  TInclude extends Prisma.VersionInclude,
  TWhere extends Prisma.VersionWhereInput,
  TOrderBy extends Prisma.VersionOrderByWithRelationInput,
>(options?: UseGetVersionsOptions<TInclude, TWhere, TOrderBy>) {
  const { include, where, orderBy, page, pageSize } = options || {};

  return useQuery<{ data: VersionWithInclude<TInclude>[]; meta: Meta }, Error>({
    queryKey: ["versions", include, where, orderBy, page, pageSize],
    queryFn: () =>
      axios
        .get<{ data: VersionWithInclude<TInclude>[]; meta: Meta }>("/versions", {
          params: {
            include: include ? JSON.stringify(include) : undefined,
            where: where ? JSON.stringify(where) : undefined,
            orderBy: orderBy ? JSON.stringify(orderBy) : undefined,
            page,
            pageSize,
          },
        })
        .then((res) => res.data),
  });
}
export function useGetVersion<TInclude extends Prisma.VersionInclude = object>({
  id,
  include,
}: {
  id: string;
  include?: TInclude;
}) {
  return useQuery<VersionWithInclude<TInclude>, Error>({
    queryKey: ["version", id, include],
    enabled: Boolean(id),
    queryFn: () =>
      axios
        .get<VersionWithInclude<TInclude>>(`/versions/${id}`, {
          params: {
            include: include ? JSON.stringify(include) : undefined,
          },
        })
        .then((res) => res.data),
  });
}
