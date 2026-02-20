import { workoutPlanService } from "@/infra/container";
import { useEffect, useState } from "react";

export function useGoalsTag() {
    const [data, setData] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGoalsTag = async () => {
            try {
                setLoading(true);
                const result = await workoutPlanService.getGoalsTag();
                setData(result);
            } catch (err) {
                console.error('Error fetching goals tags:', err);
                setError('Não foi possível carregar os objetivos.');
            } finally {
                setLoading(false);
            }
        };
        fetchGoalsTag();
    }, []);

    return { data, loading, error };
}
