import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  sender: string;
  avatar: string;
  timestamp: string;
  isCurrentUser?: boolean;
}

export function ChatMessage({
  message,
  sender,
  avatar,
  timestamp,
  isCurrentUser,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-in-bottom",
        isCurrentUser && "flex-row-reverse"
      )}
    >
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img src={avatar} alt={sender} className="w-full h-full object-cover" />
        </div>
      )}

      <div className={cn("max-w-[75%]", isCurrentUser && "text-right")}>
        {!isCurrentUser && (
          <p className="text-xs text-muted-foreground mb-1">{sender}</p>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isCurrentUser
              ? "gradient-primary text-primary-foreground rounded-tr-sm"
              : "bg-secondary rounded-tl-sm"
          )}
        >
          <p className="text-sm">{message}</p>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">{timestamp}</p>
      </div>
    </div>
  );
}
