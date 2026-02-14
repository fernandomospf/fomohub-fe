import { useState } from "react";
import { MessageCircle, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/atoms/button";

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isFollowing: boolean;
  isConnected: boolean;
}

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Carlos Silva",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "E aí, bora treinar juntos amanhã?",
    timestamp: "14:32",
    unread: 2,
    isFollowing: true,
    isConnected: true,
  },
  {
    id: 2,
    name: "Ana Costa",
    avatar: "https://i.pravatar.cc/150?img=5",
    lastMessage: "Obrigada pela dica do suplemento!",
    timestamp: "12:15",
    unread: 0,
    isFollowing: true,
    isConnected: true,
  },
  {
    id: 3,
    name: "Pedro Almeida",
    avatar: "https://i.pravatar.cc/150?img=4",
    lastMessage: "Qual sua rotina de pernas?",
    timestamp: "Ontem",
    unread: 1,
    isFollowing: true,
    isConnected: false,
  },
  {
    id: 4,
    name: "Maria Souza",
    avatar: "https://i.pravatar.cc/150?img=9",
    lastMessage: "Vi que você bateu seu recorde!",
    timestamp: "Ontem",
    unread: 0,
    isFollowing: false,
    isConnected: false,
  },
  {
    id: 5,
    name: "Lucas Ferreira",
    avatar: "https://i.pravatar.cc/150?img=7",
    lastMessage: "Tem vaga no seu grupo de treino?",
    timestamp: "2d",
    unread: 0,
    isFollowing: false,
    isConnected: false,
  },
];

export default function DirectMessages() {
  const [localConversations, setLocalConversations] = useState(conversations);

  const handleFollow = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFollowing: true } : c))
    );
  };

  const handleConnect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isConnected: true } : c))
    );
  };

  const getActionButton = (conv: Conversation) => {
    if (conv.isConnected) return null;
    if (!conv.isFollowing) {
      return (
        <Button
          size="sm"
          variant="gradient"
          className="text-xs h-7 px-3 rounded-full"
          onClick={(e) => handleFollow(conv.id, e)}
        >
          Seguir
        </Button>
      );
    }
    return (
      <Button
        size="sm"
        variant="outline"
        className="text-xs h-7 px-3 rounded-full"
        onClick={(e) => handleConnect(conv.id, e)}
      >
        Conectar
      </Button>
    );
  };

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 pb-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          Mensagens
        </h3>
        <span className="text-xs text-muted-foreground">
          {localConversations.filter((c) => c.unread > 0).length} novas
        </span>
      </div>

      <div className="divide-y divide-border/50">
        {localConversations.map((conv) => (
          <div
            key={conv.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden">
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {conv.unread > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {conv.unread}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={cn("text-sm font-medium truncate", conv.unread > 0 && "font-bold")}>
                  {conv.name}
                </p>
                <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                  {conv.timestamp}
                </span>
              </div>
              <p
                className={cn(
                  "text-xs truncate mt-0.5",
                  conv.unread > 0 ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {conv.lastMessage}
              </p>
            </div>

            {getActionButton(conv) || (
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
