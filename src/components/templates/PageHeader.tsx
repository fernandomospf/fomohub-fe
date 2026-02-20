import { ArrowLeft, User, Settings, LogOut, ChevronRight, Circle } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "@/components/atoms/button";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfile";
import { Status } from "../atoms/status";
import { ProfileCircle } from "../atoms/profileCircle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../atoms/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { GeistSans } from "geist/font/sans";
import { removeAccents } from "@/utils/remove_accents";

interface PageHeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

import { useState } from "react";
import { StatusType } from "../atoms/status/type";

export function PageHeader({ title = "", showBack, rightElement }: PageHeaderProps) {
  const router = useRouter();
  const { data: profile } = useProfile();
  const [currentStatus, setCurrentStatus] = useState<StatusType>("online");

  const statusOptions: { value: StatusType; label: string; color: string }[] = [
    { value: "online",  label: "Online",   color: "bg-green-500" },
    { value: "away",    label: "Ausente",  color: "bg-yellow-500" },
    { value: "offline", label: "Offline",  color: "bg-red-500" },
  ];
  return (
    <header className="sticky top-0 z-40 glass-strong safe-top">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <Image src="/fomo-logo.png" alt="Fomo Logo" width={60} height={60} loading="eager" />
          <h1 className="text-lg font-bold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {rightElement}
          {(profile?.avatar_url && router.pathname !== "/profile") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <ProfileCircle picture={profile.avatar_url}>
                    <Status status={currentStatus} />
                  </ProfileCircle>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`w-56 ${GeistSans.className}`} align="end" forceMount>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2">
                    <Circle className={`w-3 h-3 fill-current ${
                      currentStatus === "online" ? "text-green-500" :
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
      </div>
    </header>
  );
}
