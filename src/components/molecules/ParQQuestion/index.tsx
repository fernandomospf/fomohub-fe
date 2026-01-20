import { Check, X } from "lucide-react";

interface ParQQuestionProps {
    question: string;
    questionNumber: number;
    value: boolean | null;
    onChange: (value: boolean) => void;
}

export const ParQQuestion = ({ question, questionNumber, value, onChange }: ParQQuestionProps) => {
    return (
        <div className="question-card fade-in">
            <p className="text-foreground mb-4">
                <span className="text-primary font-semibold">{questionNumber}.</span> {question}
            </p>
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => onChange(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${value === true
                            ? "border-warning bg-warning/10 text-warning"
                            : "border-border bg-secondary text-muted-foreground hover:border-muted-foreground"
                        }`}
                >
                    <Check className="w-4 h-4" />
                    <span className="font-medium">Sim</span>
                </button>
                <button
                    type="button"
                    onClick={() => onChange(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${value === false
                            ? "border-success bg-success/10 text-success"
                            : "border-border bg-secondary text-muted-foreground hover:border-muted-foreground"
                        }`}
                >
                    <X className="w-4 h-4" />
                    <span className="font-medium">Não</span>
                </button>
            </div>
        </div>
    );
};
