import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  className?: string;
  onboardingCompleted?: boolean;
  loading?: boolean;
}

export const MobileLayout = forwardRef<HTMLDivElement, MobileLayoutProps>(
  ({ children, hideNav, className = "", onboardingCompleted, loading }, ref) => {
    return (
      <div className={`min-h-[100dvh] h-[100dvh] flex flex-col ${className}`}>
        <main
          ref={ref}
          className={cn("flex-1 overflow-y-auto", hideNav ? "" : "pb-24 md:pb-0 md:pl-64")}
        >
          {children}
        </main>
        {!hideNav && <BottomNav onboardingCompleted={onboardingCompleted} loading={loading} />}
      </div>
    );
  }
);

MobileLayout.displayName = "MobileLayout";
