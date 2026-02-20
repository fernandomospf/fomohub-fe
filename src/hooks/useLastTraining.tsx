import { profileService } from "@/infra/container";
import { LastTrainingResponse } from "@/api/Profile/types";
import { useEffect, useState } from "react";

export function useLastTraining() {
    const [data, setData] = useState<LastTrainingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLastTraining = async () => {
            try {
                setLoading(true);
                const result = await profileService.lastTraining();
                setData(result);
            } catch (err) {
                console.error('Error fetching last training:', err);
                setError('Não foi possível carregar o último treino.');
            } finally {
                setLoading(false);
            }
        };
        fetchLastTraining();
    }, []);

    return { data, loading, error };
}
