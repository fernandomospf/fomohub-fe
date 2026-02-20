import { workoutPlanService } from "@/infra/container";
import { ActiveWorkoutSession } from "@/api/WorkoutPlan/types";
import { useEffect, useState } from "react";

export function useActiveSession() {
    const [data, setData] = useState<ActiveWorkoutSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActiveSession = async () => {
            try {
                setLoading(true);
                const result = await workoutPlanService.getActiveSession();
                setData(result ?? null);
            } catch (err: any) {
                if (err?.response?.status === 204 || err?.response?.status === 404) {
                    setData(null);
                } else {
                    console.error('Error fetching active session:', err);
                    setError('Não foi possível carregar a sessão ativa.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchActiveSession();
    }, []);

    return { data, loading, error };
}
