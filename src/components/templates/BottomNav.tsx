"use client";

import {
  Home,
  Dumbbell,
  Trophy,
  User,
  ShoppingBag,
  Calendar,
  MoreHorizontal,
  ChartArea,
  Circle,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useProfile } from "@/hooks/useProfile";
import { Status } from "@/components/atoms/status";
import { ProfileCircle } from "@/components/atoms/profileCircle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { GeistSans } from "geist/font/sans";
import { usePageHeaderStore } from "./PageHeader/store";
import { Button } from "@/components/atoms/button";

const navItems = [
  { icon: Home, label: "Feed", path: "/" },
  { icon: Dumbbell, label: "Treinos", path: "/workouts" },
  // { icon: Trophy, label: "Ranking", path: "/ranking" },
  // { icon: ShoppingBag, label: "Loja", path: "/marketplace" },
  { icon: Calendar, label: "Eventos", path: "/events" },
  // { icon: User, label: "Perfil", path: "/profile" },
];

export function BottomNav({ onboardingCompleted }: { onboardingCompleted?: boolean }) {
  const router = useRouter();
  const pathname = router.pathname;
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  const { data: profile } = useProfile();
  const { currentStatus, statusOptions, setCurrentStatus } = usePageHeaderStore();

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
  const visibleCount =
    navItems.length > MAX_VISIBLE ? Math.max(1, MAX_VISIBLE - 1) : navItems.length;

  const visibleItems = navItems.slice(0, visibleCount);
  const overflowItems = navItems.slice(visibleCount);

  const isActivePath = (path: string) => {
    if (typeof pathname !== "string") return false;
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  };

  return onboardingCompleted ? (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong safe-bottom md:top-0 md:bottom-auto md:w-64 md:h-[100dvh] md:border-r md:border-white/10 md:bg-background/95 md:backdrop-blur-xl md:p-6 md:flex md:flex-col md:justify-between">
      <div className="relative md:flex-1 md:flex md:flex-col">
        {/* Desktop Logo */}
        <div className="hidden md:flex items-center justify-between mb-10 px-2">
          <Image src="/fomo-logo.png" alt="Fomo Logo" width={40} height={40} loading="eager" className="rounded-xl" />

          {(profile?.avatar_url && router.pathname !== "/profile") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 group">
                  <ProfileCircle picture={profile.avatar_url}>
                    <Status status={currentStatus} />
                  </ProfileCircle>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`w-56 ${GeistSans.className} mt-2`} align="end" forceMount>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2">
                    <Circle className={`w-3 h-3 fill-current ${currentStatus === "online" ? "text-green-500" :
                        currentStatus === "away" ? "text-yellow-500" : "text-red-500"
                      }`} />
                    <span>Status</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {statusOptions.map((opt) => (
                      <DropdownMenuItem
                        key={opt.value}
                        className="gap-2 cursor-pointer"
                        onClick={() => setCurrentStatus(opt.value)}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${opt.color}`} />
                        <span>{opt.label}</span>
                        {currentStatus === opt.value && (
                          <span className="ml-auto text-xs opacity-60">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/login");
                  }}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center justify-around py-2 px-2 md:flex-col md:justify-start md:items-stretch md:gap-2 md:p-0">
          {visibleItems.map((item) => {
            const isActive = isActivePath(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 group",
                  "md:flex-row-reverse md:justify-end md:gap-4 md:py-3 md:px-4",
                  isActive
                    ? "text-primary md:text-primary-foreground md:gradient-primary md:shadow-glow"
                    : "text-muted-foreground hover:text-foreground md:hover:bg-muted/50"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-xl transition-all duration-200",
                    "md:p-0 md:bg-transparent md:shadow-none",
                    isActive && "gradient-primary shadow-glow md:!bg-transparent md:!shadow-none"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-all group-hover:scale-110",
                      isActive && "text-primary-foreground"
                    )}
                  />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-all group-hover:font-semibold flex-1",
                  "md:text-sm md:text-right",
                  isActive && "md:font-bold"
                )}>{item.label}</span>
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
          <div
            ref={moreRef}
            className="absolute left-1/2 -translate-x-1/2 bottom-14 z-50"
          >
            <div className="glass-strong rounded-xl shadow p-2 w-44">
              {overflowItems.map((item) => {
                const isActive = isActivePath(item.path);

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
        )}

      </div>
    </nav>) : null
}
