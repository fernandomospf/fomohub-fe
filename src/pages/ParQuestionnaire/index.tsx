import { useState } from "react";
import { useRouter } from "next/router";
import { OnboardingLayout } from "@/components/templates/OnboardingLayout";
import { ParQQuestion } from "@/components/molecules/ParQQuestion";
import { AlertTriangle, ShieldCheck, Heart } from "lucide-react";

const PAR_Q_QUESTIONS = [
    "Algum médico já disse que você possui algum problema cardíaco e que só deveria realizar atividade física supervisionada por profissionais de saúde?",
    "Você sente dores no peito durante a prática de atividade física?",
    "No último mês, você sentiu dor no peito quando praticou atividade física?",
    "Você apresenta desequilíbrio devido à tontura e/ou perda de consciência?",
    "Você tem algum problema ósseo ou articular que poderia ser agravado pela atividade física?",
    "Você toma algum medicamento para pressão arterial ou problema cardíaco?",
    "Existe alguma outra razão pela qual você não deveria praticar atividade física?",
];

export default function ParQuestionnaire() {
    const router = useRouter();
    const [answers, setAnswers] = useState<(boolean | null)[]>(
        new Array(PAR_Q_QUESTIONS.length).fill(null)
    );

    const handleAnswerChange = (index: number, value: boolean) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const allAnswered = answers.every((answer) => answer !== null);
    const hasYesAnswer = answers.some((answer) => answer === true);

    const handleContinue = () => {
        router.push({
            pathname: "/consentimento",
            query: { needsMedicalAdvice: hasYesAnswer ? "true" : "false" },
        });
    };

    return (
        <OnboardingLayout currentStep={1} totalSteps={2}>
            <div className="slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="avatar-circle mx-auto mb-4">
                        <Heart className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Questionário de Saúde
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        PAR-Q - Avaliação de prontidão para atividade física
                    </p>
                </div>

                {/* Info Card */}
                <div className="bg-secondary/50 border border-border rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                        <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-foreground font-medium mb-1">
                                Sua segurança é nossa prioridade
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Este questionário não é um diagnóstico médico. Serve apenas para identificar se você deve consultar um profissional de saúde antes de iniciar atividades físicas.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="space-y-4 mb-8">
                    {PAR_Q_QUESTIONS.map((question, index) => (
                        <ParQQuestion
                            key={index}
                            question={question}
                            questionNumber={index + 1}
                            value={answers[index]}
                            onChange={(value) => handleAnswerChange(index, value)}
                        />
                    ))}
                </div>

                {/* Warning if any YES */}
                {hasYesAnswer && (
                    <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6 fade-in">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-warning font-medium mb-1">
                                    Atenção
                                </p>
                                <p className="text-xs text-warning/80">
                                    Com base nas suas respostas, recomendamos que você consulte um médico antes de iniciar qualquer programa de atividades físicas.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Continue Button */}
                <button
                    onClick={handleContinue}
                    disabled={!allAnswered}
                    className={`btn-primary ${!allAnswered ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    Continuar
                </button>
            </div>
        </OnboardingLayout>
    );
}
