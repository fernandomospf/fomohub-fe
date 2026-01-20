import { Home, Dumbbell, Sparkles, Trophy, MessageCircle, User, ShoppingBag, Calendar, MoreHorizontal } from "lucide-react";
import Link from "next/link"; import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { icon: Home, label: "Início", path: "/" },
  { icon: Dumbbell, label: "Treinos", path: "/workouts" },
  // { icon: Sparkles, label: "IA", path: "/ai-workout" },
  // { icon: Trophy, label: "Ranking", path: "/ranking" },
  // { icon: ShoppingBag, label: "Loja", path: "/marketplace" },
  // { icon: Calendar, label: "Eventos", path: "/events" },
  // { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: User, label: "Perfil", path: "/profile" },
];

export function BottomNav() {
  const { pathname } = useRouter();
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!moreRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!moreRef.current.contains(e.target)) {
        setShowMore(false);
      }
    }

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const MAX_VISIBLE = 5;
  const visibleCount = navItems.length > MAX_VISIBLE ? Math.max(1, MAX_VISIBLE - 1) : navItems.length;
  const visibleItems = navItems.slice(0, visibleCount);
  const overflowItems = navItems.slice(visibleCount);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong safe-bottom">
      <div className="relative">
        <div className="flex items-center justify-around py-2 px-2">
          {visibleItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-xl transition-all duration-200",
                    isActive && "gradient-primary shadow-glow"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-all",
                      isActive && "text-primary-foreground"
                    )}
                  />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          {overflowItems.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-1 py-2 px-3">
              <button
                type="button"
                onClick={() => setShowMore((s) => !s)}
                className={cn(
                  "p-2 rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground",
                  showMore && "text-foreground"
                )}
                aria-expanded={showMore}
                aria-label="Mostrar mais"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-medium">Mais</span>
            </div>
          )}
        </div>

        {overflowItems.length > 0 && showMore && (
          <div ref={moreRef} className="absolute left-1/2 transform -translate-x-1/2 bottom-14 z-50">
            <div ref={moreRef} className="absolute right16 bottom-8 z-50">
              <div className="glass-strong rounded-xl shadow p-2 w-44">
                {overflowItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setShowMore(false)}
                      className={cn(
                        "flex items-center gap-3 py-2 px-3 rounded-md hover:bg-muted/40",
                        isActive ? "text-primary" : "text-foreground"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
