import { useState } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { CalendarIcon, MapPin, Clock, Image, Users, DollarSign, Loader2 } from "lucide-react";
import { MobileLayout } from "../../src/components/templates/MobileLayout";
import { PageHeader } from "../../src/components/templates/PageHeader";
import { Button } from "../../src/components/atoms/button";
import { Input } from "../../src/components/atoms/input";
import { Textarea } from "../../src/components/atoms/textarea";
import { Label } from "../../src/components/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/atoms/select";
import { Switch } from "../../src/components/atoms/switch";
import { toast } from "../../src/hooks/use-toast";
import { eventsService } from "../../src/infra/container";
import { CreateEventDto } from "../../src/api/Events/types";
import { supabase } from "../../src/lib/supabase";

const categories = [
  { value: "catraca", label: "Catraca Livre" },
  { value: "degustacao", label: "Degustação" },
  { value: "corrida", label: "Corrida" },
  { value: "trilha", label: "Trilha" },
];

type FormData = Omit<CreateEventDto, "event_date"> & {
  date: string;
  time: string;
};

export default function CreateEvent() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: {
      is_free: true,
    },
  });

  const is_free = watch("is_free");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    try {
      setIsUploading(true);
      const ext = file.name.split(".").pop() ?? "webp";
      const fileName = `events/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("events")
        .upload(fileName, file, { contentType: file.type, upsert: false });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("events")
        .getPublicUrl(fileName);

      setImageUrl(publicData.publicUrl);
    } catch (err: any) {
      console.error("Erro ao fazer upload:", err);
      setImageUrl(null);
      setImagePreview(null);

      const isRLS = err?.message?.toLowerCase().includes("row-level security") ||
        err?.message?.toLowerCase().includes("policy") ||
        err?.statusCode === "403";

      toast({
        title: "Não foi possível enviar a imagem",
        description: isRLS
          ? "Sem permissão para fazer upload. Você pode criar o evento sem imagem."
          : "Tente novamente ou crie o evento sem imagem.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const event_date = data.date && data.time
        ? new Date(`${data.date}T${data.time}:00`).toISOString()
        : new Date(`${data.date}T00:00:00`).toISOString();

      const payload: CreateEventDto = {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        event_date,
        is_free: data.is_free,
        image_url: imageUrl ?? undefined,
        max_participants: data.max_participants ? Number(data.max_participants) : undefined,
        price: !data.is_free && data.price ? Number(data.price) : undefined,
      };

      await eventsService.create(payload);
      toast({ title: "Evento criado!", description: "Seu evento foi publicado com sucesso." });
      router.push("/events");
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      toast({ title: "Erro", description: "Não foi possível criar o evento. Tente novamente.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MobileLayout hideNav>
      <PageHeader title="Criar Evento" showBack />

      <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-6 space-y-6">
        <div>
          <Label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">
            Imagem do Evento
          </Label>
          <label
            htmlFor="event-image"
            className="flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-border bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors overflow-hidden"
          >
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                {isUploading && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
                {!isUploading && imageUrl && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-success text-success-foreground text-xs font-semibold">
                    ✓ Upload ok
                  </div>
                )}
              </div>
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

        <div className="space-y-2">
          <Label htmlFor="title" className="text-muted-foreground text-xs uppercase tracking-wider">
            Título do Evento
          </Label>
          <Input
            id="title"
            placeholder="Ex: Corrida Noturna SP - 5km"
            className="h-12 bg-secondary border-0 rounded-xl"
            {...register("title", { required: true })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs uppercase tracking-wider">
            Categoria
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-muted-foreground text-xs uppercase tracking-wider">
            Descrição
          </Label>
          <Textarea
            id="description"
            placeholder="Descreva os detalhes do evento..."
            className="bg-secondary border-0 rounded-xl min-h-[100px] resize-none"
            {...register("description")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" /> Data
            </Label>
            <Input
              id="date"
              type="date"
              className="h-12 bg-secondary border-0 rounded-xl"
              {...register("date", { required: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Horário
            </Label>
            <Input
              id="time"
              type="time"
              className="h-12 bg-secondary border-0 rounded-xl"
              {...register("time")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Local
          </Label>
          <Input
            id="location"
            placeholder="Ex: Parque Ibirapuera"
            className="h-12 bg-secondary border-0 rounded-xl"
            {...register("location")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_participants" className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Máx. Participantes
          </Label>
          <Input
            id="max_participants"
            type="number"
            placeholder="Ilimitado"
            className="h-12 bg-secondary border-0 rounded-xl"
            {...register("max_participants")}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Evento Gratuito</p>
              <p className="text-xs text-muted-foreground">
                {is_free ? "Sem custo para participantes" : "Defina o valor abaixo"}
              </p>
            </div>
          </div>
          <Controller
            name="is_free"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>

        {!is_free && (
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
              {...register("price")}
            />
          </div>
        )}

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full rounded-xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publicando..." : "Publicar Evento"}
        </Button>
      </form>
    </MobileLayout>
  );
}
