import { Star, Calendar, Clock, MessageSquare, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProfessionalCardProps {
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  reviews: number;
  price: number;
  experience: string;
  isVerified?: boolean;
  isAvailable?: boolean;
  onClick?: () => void;
  onBook?: () => void;
}

export function ProfessionalCard({
  name,
  avatar,
  specialty,
  rating,
  reviews,
  price,
  experience,
  isVerified,
  isAvailable,
  onClick,
  onBook,
}: ProfessionalCardProps) {
  return (
    <div className="glass rounded-2xl p-4 transition-all duration-300 hover:shadow-glow">
      <div className="flex gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-xl overflow-hidden">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          {isAvailable && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-success border-2 border-card" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold">{name}</h4>
            {isVerified && <BadgeCheck className="w-4 h-4 text-primary" />}
          </div>
          <p className="text-sm text-primary font-medium mb-1">{specialty}</p>
          <p className="text-xs text-muted-foreground">{experience} de experiência</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">por consulta</p>
          <p className="text-lg font-bold text-gradient">
            R$ {price.toFixed(2).replace(".", ",")}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="secondary" size="sm" className="flex-1" onClick={onClick}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Ver Perfil
        </Button>
        <Button variant="gradient" size="sm" className="flex-1" onClick={onBook}>
          <Calendar className="w-4 h-4 mr-2" />
          Agendar
        </Button>
      </div>
    </div>
  );
}
