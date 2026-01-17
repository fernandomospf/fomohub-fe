import React, { createContext, useContext, useEffect, useState } from "react";

interface WorkoutSessionContextData {
    isActive: boolean;
    startTime: number | null;
    elapsedSeconds: number;
    activeWorkoutId: string | null;
    startWorkout: (workoutId: string) => void;
    endWorkout: () => void;
    formatTime: (seconds: number) => string;
}

const WorkoutSessionContext = createContext<WorkoutSessionContextData>(
    {} as WorkoutSessionContextData
);

export function WorkoutSessionProvider({ children }: { children: React.ReactNode }) {
    const [isActive, setIsActive] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem("@ironhub:workout-session");
        if (savedState) {
            const { isActive, startTime, activeWorkoutId } = JSON.parse(savedState);
            if (isActive && startTime) {
                setIsActive(true);
                setStartTime(startTime);
                setActiveWorkoutId(activeWorkoutId);
                // Calculate catch-up time
                const now = Date.now();
                const diff = Math.floor((now - startTime) / 1000);
                setElapsedSeconds(diff);
            }
        }
    }, []);

    // Save to localStorage when state changes
    useEffect(() => {
        if (isActive && startTime) {
            localStorage.setItem("@ironhub:workout-session", JSON.stringify({
                isActive,
                startTime,
                activeWorkoutId
            }));
        } else {
            // Only remove if we explicitly ended it, not just on initial load null state
            if (!isActive && startTime === null) {
                localStorage.removeItem("@ironhub:workout-session");
            }
        }
    }, [isActive, startTime, activeWorkoutId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && startTime) {
            interval = setInterval(() => {
                const now = Date.now();
                setElapsedSeconds(Math.floor((now - startTime) / 1000));
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, startTime]);

    const startWorkout = (workoutId: string) => {
        const now = Date.now();
        setIsActive(true);
        setStartTime(now);
        setActiveWorkoutId(workoutId);
        setElapsedSeconds(0);
    };

    const endWorkout = () => {
        setIsActive(false);
        setStartTime(null);
        setActiveWorkoutId(null);
        setElapsedSeconds(0);
        localStorage.removeItem("@ironhub:workout-session");
    };

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`;
        }
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <WorkoutSessionContext.Provider
            value={{
                isActive,
                startTime,
                elapsedSeconds,
                activeWorkoutId,
                startWorkout,
                endWorkout,
                formatTime,
            }}
        >
            {children}
        </WorkoutSessionContext.Provider>
    );
}

export const useWorkoutSession = () => useContext(WorkoutSessionContext);
