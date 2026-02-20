import { profileService } from "@/infra/container";
import { useEffect, useState } from "react";

export function useOffensiveDays() {
    const [data, setData] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOffensiveDays = async () => {
            try {
                setLoading(true);
                const result = await profileService.offensiveDays();
                setData(result.offensiveDays);
            } catch (err) {
                console.error('Error fetching offensive days:', err);
                setError('Não foi possível carregar os dias consecutivos.');
            } finally {
                setLoading(false);
            }
        };
        fetchOffensiveDays();
    }, []);

    return { data, loading, error };
}
