import { Skeleton } from "@/components/atoms/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="px-4 py-6 space-y-6">

      <div className="glass rounded-2xl p-6 text-center space-y-4">
        <div className="relative w-24 h-24 mx-auto">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-muted animate-pulse" />
        </div>
        <Skeleton className="h-5 w-32 mx-auto" />
        <Skeleton className="h-4 w-40 mx-auto" />
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-7 w-10" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-7 w-10" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-7 w-8" />
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 space-y-3 overflow-hidden">
        <Skeleton className="h-4 w-36" />
        <div className="flex gap-[3px] w-full overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-[3px] flex-1">
              {Array.from({ length: 7 }).map((_, j) => (
                <Skeleton key={j} className="w-full aspect-square rounded-sm" />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl p-4 space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-1 bg-secondary rounded-lg p-1">
          <Skeleton className="h-8 rounded-md" />
          <Skeleton className="h-8 rounded-md opacity-50" />
        </div>

        <div className="glass rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>

        <div className="glass rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-44" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>

        <div className="glass rounded-2xl p-4 flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
    </div>
  );
}
