import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface VersionsGridSkeletonProps {
  count?: number;
}

export default function VersionsGridSkeleton({ count = 8 }: VersionsGridSkeletonProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map(() => (
        <Card key={crypto.randomUUID()} className="overflow-hidden">
          <CardContent className="p-0">
            {/* Image skeleton - aspect-video to match the real card */}
            <Skeleton className="aspect-video w-full" />

            {/* Content skeleton */}
            <div className="space-y-3 p-4">
              {/* Brand name */}
              <Skeleton className="h-3 w-16" />

              {/* Model name */}
              <Skeleton className="h-6 w-3/4" />

              {/* Year and fuel type */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>

              {/* Price section */}
              <div className="space-y-1">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-6 w-24" />
              </div>

              {/* Button */}
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
