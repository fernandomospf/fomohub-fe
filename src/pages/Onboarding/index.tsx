import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import profileService from "@/api/profiles";

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
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const totalSteps = 6;

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
            parqAnswers: new Array(PAR_Q_QUESTIONS.length).fill(null),
            acceptedTerms: false,
            acceptedMedical: false,
        },
    });

    const formData = watch();
    const parqAnswers = formData.parqAnswers;
    const acceptedTerms = formData.acceptedTerms;
    const acceptedMedical = formData.acceptedMedical;

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

    const canProceed = () => {
        switch (step) {
            case 1:
                return formData.name.trim() !== "";
            case 2:
                return formData.height !== "" && formData.weight !== "";
            case 3:
                return formData.objective !== "";
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

        await profileService.CompletedOnboarding({
            fitnessData: {
                socialName: data.name,
                birthDate: data.birthDate,
                gender: data.gender,
                heightCm: Number(data.height),
                weightKg: Number(data.weight),
                goal: data.objective,
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

        navigate("/profile");
    };



    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
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

            {/* Content */}
            <div className="flex-1 px-5 py-6 overflow-y-auto">
                {step === 1 && (
                    <div className="space-y-6 fade-in">
                        <div className="text-center space-y-3">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                                <User className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Vamos começar!</h1>
                            <p className="text-muted-foreground">Conte-nos um pouco sobre você</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Como podemos te chamar?</Label>
                                <Input
                                    placeholder="Seu nome"
                                    value={formData.name}
                                    onChange={(e) => updateFormData("name", e.target.value)}
                                    className="bg-secondary border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Data de nascimento</Label>
                                <Input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={(e) => updateFormData("birthDate", e.target.value)}
                                    className="bg-secondary border-border"
                                />
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
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="outro" id="outro" />
                                        <Label htmlFor="outro" className="cursor-pointer">Outro</Label>
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
                                    type="number"
                                    placeholder="Ex: 175"
                                    value={formData.height}
                                    onChange={(e) => updateFormData("height", e.target.value)}
                                    className="bg-secondary border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Peso atual (kg)</Label>
                                <Input
                                    type="number"
                                    placeholder="Ex: 70"
                                    value={formData.weight}
                                    onChange={(e) => updateFormData("weight", e.target.value)}
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
                            <p className="text-muted-foreground">Escolha o que mais se encaixa com você</p>
                        </div>

                        <RadioGroup
                            value={formData.objective}
                            onValueChange={(value) => updateFormData("objective", value)}
                            className="space-y-3"
                        >
                            {objectives.map((obj) => (
                                <div
                                    key={obj.value}
                                    className={`question-card cursor-pointer ${formData.objective === obj.value ? 'border-primary' : ''}`}
                                    onClick={() => updateFormData("objective", obj.value)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value={obj.value} id={obj.value} />
                                            <div>
                                                <p className="text-foreground font-medium">{obj.label}</p>
                                                <p className="text-muted-foreground text-sm">{obj.description}</p>
                                            </div>
                                        </div>
                                        {formData.objective === obj.value && (
                                            <Check className="w-5 h-5 text-primary" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
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
            <div className="px-5 py-4 border-t border-border">
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
