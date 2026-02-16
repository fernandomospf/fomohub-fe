export function WorkoutCardSkeleton() {
  return (
    <div className="w-full rounded-2xl bg-zinc-900 p-4 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-zinc-800" />
          <div className="h-6 w-20 rounded-full bg-zinc-800" />
        </div>

        <div className="flex items-center gap-4">
          <div className="h-5 w-5 rounded bg-zinc-800" />
          <div className="h-5 w-10 rounded-full bg-zinc-800" />
        </div>
      </div>

      <div className="h-6 w-3/4 rounded bg-zinc-800 mb-3" />

      <div className="flex gap-4 mb-4">
        <div className="h-4 w-20 rounded bg-zinc-800" />
        <div className="h-4 w-16 rounded bg-zinc-800" />
        <div className="h-4 w-24 rounded bg-zinc-800" />
      </div>

      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-zinc-800" />
        <div className="h-10 w-10 rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}
