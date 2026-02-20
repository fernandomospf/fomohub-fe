import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { Button } from "@/components/atoms/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FitnessData } from "@/types/user";
import { profileService } from "@/infra/container";
import Link from "next/link";
import { Status } from "../atoms/status";
import { ProfileCircle } from "../atoms/profileCircle";

interface PageHeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function PageHeader({ title = "", showBack, rightElement }: PageHeaderProps) {
  const [profile, setProfile] = useState<FitnessData | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchProfile = async () => {

      try {
        const userData = await profileService.dataProfile();
        setProfile(userData as unknown as FitnessData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, [])

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
            <Link href="/profile">
              <ProfileCircle picture={profile.avatar_url}>
                <Status status="online" />
              </ProfileCircle>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
