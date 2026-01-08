import { Star, ShoppingBag, MapPin, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: string;
  rating: number;
  reviews: number;
  isVerified?: boolean;
  category: string;
  onClick?: () => void;
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image,
  store,
  rating,
  reviews,
  isVerified,
  category,
  onClick,
}: ProductCardProps) {
  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <div
      onClick={onClick}
      className="glass rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
            -{discount}%
          </div>
        )}
        <div className="absolute top-2 right-2 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity">
          <ShoppingBag className="w-4 h-4" />
        </div>
      </div>

      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
          {store}
          {isVerified && <BadgeCheck className="w-3 h-3 text-primary" />}
        </p>
        <h4 className="font-medium text-sm mb-2 line-clamp-2">{name}</h4>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-medium">{rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gradient">
            R$ {price.toFixed(2).replace(".", ",")}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
