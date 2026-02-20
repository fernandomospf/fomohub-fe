import { useState } from "react";
import { Camera, Users, Trophy, Plus } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader/PageHeader";
import { RankingCard } from "@/components/organisms/ranking/RankingCard";
import { Button } from "@/components/atoms/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { cn } from "@/lib/utils";

const rankingData = [
  { rank: 1, name: "Carlos Silva", avatar: "https://i.pravatar.cc/150?img=1", points: 2450, streak: 15 },
  { rank: 2, name: "Ana Oliveira", avatar: "https://i.pravatar.cc/150?img=5", points: 2280, streak: 12 },
  { rank: 3, name: "Você", avatar: "https://i.pravatar.cc/150?img=3", points: 2150, streak: 8, isCurrentUser: true },
  { rank: 4, name: "Pedro Santos", avatar: "https://i.pravatar.cc/150?img=4", points: 1980, streak: 6 },
  { rank: 5, name: "Maria Costa", avatar: "https://i.pravatar.cc/150?img=9", points: 1850, streak: 10 },
];

const groups = [
  { id: 1, name: "Academia Iron", members: 12 },
  { id: 2, name: "Maromba Team", members: 8 },
];

export default function Ranking() {
  const [hasPostedToday, setHasPostedToday] = useState(false);

  return (
    <MobileLayout>
      <PageHeader title="Ranking" />

      <div className="px-4 py-6 space-y-6">
        {/* Post Today's Workout */}
        {!hasPostedToday && (
          <div className="gradient-primary rounded-2xl p-5 shadow-glow relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Camera className="w-6 h-6 text-primary-foreground" />
                <h3 className="font-bold text-primary-foreground">
                  Registre seu treino de hoje!
                </h3>
              </div>
              <p className="text-sm text-primary-foreground/80 mb-4">
                Poste uma foto do seu treino para ganhar pontos e subir no ranking
              </p>
              <Button
                variant="glass"
                className="bg-white/20 hover:bg-white/30 text-primary-foreground"
              >
                <Camera className="w-4 h-4 mr-2" />
                Tirar Foto
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="geral">Ranking Geral</TabsTrigger>
            <TabsTrigger value="grupos">Meus Grupos</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="mt-4 space-y-3">
            {/* Top 3 Podium */}
            <div className="flex items-end justify-center gap-2 mb-6 py-4">
              {/* 2nd Place */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-400 mb-2">
                  <img src={rankingData[1].avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 rounded-t-lg bg-secondary flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">2</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center -mt-4">
                <div className="w-4 h-4 text-yellow-500 mb-1">
                  <Trophy className="w-full h-full" />
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500 mb-2">
                  <img src={rankingData[0].avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-20 h-20 rounded-t-lg gradient-primary flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">1</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-600 mb-2">
                  <img src={rankingData[2].avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-12 rounded-t-lg bg-secondary flex items-center justify-center">
                  <span className="text-2xl font-bold text-amber-600">3</span>
                </div>
              </div>
            </div>

            {/* Full Ranking List */}
            <div className="space-y-2">
              {rankingData.map((user) => (
                <RankingCard key={user.rank} {...user} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="grupos" className="mt-4 space-y-4">
            {/* Create Group */}
            <button className="w-full glass rounded-xl p-4 flex items-center gap-4 border-dashed border-2 border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Criar Novo Grupo</p>
                <p className="text-sm text-muted-foreground">
                  Convide amigos para competir
                </p>
              </div>
            </button>

            {/* Groups List */}
            {groups.map((group) => (
              <div key={group.id} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">{group.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{group.members} membros</span>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Ver Ranking
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
