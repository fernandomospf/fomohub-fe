import { Skeleton } from "@/components/atoms/skeleton";

export function IndexSkeleton() {
  return (
    <div className="px-4 py-6 space-y-4">

      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-20 blur-3xl" />
        <div className="relative z-10 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-52" />
          <div className="space-y-2 pb-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-44" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-3 flex flex-col items-center gap-2">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="w-14 h-14 rounded-xl" />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>

      <Skeleton className="h-4 w-56" />

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
