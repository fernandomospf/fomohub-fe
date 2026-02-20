import { useEffect, useRef, useState } from "react";
import {
  Scale,
  Plus,
  Lock,
  LogOut,
  CircleGauge,
  ChevronUp,
  ChevronDown,
  Pencil,
  TriangleAlert
} from "lucide-react";
import Link from "next/link";
import { MobileLayout } from "@/components/templates/MobileLayout";
import { PageHeader } from "@/components/templates/PageHeader";
import { ProgressCard } from "@/components/organisms/progress/ProgressCard";
import { Button } from "@/components/atoms/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { profileService } from "@/infra/container";
import { FitnessData, Measurements } from "@/types/user";
import { ProfileSkeleton } from "@/components/organisms/ProfileSkeleton";
import { format_date } from "@/utils/moth_mapper";
import { measureMapper } from "@/utils/measure_mapper";
import { uploadAvatar } from "@/service/avatar";
import { supabase } from "@/lib/supabase";
import Cropper from "react-easy-crop";
import { removeAccents } from "@/utils/remove_accents";
import { measurementService } from "@/infra/container";
import { LastTrainingResponse } from "@/api/Profile/types";
import { ActivityHeatmap } from "@/components/organisms/ActivityHeatmap";

const clearSession = () => {
  localStorage.removeItem('sb-vwovflogqhbhqwrkjbch-auth-token');
}

export default function Profile() {
  const [profile, setProfile] = useState<FitnessData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editMeasure, setEditMeasure] = useState<keyof Measurements | null>(null);
  const [tempValue, setTempValue] = useState<string>("");
  const [imc, setImc] = useState(0);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [hasMeasurementsEmpty, setHasMeasurementsEmpty] = useState(false);
  const [trainingCount, setTrainingCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastTraining, setLastTraining] = useState<LastTrainingResponse | null>(null);

  const handleEditMeasure = (key: keyof Measurements | null) => {
    if (key) {
      const currentValue = profile?.measurements?.[key] ?? 0;
      setTempValue(currentValue.toString());
    } else {
      setTempValue("");
    }
    setEditMeasure(editMeasure === key ? null : key);
  };

  const handleMeasureChange = (value: string) => {
    setTempValue(value);
  };

  const saveMeasure = async (key: keyof Measurements) => {
    if (!profile) return;
    const parsedValue = parseFloat(tempValue);

    if (!isNaN(parsedValue)) {
      try {
        const valueStr = parsedValue.toString();
        setProfile({
          ...profile,
          measurements: {
            ...profile.measurements,
            [key]: Number(valueStr),
          },
        });

        await measurementService.update({ [key]: Number(valueStr) });
      } catch (error) {
        console.error('Error saving measurement:', error);
      }
    }
    setEditMeasure(null);
  };

  useEffect(() => {
    setLoading(true);
    const fetchProfile = async () => {
      try {
        const userData = await profileService.dataProfile();
        const trainingCount = await profileService.countTraining();
        const streak = await profileService.offensiveDays();
        const lastTraining = await profileService.lastTraining();
        setTrainingCount(trainingCount.trainingCount);
        setStreak(streak.offensiveDays);
        setLastTraining(lastTraining);
        setProfile(userData as unknown as FitnessData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    calc_imc();

    const hasEmpty = Object.values(profile?.measurements || {}).some((value) => !value);
    setHasMeasurementsEmpty(hasEmpty);
  }, [profile]);

  const calc_imc = () => {
    if (!profile?.measurements?.weight_kg || !profile?.height_cm) return;

    const heightInMeters = profile.height_cm / 100;
    const imc =
      +profile?.measurements?.weight_kg /
      (heightInMeters * heightInMeters);

    setImc(Number(imc.toFixed(1)));
  };

  const getImcCategory = (imc: number) => {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Peso normal";
    if (imc < 30) return "Sobrepeso";
    return "Obesidade";
  };

  const getImcColor = (imc: number) => {
    if (imc < 18.5) return "text-[#4C6EF5]";
    if (imc < 25) return "text-[#2F9E44]";
    if (imc < 30) return "text-[#F08C00]";
    return "text-[#C92A2A]";
  };

  function formatUtcToBrazil(dateStr?: string | null) {
    if (!dateStr) return "—";

    const iso = dateStr.includes("T")
      ? dateStr
      : dateStr.replace(" ", "T").replace("+00", "Z");

    const d = new Date(iso);

    if (isNaN(d.getTime())) return "—";

    return d.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }



  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  async function getCroppedImg(imageSrc: string, crop: any): Promise<File> {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob!], "avatar.jpg", { type: "image/jpeg" }));
      }, "image/jpeg");
    });
  }

  const handleSaveCroppedImage = async () => {
    const user = profile?.user_id;
    if (!imageSrc || !croppedAreaPixels || !user) return;

    const croppedFile = await getCroppedImg(
      imageSrc,
      croppedAreaPixels
    );

    const avatarUrl = await uploadAvatar(croppedFile, user);

    await supabase
      .from("profile_fitness_data")
      .upsert(
        {
          user_id: user,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    setProfile((prev) =>
      prev ? { ...prev, avatar_url: avatarUrl } : prev
    );

    setImageSrc(null);
  };

  return (
    <MobileLayout>
      <PageHeader showSettings />
      {
        loading ? (
          <ProfileSkeleton />
        ) : (
          <div className="px-4 py-6 space-y-6">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/30 bg-secondary/30 flex items-center justify-center text-3xl font-bold text-primary">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile?.social_name?.[0]?.toUpperCase() || "A"
                  )}
                </div>
                {imageSrc && (
                  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                    <div className="relative w-80 h-80 bg-black rounded-xl overflow-hidden">
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(_, croppedPixels) =>
                          setCroppedAreaPixels(croppedPixels)
                        }
                      />
                    </div>

                    <button
                      className="mt-4 px-4 py-2 bg-primary rounded-lg"
                      onClick={handleSaveCroppedImage}
                    >
                      Salvar
                    </button>
                  </div>
                )}
                <div
                  className="absolute -top-1 -right-1 w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-lg border-2 border-background cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Pencil className="w-4 h-4 text-primary-foreground" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <h2 className="text-xl font-bold mb-1">
                {`@${removeAccents(profile?.social_name)}`}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Membro desde {format_date(profile?.created_at)}
              </p>
              <div className="flex items-center justify-center gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-gradient">
                    {trainingCount || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Treinos</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-2xl font-bold text-gradient">
                    {streak || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {streak > 0 ? "Dias de ofensiva" : "Sem dias de ofensiva"}
                  </p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-2xl font-bold text-gradient">#3</p>
                  <p className="text-xs text-muted-foreground">Ranking</p>
                </div>
              </div>
            </div>
            <ActivityHeatmap />
            {
              hasMeasurementsEmpty && (
                <div className="glass rounded-2xl overflow-hidden p-4" style={{ backgroundColor: "#513c9cff" }}>
                  <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                    <TriangleAlert className="w-4 h-4 text-primary-foreground" />
                    Falta de preenchimento de dados
                  </h2>
                  <p className="text-sm text-primary-foreground">Preencha suas medidas para continuar para conseguir ter acesso a todas as funcionalidades do app.</p>
                </div>
              )
            }
            <div className="glass rounded-2xl overflow-hidden p-4">
              <h3 className="text-lg font-bold mb-1">Último treino foi</h3>

              {lastTraining?.lastTraining ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {lastTraining.lastTraining.workout_plan?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatUtcToBrazil(lastTraining.lastTraining.finished_at)}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Você ainda não concluiu nenhum treino
                </p>
              )}
            </div>
            <Tabs defaultValue="progresso" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary">
                <TabsTrigger value="progresso">Progresso</TabsTrigger>
                <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="progresso" className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    Dados Privados
                  </h3>
                </div>

                <ProgressCard
                  label="Peso Atual"
                  value={`${profile?.measurements?.weight_kg || 0}`}
                  unit="kg"
                  // change={profile?.weight_kg || 0}
                  icon={<Scale className="w-4 h-4 text-primary-foreground" />}
                />
                <div className="glass rounded-2xl overflow-hidden p-4">
                  <div className="flex items-center gap-2 justify-between">
                    <p className="text-sm text-muted-foreground mb-3">
                      IMC - Índice de Massa Corporal
                    </p>
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                      <CircleGauge className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold">{imc}</p>
                  <p className={`text-xs ${getImcColor(imc)}`}>{getImcCategory(imc)}</p>
                </div>
                <div className="glass rounded-2xl overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2 font-semibold" onClick={() => setExpanded(!expanded)}>
                      {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      <p>Medidas Corporais</p>
                    </div>
                  </div>

                  {expanded && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3 w-full">
                        {measureMapper.map((m) => {
                          const value = profile?.measurements?.[m.key];
                          const isEditing = editMeasure === m.key;
                          return (
                            <div key={m.key} className="bg-secondary/30 rounded-xl p-4 w-full border border-border/50 transition-all duration-300">
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                                <Pencil
                                  className={`w-3 h-3 cursor-pointer transition-colors ${isEditing ? 'text-primary' : 'text-primary-foreground/50 hover:text-primary-foreground'}`}
                                  onClick={() => handleEditMeasure(m.key)}
                                />
                              </div>
                              {isEditing ? (
                                <div className="flex items-baseline gap-1 animate-in fade-in transition-all">
                                  <input
                                    type="number"
                                    value={tempValue}
                                    onChange={(e) => handleMeasureChange(e.target.value)}
                                    className="w-full bg-transparent border-none text-xl font-bold focus:outline-none focus:ring-0 p-0 text-foreground"
                                    autoFocus
                                    onBlur={() => saveMeasure(m.key)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        saveMeasure(m.key);
                                      }
                                      if (e.key === 'Escape') {
                                        setEditMeasure(null);
                                      }
                                    }}
                                  />
                                  <span className="text-sm font-medium text-muted-foreground">{m.unit}</span>
                                </div>
                              ) : (
                                <p className="text-xl font-bold">
                                  {value ?? 0} {m.unit}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="configuracoes" className="mt-4 space-y-4">
                <div className="space-y-2">
                  {/* <Link href="/settings">
                  <Button variant="secondary" className="w-full justify-start">
                    <Settings className="w-5 h-5 mr-3" />
                    Configurações
                  </Button>
                </Link> */}
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" onClick={clearSession}>
                      <LogOut className="w-5 h-5 mr-3" />
                      Sair
                    </Button>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )
      }
    </MobileLayout >
  );
}
