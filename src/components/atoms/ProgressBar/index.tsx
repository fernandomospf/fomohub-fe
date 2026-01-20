interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full">
            <p className="text-center text-muted-foreground text-sm mb-3">
                Passo {currentStep} de {totalSteps}
            </p>
            <div className="progress-bar">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};
