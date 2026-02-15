import { useState } from "react";
import { Send, Image, MessageCircle } from "lucide-react";
import { useRouter } from "next/router";

import { MobileLayout } from "../src/components/templates/MobileLayout";
import { PageHeader } from "../src/components/templates/PageHeader";
import { ChatMessage } from "../src/components/organisms/ChatMessage.tsx";
import { DirectMessages } from "../src/components/organisms/DirectMessages.tsx";
import { Button } from "../src/components/atoms/button";
import { Input } from "../src/components/atoms/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../src/components/atoms/tabs";

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
  const router = useRouter();

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  const handleSelectConversation = (conv: { id: number; name: string; avatar: string }) => {
    router.push({
      pathname: `/chat/${conv.id}`,
      query: {
        name: conv.name,
        avatar: conv.avatar,
      },
    });
  };

  return (
    <MobileLayout className="h-[100dvh] overflow-hidden">
      <PageHeader />

      <Tabs defaultValue="diretas" className="flex flex-col">
        <div className="px-4 pt-2 pb-3">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="diretas" className="gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              Mensagens
            </TabsTrigger>
            <TabsTrigger value="global" className="gap-1.5">
              Chat Global
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="diretas" className="mt-0">
          <DirectMessages onSelectConversation={handleSelectConversation} />
        </TabsContent>

        <TabsContent value="global" className="mt-0 flex flex-col h-[calc(100dvh-10rem)] overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} {...msg} />
            ))}
          </div>

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
        </TabsContent>
      </Tabs>
    </MobileLayout>
  );
}
