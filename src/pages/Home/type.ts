import { LastTrainingResponse } from "@/api/Profile/types";
import { ActiveWorkoutSession, WorkoutPlan } from "@/api/WorkoutPlan/types";
import { UserData } from "@/types/user";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type HomeFilters = {
    tags: string[];
    search: string;
};

type Stats = {
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    label: string;
    value: string;
    unit: string;
    color: string;
}

type QuickActions = {
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    label: string;
    path: string;
    gradient: boolean;
}   

export type HomeState = {
    loading: boolean;
    error: string | null;
    userData: UserData | null;
    workoutPlan: WorkoutPlan[];
    muscleGroupTag: string[] | null;
    goalsTag: string[] | null;
    visibleCount: number;
    startIndex: number;
    showFilters: boolean;
    offensiveDays: number;
    activeDays: number;
    activeSession: ActiveWorkoutSession | null;
    filters: HomeFilters;
    lastTraining: LastTrainingResponse | null;
    activeTag: string | null;
    stats: Stats[];
    quickActions: QuickActions[];
    showDevModal: boolean;
}

export type HomeActions = {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setUserData: (userData: UserData | null) => void;
    setWorkoutPlan: (workoutPlan: WorkoutPlan[]) => void;
    setMuscleGroupTag: (muscleGroupTag: string[] | null) => void;
    setGoalsTag: (goalsTag: string[] | null) => void;
    setVisibleCount: (visibleCount: number) => void;
    setStartIndex: (startIndex: number) => void;
    setShowFilters: (showFilters: boolean) => void;
    setOffensiveDays: (offensiveDays: number) => void;
    setActiveDays: (activeDays: number) => void;
    setActiveSession: (activeSession: ActiveWorkoutSession | null) => void;
    setFilters: (filters: HomeFilters) => void;
    setLastTraining: (lastTraining: LastTrainingResponse | null) => void;
    setActiveTag: (activeTag: string | null) => void;
    setShowDevModal: (showDevModal: boolean) => void;
    filteredWorkoutPlan: () => WorkoutPlan[];
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectedTag: (tagName: string) => void;
    handleShowMore: () => void;
    handleCollapse: () => void;
}

export type HomeStore = HomeState & HomeActions
