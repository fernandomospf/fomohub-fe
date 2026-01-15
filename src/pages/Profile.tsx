import { useState } from "react";
import { Scale, Ruler, TrendingUp, Plus, Lock, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressCard } from "@/components/progress/ProgressCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const progressData = {
  weight: { current: "78.5", change: -1.5 },
  bodyFat: { current: "15", change: -2 },
  muscle: { current: "35.2", change: 1.8 },
};

const measurements = [
  { label: "Peito", value: "105", change: 2 },
  { label: "Braço D", value: "38", change: 1.5 },
  { label: "Braço E", value: "37.5", change: 1 },
  { label: "Cintura", value: "82", change: -3 },
  { label: "Coxa D", value: "60", change: 2 },
  { label: "Coxa E", value: "59", change: 1.5 },
];

const clearSession = () => {
  localStorage.removeItem('sb-vwovflogqhbhqwrkjbch-auth-token');
}

export default function Profile() {
  return (
    <MobileLayout>
      <PageHeader title="Perfil" showSettings />

      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="glass rounded-2xl p-6 text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary/30">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold mb-1">Atleta</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Membro desde Jan 2024
          </p>
          <div className="flex items-center justify-center gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gradient">156</p>
              <p className="text-xs text-muted-foreground">Treinos</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="text-2xl font-bold text-gradient">12</p>
              <p className="text-xs text-muted-foreground">Streak</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="text-2xl font-bold text-gradient">#3</p>
              <p className="text-xs text-muted-foreground">Ranking</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="progresso" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger value="progresso">Progresso</TabsTrigger>
            <TabsTrigger value="medidas">Medidas</TabsTrigger>
          </TabsList>

          <TabsContent value="progresso" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Dados Privados
              </h3>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Registrar
              </Button>
            </div>

            <ProgressCard
              label="Peso Atual"
              value={progressData.weight.current}
              unit="kg"
              change={progressData.weight.change}
              icon={<Scale className="w-4 h-4 text-primary-foreground" />}
            />

            <ProgressCard
              label="Gordura Corporal"
              value={progressData.bodyFat.current}
              unit="%"
              change={progressData.bodyFat.change}
              icon={<TrendingUp className="w-4 h-4 text-primary-foreground" />}
            />

            <ProgressCard
              label="Massa Muscular"
              value={progressData.muscle.current}
              unit="kg"
              change={progressData.muscle.change}
              icon={<Ruler className="w-4 h-4 text-primary-foreground" />}
            />
          </TabsContent>

          <TabsContent value="medidas" className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Medidas Corporais
              </h3>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Registrar
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {measurements.map((m) => (
                <div key={m.label} className="glass rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                  <p className="text-xl font-bold">{m.value} cm</p>
                  <p className={`text-xs ${m.change > 0 ? "text-success" : "text-destructive"}`}>
                    {m.change > 0 ? "+" : ""}{m.change} cm
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Link to="/settings">
            <Button variant="secondary" className="w-full justify-start">
              <Settings className="w-5 h-5 mr-3" />
              Configurações
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={clearSession}>
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
}
