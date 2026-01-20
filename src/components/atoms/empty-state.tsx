import { LucideIcon, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    className?: string;
    children?: React.ReactNode;
}

export function EmptyState({
    icon: Icon = Dumbbell,
    title,
    description,
    className,
    children,
}: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
                <Icon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                    {description}
                </p>
            )}
            {children}
        </div>
    );
}
