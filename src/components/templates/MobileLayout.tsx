import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export function MobileLayout({ children, hideNav }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className={hideNav ? "" : "pb-24"}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
