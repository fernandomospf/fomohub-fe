import { ReactNode } from "react";
import { Settings } from "lucide-react";
import { ProgressBar } from "../ProgressBar";

interface OnboardingLayoutProps {
    children: ReactNode;
    currentStep: number;
    totalSteps: number;
}

export const OnboardingLayout = ({ children, currentStep, totalSteps }: OnboardingLayoutProps) => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-5 py-4">
                <div className="text-primary font-bold text-2xl italic">𝒩</div>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
            </header>

            {/* Progress */}
            <div className="px-5 mb-6">
                <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            </div>

            {/* Content */}
            <main className="flex-1 px-5 pb-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};
