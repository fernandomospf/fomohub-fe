import { cn } from "@/lib/utils";
import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  className?: string;
}

export function MobileLayout({ children, hideNav, className="" }: MobileLayoutProps) {
  return (
    <div className={`min-h-[100dvh] h-[100dvh] flex flex-col ${className}`}>
      <main className={cn("flex-1 overflow-y-auto", hideNav ? "" : "pb-24")}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
