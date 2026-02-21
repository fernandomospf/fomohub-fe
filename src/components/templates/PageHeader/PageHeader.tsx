import { ArrowLeft, User, Settings, LogOut, Circle, Bell, Search } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "@/components/atoms/button";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfile";
import { Status } from "../../atoms/status";
import { ProfileCircle } from "../../atoms/profileCircle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../atoms/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { GeistSans } from "geist/font/sans";
import { usePageHeaderStore } from "./store";
import { PageHeaderProps } from "./type";
import { Input } from "@/components/atoms/input";

export function PageHeader({ 
  title = "", 
  showBack, 
  rightElement,
  searchQuery = null,
  setSearchQuery = null,
  placeholder = ""
}: PageHeaderProps) {
  const router = useRouter();
  const { data: profile } = useProfile();
  const { currentStatus, statusOptions, setCurrentStatus } = usePageHeaderStore();

  return (
    <header className="sticky top-0 z-40 glass-strong safe-top md:hidden">
      <div className="flex items-center justify-between h-16 px-4 gap-3">
        <div className="flex items-center gap-2 shrink-0">
          {showBack && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => router.back()}
              className="rounded-full shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          {!showBack && <Image src="/fomo-logo.png" alt="Fomo Logo" width={40} height={40} loading="eager" className="md:hidden shrink-0" />}
          {title && <h1 className="text-lg font-bold truncate max-w-[140px]">{title}</h1>}
        </div>
        
        {
          (searchQuery !== null && setSearchQuery !== null) && (
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 bg-secondary border-0 rounded-xl w-full text-sm"
              />
            </div>
          )
        }

        <div className="flex items-center gap-2 shrink-0">
          {rightElement}
          <DropdownMenu>
            <DropdownMenuContent align="end" className={`w-80 ${GeistSans.className}`}>
              <div className="flex flex-col p-4">
                <h3 className="text-sm font-bold mb-2">Notificações</h3>
                <DropdownMenuSeparator />
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">Sua caixa de mensagens está vazia.</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="md:hidden">
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
        </div>
      </div>
    </header>
  );
}
