import { Trophy, Flame, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankingCardProps {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  streak: number;
  isCurrentUser?: boolean;
}

export function RankingCard({
  rank,
  name,
  avatar,
  points,
  streak,
  isCurrentUser,
}: RankingCardProps) {
  const getRankIcon = () => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-2xl transition-all",
        isCurrentUser
          ? "glass border-primary/50 shadow-glow"
          : "bg-secondary/50 hover:bg-secondary"
      )}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-secondary">
        {getRankIcon()}
      </div>

      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border">
        <img
          src={avatar}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Flame className="w-4 h-4 text-orange-500" />
          <span>{streak} dias seguidos</span>
        </div>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-gradient">{points}</p>
        <p className="text-xs text-muted-foreground">pontos</p>
      </div>
    </div>
  );
}
