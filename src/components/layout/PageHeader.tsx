import { ArrowLeft, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface PageHeaderProps {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
  rightElement?: React.ReactNode;
}

export function PageHeader({ title, showBack, showSettings, rightElement }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 glass-strong safe-top">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <Image src="/fomo-logo.png" alt="Fomo Logo" width={60} height={60} />
        </div>
        <div className="flex items-center gap-2">
          {rightElement}
          {showSettings && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate("/settings")}
              className="rounded-full"
            >
              <Settings className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
