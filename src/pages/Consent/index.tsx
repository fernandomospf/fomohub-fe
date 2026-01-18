import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OnboardingLayout } from "@/components/OnboardingLayout";
import { FileCheck, AlertTriangle, CheckCircle2, Circle } from "lucide-react";

export default function Consent() {
    const location = useLocation();
    const navigate = useNavigate();
    const needsMedicalAdvice = location.state?.needsMedicalAdvice ?? false;

    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedMedical, setAcceptedMedical] = useState(false);

    const canContinue = acceptedTerms && (!needsMedicalAdvice || acceptedMedical);

    const handleComplete = () => {
        navigate("/sucesso");
    };

    return (
        <OnboardingLayout currentStep={2} totalSteps={2}>
            <div className="slide-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="avatar-circle mx-auto mb-4">
                        <FileCheck className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                        Termo de Consentimento
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Leia com atenção antes de continuar
                    </p>
                </div>

                {/* Medical Warning */}
                {needsMedicalAdvice && (
                    <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6 fade-in">
                        <div className="flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-warning font-medium mb-1">
                                    Recomendação Médica
                                </p>
                                <p className="text-xs text-warning/80">
                                    Com base nas suas respostas ao questionário PAR-Q, recomendamos fortemente que você consulte um médico antes de iniciar qualquer programa de atividades físicas.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Terms Card */}
                <div className="bg-card border border-border rounded-xl p-5 mb-6">
                    <h3 className="text-foreground font-semibold mb-3">
                        Declaração e Consentimento
                    </h3>
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

                {/* Checkboxes */}
                <div className="space-y-4 mb-8">
                    {/* Terms Checkbox */}
                    <button
                        type="button"
                        onClick={() => setAcceptedTerms(!acceptedTerms)}
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

                    {/* Medical Acknowledgment (only if needed) */}
                    {needsMedicalAdvice && (
                        <button
                            type="button"
                            onClick={() => setAcceptedMedical(!acceptedMedical)}
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

                {/* Continue Button */}
                <button
                    onClick={handleComplete}
                    disabled={!canContinue}
                    className={`btn-primary ${!canContinue ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    Confirmar e Continuar
                </button>
            </div>
        </OnboardingLayout>
    );
}
