import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
    User,
    Target,
    Ruler,
    Scale,
    ChevronRight,
    ChevronLeft,
    Check,
    Heart,
    Shield,
    AlertTriangle,
    FileCheck,
    CheckCircle2,
    Circle,
    Pencil,
} from "lucide-react";
import Cropper from "react-easy-crop";
import { supabase } from "@/lib/supabase";
import { uploadAvatar } from "@/service/avatar";

import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { Progress } from "@/components/atoms/progress";
import { profileService } from "@/infra/container";

const objectives = [
    { value: "emagrecer", label: "Emagrecer", description: "Perder gordura corporal" },
    { value: "hipertrofia", label: "Hipertrofia", description: "Ganhar massa muscular" },
    { value: "definicao", label: "Definição", description: "Definir e tonificar" },
    { value: "saude", label: "Saúde", description: "Melhorar condicionamento" },
    { value: "forca", label: "Força", description: "Aumentar força máxima" },
];

const experienceLevels = [
    { value: "iniciante", label: "Iniciante", description: "Menos de 6 meses" },
    { value: "intermediario", label: "Intermediário", description: "6 meses a 2 anos" },
    { value: "avancado", label: "Avançado", description: "Mais de 2 anos" },
];

const activityFrequencies = [
    { value: "1-2", label: "1-2x por semana" },
    { value: "3-4", label: "3-4x por semana" },
    { value: "5-6", label: "5-6x por semana" },
    { value: "diario", label: "Todos os dias" },
];

const PAR_Q_QUESTIONS = [
    "Algum médico já disse que você possui algum problema cardíaco e que só deveria realizar atividade física supervisionada por profissionais de saúde?",
    "Você sente dores no peito durante a prática de atividade física?",
    "No último mês, você sentiu dor no peito quando praticou atividade física?",
    "Você apresenta desequilíbrio devido à tontura e/ou perda de consciência?",
    "Você tem algum problema ósseo ou articular que poderia ser agravado pela atividade física?",
    "Você toma algum medicamento para pressão arterial ou problema cardíaco?",
    "Existe alguma outra razão pela qual você não deveria praticar atividade física?",
];

export function Onboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 6;
    
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        setValue,
        watch,
        handleSubmit,
    } = useForm({
        defaultValues: {
            name: "",
            birthDate: "",
            gender: "",
            height: "",
            weight: "",
            objective: "",
            experience: "",
            frequency: "",
            objectives: [] as string[],
            parqAnswers: new Array(PAR_Q_QUESTIONS.length).fill(null),
            acceptedTerms: false,
            acceptedMedical: false,
            avatarUrl: "",
        },
    });

    const formData = watch();
    const parqAnswers = formData.parqAnswers;
    const acceptedTerms = formData.acceptedTerms;
    const acceptedMedical = formData.acceptedMedical;
    const selectedObjectives = formData.objectives || [];

    const progress = (step / totalSteps) * 100;
    const hasYesAnswer = parqAnswers.some((a: boolean | null) => a === true);
    const allParqAnswered = parqAnswers.every((a: boolean | null) => a !== null);

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            handleSubmit(onSubmit)();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const updateFormData = (field: string, value: string) => {
        setValue(field as any, value);
    };

    const handleParqAnswer = (index: number, value: boolean) => {
        const updated = [...parqAnswers];
        updated[index] = value;
        setValue("parqAnswers", updated);
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
            const rawAvatarUrl = await uploadAvatar(croppedFile, user.id);
            const avatarUrl = `${rawAvatarUrl}?t=${Date.now()}`;

            setValue("avatarUrl", avatarUrl);
            
            await supabase
                .from("profile_fitness_data")
                .upsert(
                    {
                        user_id: user.id,
                        avatar_url: avatarUrl,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: "user_id" }
                );

            setImageSrc(null);
        } catch (error) {
            console.error('Error saving cropped image:', error);
        }
    };

    const isNameValid = (name: string) => {
        if (!name || name.trim() === "") return false;
        if (name.length > 14) return false;
        return /^[A-Za-zÀ-ÿ]/.test(name);
    };

    const isDateValid = (dateString: string) => {
        if (!dateString) return false;
        const parts = dateString.split('-');
        if (parts.length !== 3) return false;
        const [year, month, day] = parts.map(Number);

        if (year > 9999) return false;

        const bDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (bDate >= today) return false;

        let age = today.getFullYear() - bDate.getFullYear();
        const m = today.getMonth() - bDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
            age--;
        }
        return age >= 18;
    };

    const handleObjectiveToggle = (value: string) => {
        const current = [...selectedObjectives];
        const index = current.indexOf(value);
        if (index > -1) {
            current.splice(index, 1);
        } else if (current.length < 2) {
            current.push(value);
        }
        setValue("objectives", current);
    };

    const canProceed = () => {
        switch (step) {
            case 1:
                return isNameValid(formData.name) && isDateValid(formData.birthDate) && formData.gender !== "";
            case 2:
                return formData.height !== "" && formData.weight !== "";
            case 3:
                return selectedObjectives.length > 0;
            case 4:
                return formData.experience !== "" && formData.frequency !== "";
            case 5:
                return allParqAnswered;
            case 6:
                return acceptedTerms && (!hasYesAnswer || acceptedMedical);
            default:
                return true;
        }
    };

    const onSubmit = async (data: any) => {
        const [
            hasHeartCondition,
            chestPainDuringActivity,
            chestPainLastMonth,
            dizzinessOrFainting,
            boneOrJointProblem,
            usesHeartOrPressureMedication,
            otherReasonNotToExercise,
        ] = data.parqAnswers;

        const hasYes = data.parqAnswers.some((a: boolean) => a === true);

        await profileService.completedOnboarding({
            fitnessData: {
                socialName: data.name,
                birthDate: data.birthDate,
                gender: data.gender,
                heightCm: Number(data.height),
                weightKg: Number(data.weight),
                goal: data.objectives.join(", "),
                experienceLevel: data.experience,
                trainingFrequency: data.frequency,
            },
            parq: {
                hasHeartCondition,
                chestPainDuringActivity,
                chestPainLastMonth,
                dizzinessOrFainting,
                boneOrJointProblem,
                usesHeartOrPressureMedication,
                otherReasonNotToExercise,
            },
            consent: {
                type: hasYes ? "medical_disclaimer" : "terms_of_use",
                accepted: hasYes ? data.acceptedMedical : data.acceptedTerms,
                acceptedAt: new Date().toISOString(),
                version: "v1",
            },
        });

        router.push("/profile");
    };



    return (
        <div className="min-h-fit bg-background flex flex-col">
            <div className="px-5 pt-4 pb-2">
                <div className="flex items-center justify-between mb-4">
                    {step > 1 ? (
                        <Button variant="ghost" size="icon" onClick={handleBack} className="text-muted-foreground">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    ) : (
                        <div className="w-10" />
                    )}
                    <span className="text-sm text-muted-foreground">
                        Passo {step} de {totalSteps}
                    </span>
                    <div className="w-10" />
                </div>
                <Progress value={progress} className="h-1" />
            </div>

            <div className="flex-1 px-5 py-6 overflow-y-auto">
                {step === 1 && (
                    <div className="space-y-6 fade-in">
                        <div className="text-center space-y-3">
                            <h1 className="text-2xl font-bold text-foreground">Vamos começar!</h1>
                            <p className="text-muted-foreground">Conte-nos um pouco sobre você</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <div 
                                    className="w-full h-full rounded-full overflow-hidden border-4 border-primary/30 bg-secondary/30 flex items-center justify-center text-3xl font-bold text-primary cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {formData.avatarUrl ? (
                                        <img
                                            src={formData.avatarUrl}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-10 h-10 text-primary" />
                                    )}
                                </div>
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

                            {imageSrc && (
                                <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center p-4">
                                    <div className="relative w-full max-w-sm aspect-square bg-black rounded-xl overflow-hidden mb-6">
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
                                    <div className="flex gap-4 w-full max-w-sm">
                                        <Button 
                                            variant="secondary" 
                                            className="flex-1"
                                            onClick={() => setImageSrc(null)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button 
                                            className="flex-1"
                                            onClick={handleSaveCroppedImage}
                                        >
                                            Salvar
                                        </Button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Como podemos te chamar?</Label>
                                <Input
                                    placeholder="Seu nome"
                                    value={formData.name}
                                    onChange={(e) => updateFormData("name", e.target.value)}
                                    className={`bg-secondary ${formData.name && !isNameValid(formData.name) ? 'border-red-500' : 'border-border'}`}
                                    maxLength={14}
                                />
                                <p className={`text-xs ${formData.name && !isNameValid(formData.name) ? 'text-red-500' : 'text-muted-foreground'}`}>
                                    O nome não pode iniciar com números ou caracteres especiais e deve ter no máximo 14 caracteres.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Data de nascimento</Label>
                                <Input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const year = val.split('-')[0];
                                        if (year && year.length <= 4) {
                                            updateFormData("birthDate", val);
                                        } else if (!val) {
                                            updateFormData("birthDate", "");
                                        }
                                    }}
                                    max="9999-12-31"
                                    className={`bg-secondary ${formData.birthDate && !isDateValid(formData.birthDate) ? 'border-red-500' : 'border-border'}`}
                                />
                                <p className={`text-xs ${formData.birthDate && !isDateValid(formData.birthDate) ? 'text-red-500' : 'text-muted-foreground'}`}>
                                    * A idade mínima é de 18 anos.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Gênero</Label>
                                <RadioGroup
                                    value={formData.gender}
                                    onValueChange={(value) => updateFormData("gender", value)}
                                    className="flex gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="masculino" id="masculino" />
                                        <Label htmlFor="masculino" className="cursor-pointer">Masculino</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="feminino" id="feminino" />
                                        <Label htmlFor="feminino" className="cursor-pointer">Feminino</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 fade-in">
                        <div className="text-center space-y-3">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                                <Ruler className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Suas medidas</h1>
                            <p className="text-muted-foreground">Informações para personalizar seus treinos</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Altura (cm)</Label>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Ex: 175"
                                    value={formData.height}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "").slice(0, 3);
                                        updateFormData("height", val);
                                    }}
                                    className="bg-secondary border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Peso atual (kg)</Label>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Ex: 70"
                                    value={formData.weight}
                                    onChange={(e) => {
                                        let val = e.target.value
                                            .replace(",", ".")
                                            .replace(/[^\d.]/g, "");
                                        
                                        const parts = val.split(".");
                                        if (parts.length > 2) {
                                            val = parts[0] + "." + parts.slice(1).join("");
                                        }

                                        if (val.includes(".")) {
                                            const [int, dec] = val.split(".");
                                            val = `${int.slice(0, 3)}.${dec.slice(0, 1)}`;
                                        } else {
                                            val = val.slice(0, 3);
                                        }
                                        
                                        updateFormData("weight", val);
                                    }}
                                    className="bg-secondary border-border"
                                />
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex gap-3">
                                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                                <div>
                                    <p className="text-foreground font-medium text-sm">Seus dados são privados</p>
                                    <p className="text-muted-foreground text-xs">
                                        Essas informações são usadas apenas para calcular métricas e personalizar sua experiência.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 fade-in">
                        <div className="text-center space-y-3">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                                <Target className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Qual seu objetivo?</h1>
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Escolha o que mais se encaixa com você</p>
                                <p className="text-xs text-primary font-medium italic">
                                    * Você pode selecionar até 2 objetivos
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {objectives.map((obj) => (
                                <div
                                    key={obj.value}
                                    className={`question-card cursor-pointer transition-all ${selectedObjectives.includes(obj.value) ? 'border-primary bg-primary/5' : ''} ${!selectedObjectives.includes(obj.value) && selectedObjectives.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => handleObjectiveToggle(obj.value)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedObjectives.includes(obj.value) ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                                                {selectedObjectives.includes(obj.value) && <Check className="w-3 h-3 text-primary-foreground" />}
                                            </div>
                                            <div>
                                                <p className="text-foreground font-medium">{obj.label}</p>
                                                <p className="text-muted-foreground text-sm">{obj.description}</p>
                                            </div>
                                        </div>
                                        {selectedObjectives.includes(obj.value) && (
                                            <Check className="w-5 h-5 text-primary" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6 fade-in">
                        <div className="text-center space-y-3">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                                <Scale className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Sua experiência</h1>
                            <p className="text-muted-foreground">Nos ajude a entender seu nível atual</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label>Nível de experiência</Label>
                                <RadioGroup
                                    value={formData.experience}
                                    onValueChange={(value) => updateFormData("experience", value)}
                                    className="space-y-3"
                                >
                                    {experienceLevels.map((level) => (
                                        <div
                                            key={level.value}
                                            className={`question-card cursor-pointer ${formData.experience === level.value ? 'border-primary' : ''}`}
                                            onClick={() => updateFormData("experience", level.value)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem value={level.value} id={level.value} />
                                                <div>
                                                    <p className="text-foreground font-medium">{level.label}</p>
                                                    <p className="text-muted-foreground text-sm">{level.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="space-y-3">
                                <Label>Frequência de treino</Label>
                                <RadioGroup
                                    value={formData.frequency}
                                    onValueChange={(value) => updateFormData("frequency", value)}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    {activityFrequencies.map((freq) => (
                                        <div
                                            key={freq.value}
                                            className={`question-card cursor-pointer text-center ${formData.frequency === freq.value ? 'border-primary' : ''}`}
                                            onClick={() => updateFormData("frequency", freq.value)}
                                        >
                                            <RadioGroupItem value={freq.value} id={freq.value} className="sr-only" />
                                            <p className="text-foreground text-sm font-medium">{freq.label}</p>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="space-y-6 fade-in">
                        <div className="text-center space-y-3">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                                <Heart className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Questionário de Saúde</h1>
                            <p className="text-muted-foreground text-sm">PAR-Q - Avaliação de prontidão para atividade física</p>
                        </div>

                        <div className="bg-secondary/50 border border-border rounded-xl p-4">
                            <div className="flex gap-3">
                                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm text-foreground font-medium mb-1">Sua segurança é nossa prioridade</p>
                                    <p className="text-xs text-muted-foreground">
                                        Este questionário não é um diagnóstico médico. Serve apenas para identificar se você deve consultar um profissional de saúde antes de iniciar atividades físicas.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {PAR_Q_QUESTIONS.map((question, index) => (
                                <div key={index} className="question-card">
                                    <p className="text-foreground mb-4">
                                        <span className="text-primary font-semibold">{index + 1}.</span> {question}
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleParqAnswer(index, true)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${parqAnswers[index] === true
                                                ? "border-warning bg-warning/10 text-warning"
                                                : "border-border bg-secondary text-muted-foreground hover:border-muted-foreground"
                                                }`}
                                        >
                                            <Check className="w-4 h-4" />
                                            <span className="font-medium">Sim</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleParqAnswer(index, false)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${parqAnswers[index] === false
                                                ? "border-success bg-success/10 text-success"
                                                : "border-border bg-secondary text-muted-foreground hover:border-muted-foreground"
                                                }`}
                                        >
                                            <span className="font-medium">Não</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {hasYesAnswer && (
                            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 fade-in">
                                <div className="flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-warning font-medium mb-1">Atenção</p>
                                        <p className="text-xs text-warning/80">
                                            Com base nas suas respostas, recomendamos que você consulte um médico antes de iniciar qualquer programa de atividades físicas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {step === 6 && (
                    <div className="space-y-6 fade-in">
                        <div className="text-center space-y-3">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                                <FileCheck className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Termo de Consentimento</h1>
                            <p className="text-muted-foreground text-sm">Leia com atenção antes de continuar</p>
                        </div>

                        {hasYesAnswer && (
                            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 fade-in">
                                <div className="flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-warning font-medium mb-1">Recomendação Médica</p>
                                        <p className="text-xs text-warning/80">
                                            Com base nas suas respostas ao questionário PAR-Q, recomendamos fortemente que você consulte um médico antes de iniciar qualquer programa de atividades físicas.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-card border border-border rounded-xl p-5">
                            <h3 className="text-foreground font-semibold mb-3">Declaração e Consentimento</h3>
                            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                                <p>
                                    Declaro que as informações fornecidas são verdadeiras e autorizo o uso dos meus dados físicos para fins de personalização de treinos e estimativas de desempenho físico.
                                </p>
                                <p>
                                    Este aplicativo <strong className="text-foreground">não substitui</strong> acompanhamento médico ou profissional de saúde.
                                </p>
                                <p>
                                    Estou ciente de que a prática de exercícios físicos envolve riscos e que é minha responsabilidade avaliar minha aptidão para realizá-los.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                type="button"
                                onClick={() => setValue("acceptedTerms", !acceptedTerms)}
                                className="w-full question-card flex items-start gap-3 text-left"
                            >
                                {acceptedTerms ? (
                                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                ) : (
                                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                )}
                                <span className="text-sm text-foreground">
                                    Li e aceito o termo de consentimento e declaro que as informações fornecidas são verdadeiras.
                                </span>
                            </button>

                            {hasYesAnswer && (
                                <button
                                    type="button"
                                    onClick={() => setValue("acceptedMedical", !acceptedMedical)}
                                    className="w-full question-card flex items-start gap-3 text-left fade-in"
                                >
                                    {acceptedMedical ? (
                                        <CheckCircle2 className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                    )}
                                    <span className="text-sm text-foreground">
                                        Estou ciente da recomendação médica e assumo a responsabilidade de consultar um profissional de saúde antes de iniciar atividades físicas.
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-border">
                <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="btn-primary w-full"
                >
                    {step === totalSteps ? (
                        <>
                            Concluir
                            <Check className="w-5 h-5 ml-2" />
                        </>
                    ) : (
                        <>
                            Continuar
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );

}

export default Onboarding;
