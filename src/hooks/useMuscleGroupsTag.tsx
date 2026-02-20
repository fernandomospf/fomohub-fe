import { workoutPlanService } from "@/infra/container";
import { useEffect, useState } from "react";

export function useMuscleGroupsTag() {
    const [data, setData] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMuscleGroupsTag = async () => {
            try {
                setLoading(true);
                const result = await workoutPlanService.getMuscleGroupsTag();
                setData(result);
            } catch (err) {
                console.error('Error fetching muscle groups tags:', err);
                setError('Não foi possível carregar os grupos musculares.');
            } finally {
                setLoading(false);
            }
        };
        fetchMuscleGroupsTag();
    }, []);

    return { data, loading, error };
}
