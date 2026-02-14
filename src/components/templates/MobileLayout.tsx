import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  className?: string;
}

export function MobileLayout({ children, hideNav, className="" }: MobileLayoutProps) {
  return (
    <div className={`min-h-[100dvh] h-[100dvh] overflow-hidden flex flex-col ${className}`}>
      <main className={hideNav ? "" : "pb-24"}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
