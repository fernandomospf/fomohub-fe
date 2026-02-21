import { create } from 'zustand';
import { HomeStore } from './type';
import { Flame, Sparkles, TrendingUp, Trophy } from 'lucide-react';
import { WorkoutPlan } from '@/api/WorkoutPlan/types';

export const useHomeStore = create<HomeStore>((set, get) => ({
    userData: null,
    setUserData: (userData) => set({ userData }),
    loading: false,
    setLoading: (loading) => set({ loading }),
    error: null,
    setError: (error) => set({ error }),
    workoutPlan: [],
    setWorkoutPlan: (workoutPlan) => set({ workoutPlan }),
    muscleGroupTag: null,
    setMuscleGroupTag: (muscleGroupTag) => set({ muscleGroupTag }),
    goalsTag: null,
    setGoalsTag: (goalsTag) => set({ goalsTag }),
    offset: 0,
    setOffset: (offset) => set({ offset }),
    limit: 10,
    setLimit: (limit) => set({ limit }),
    hasMore: true,
    setHasMore: (hasMore) => set({ hasMore }),
    loadingMore: false,
    setLoadingMore: (loadingMore) => set({ loadingMore }),
    startIndex: 0,
    setStartIndex: (startIndex) => set({ startIndex }),
    showFilters: false,
    setShowFilters: (showFilters) => set({ showFilters }),
    offensiveDays: 0,
    setOffensiveDays: (offensiveDays) => set({ offensiveDays }),
    activeDays: 0,
    setActiveDays: (activeDays) => set({ activeDays }),
    activeSession: null,
    setActiveSession: (activeSession) => set({ activeSession }),
    filters: { tags: [], search: '' },
    setFilters: (filters) => set({ filters }),
    lastTraining: null,
    setLastTraining: (lastTraining) => set({ lastTraining }),
    activeTag: null,
    setActiveTag: (activeTag) => set({ activeTag }),
    stats: [
        { icon: Flame as any, label: "Streak", value: "0", unit: "dias", color: "text-orange-500" },
        { icon: Trophy as any, label: "Ranking", value: "#0", unit: "posição", color: "text-yellow-500" },
        { icon: TrendingUp as any, label: "Progresso", value: "0%", unit: "mês", color: "text-success" },
    ],
    setStats: (stats) => set({ stats }),
    quickActions: [
        { icon: Sparkles as any, label: "EvoluIA", path: "/ai-workout", gradient: true },
        // { icon: Users, label: "Profissionais", path: "/professionals", gradient: false },
        { icon: Trophy as any, label: "Ranking", path: "/ranking", gradient: false },
        // { icon: ShoppingBag, label: "Loja", path: "/marketplace", gradient: false },
    ],
    setQuickActions: (quickActions) => set({ quickActions }),
    showDevModal: false,
    setShowDevModal: (showDevModal) => set({ showDevModal }),
    filteredWorkoutPlan: (): WorkoutPlan[] => {
        const { workoutPlan, filters } = get();
        return workoutPlan.filter((plan) => {
          const matchesTag =
            filters.tags.length === 0 ||
            filters.tags.some(
              (tag) =>
                plan.muscle_groups.includes(tag) ||
                plan.goals.includes(tag)
            );
    
          const matchesSearch =
            filters.search.trim() === "" ||
            plan.name
              ?.toLowerCase()
              .includes(filters.search.toLowerCase());
    
          return matchesTag && matchesSearch;
        });
      },
      handleSearch: (search: string) => {
        const { setFilters, filters } = get();
        setFilters({ ...filters, search });
      },
      handleSelectedTag: (tagName: string) => {
        const { setFilters, filters } = get();
        const isSelected = filters.tags.includes(tagName);
    
        setFilters({
          ...filters,
          tags: isSelected
            ? filters.tags.filter((tag) => tag !== tagName)
            : [...filters.tags, tagName],
        });
      },
}));