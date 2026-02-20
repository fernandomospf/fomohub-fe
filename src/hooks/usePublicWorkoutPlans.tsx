import { workoutPlanService } from "@/infra/container";
import { WorkoutPlan } from "@/api/WorkoutPlan/types";
import { useEffect, useState } from "react";

export function usePublicWorkoutPlans({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    const [data, setData] = useState<WorkoutPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPublicWorkoutPlans = async () => {
            try {
                setLoading(true);
                const result = await workoutPlanService.getWorkoutPlanPublic({ page, limit });
                setData(result?.data || []);
            } catch (err) {
                console.error('Error fetching public workout plans:', err);
                setError('Não foi possível carregar os treinos públicos.');
            } finally {
                setLoading(false);
            }
        };
        fetchPublicWorkoutPlans();
    }, [page, limit]);

    return { data, loading, error };
}
