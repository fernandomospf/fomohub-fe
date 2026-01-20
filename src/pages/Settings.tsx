import { Moon, Bell, Shield, HelpCircle, Info, ChevronRight } from "lucide-react";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader";
import { Switch } from "@/components/atoms/switch";

const settingsGroups = [
  {
    title: "Aparência",
    items: [
      { icon: Moon, label: "Tema Escuro", type: "switch", defaultValue: true },
    ],
  },
  {
    title: "Notificações",
    items: [
      { icon: Bell, label: "Notificações Push", type: "switch", defaultValue: true },
      { icon: Bell, label: "Lembretes de Treino", type: "switch", defaultValue: true },
    ],
  },
  {
    title: "Privacidade",
    items: [
      { icon: Shield, label: "Perfil Privado", type: "switch", defaultValue: false },
      { icon: Shield, label: "Esconder Progresso", type: "switch", defaultValue: true },
    ],
  },
  {
    title: "Sobre",
    items: [
      { icon: HelpCircle, label: "Ajuda", type: "link" },
      { icon: Info, label: "Sobre o App", type: "link" },
    ],
  },
];

export default function Settings() {
  return (
    <MobileLayout hideNav>
      <PageHeader title="Configurações" showBack />

      <div className="px-4 py-6 space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm text-muted-foreground font-medium mb-3 px-1">
              {group.title}
            </h3>
            <div className="glass rounded-xl overflow-hidden divide-y divide-border">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.type === "switch" && (
                    <Switch defaultChecked={item.defaultValue} />
                  )}
                  {item.type === "link" && (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground">Fomo v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">
            Feito com 💪 para atletas
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
