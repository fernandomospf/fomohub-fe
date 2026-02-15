import { useState } from "react";
import { useRouter } from "next/router";
import { CalendarIcon, MapPin, Clock, Image, Users, DollarSign } from "lucide-react";
import { MobileLayout } from "../../src/components/templates/MobileLayout";
import { PageHeader } from "../../src/components/templates/PageHeader";
import { Button } from "../../src/components/atoms/button";
import { Input } from "../../src/components/atoms/input";
import { Textarea } from "../../src/components/atoms/textarea";
import { Label } from "../../src/components/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/atoms/select";
import { Switch } from "../../src/components/atoms/switch";
import { toast } from "../../src/hooks/use-toast";

const categories = [
  { value: "catraca", label: "Catraca Livre" },
  { value: "degustacao", label: "Degustação" },
  { value: "corrida", label: "Corrida" },
  { value: "trilha", label: "Trilha" },
];

export default function CreateEvent() {
  const router = useRouter();
  const [isFree, setIsFree] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Evento criado!", description: "Seu evento foi publicado com sucesso." });
    router.push("/events");
  };

  return (
    <MobileLayout hideNav>
      <PageHeader title="Criar Evento" showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Image Upload */}
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">
            Imagem do Evento
          </Label>
          <label
            htmlFor="event-image"
            className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-border bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Image className="w-8 h-8" />
                <span className="text-sm font-medium">Toque para adicionar imagem</span>
              </div>
            )}
            <input
              id="event-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-muted-foreground text-xs uppercase tracking-wider">
            Título do Evento
          </Label>
          <Input
            id="title"
            placeholder="Ex: Corrida Noturna SP - 5km"
            required
            className="h-12 bg-secondary border-0 rounded-xl"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">
            Categoria
          </Label>
          <Select required>
            <SelectTrigger className="h-12 bg-secondary border-0 rounded-xl">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-muted-foreground text-xs uppercase tracking-wider">
            Descrição
          </Label>
          <Textarea
            id="description"
            placeholder="Descreva os detalhes do evento..."
            className="bg-secondary border-0 rounded-xl min-h-[100px] resize-none"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" /> Data
            </Label>
            <Input
              id="date"
              type="date"
              required
              className="h-12 bg-secondary border-0 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Horário
            </Label>
            <Input
              id="time"
              type="time"
              required
              className="h-12 bg-secondary border-0 rounded-xl"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Local
          </Label>
          <Input
            id="location"
            placeholder="Ex: Parque Ibirapuera"
            required
            className="h-12 bg-secondary border-0 rounded-xl"
          />
        </div>

        {/* Max Participants */}
        <div className="space-y-2">
          <Label htmlFor="max-participants" className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Máx. Participantes
          </Label>
          <Input
            id="max-participants"
            type="number"
            placeholder="Ilimitado"
            className="h-12 bg-secondary border-0 rounded-xl"
          />
        </div>

        {/* Free / Paid Toggle */}
        <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Evento Gratuito</p>
              <p className="text-xs text-muted-foreground">
                {isFree ? "Sem custo para participantes" : "Defina o valor abaixo"}
              </p>
            </div>
          </div>
          <Switch checked={isFree} onCheckedChange={setIsFree} />
        </div>

        {!isFree && (
          <div className="space-y-2">
            <Label htmlFor="price" className="text-muted-foreground text-xs uppercase tracking-wider">
              Valor (R$)
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="0,00"
              className="h-12 bg-secondary border-0 rounded-xl"
            />
          </div>
        )}

        {/* Submit */}
        <Button type="submit" variant="gradient" size="lg" className="w-full rounded-xl">
          Publicar Evento
        </Button>
      </form>
    </MobileLayout>
  );
}
