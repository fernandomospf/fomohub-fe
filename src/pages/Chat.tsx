import { useState } from "react";
import { Send, Image } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader";
import { ChatMessage } from "@/components/organisms/chat/ChatMessage";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";

const messages = [
  {
    id: 1,
    message: "Alguém tem dica de pré-treino bom?",
    sender: "Carlos",
    avatar: "https://i.pravatar.cc/150?img=1",
    timestamp: "14:32",
    isCurrentUser: false,
  },
  {
    id: 2,
    message: "Eu uso C4, muito bom! Dá uma energia absurda",
    sender: "Ana",
    avatar: "https://i.pravatar.cc/150?img=5",
    timestamp: "14:35",
    isCurrentUser: false,
  },
  {
    id: 3,
    message: "Vou testar, valeu!",
    sender: "Você",
    avatar: "https://i.pravatar.cc/150?img=3",
    timestamp: "14:36",
    isCurrentUser: true,
  },
  {
    id: 4,
    message: "Pessoal, qual o melhor split pra hipertrofia? Tô pensando em fazer PPL",
    sender: "Pedro",
    avatar: "https://i.pravatar.cc/150?img=4",
    timestamp: "14:40",
    isCurrentUser: false,
  },
  {
    id: 5,
    message: "PPL é ótimo! Eu fazia e tive bons resultados. Só não esquece de descansar bem",
    sender: "Maria",
    avatar: "https://i.pravatar.cc/150?img=9",
    timestamp: "14:42",
    isCurrentUser: false,
  },
];

export default function Chat() {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // Handle sending message
    setNewMessage("");
  };

  return (
    <MobileLayout>
      <PageHeader title="Chat Global" />

      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} {...msg} />
          ))}
        </div>

        {/* Input */}
        <div className="p-4 glass-strong border-t border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Image className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="bg-secondary border-0 rounded-full"
            />
            <Button
              variant="gradient"
              size="icon"
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="flex-shrink-0 rounded-full"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
