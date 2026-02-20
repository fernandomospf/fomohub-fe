import { profileService } from "@/infra/container";
import { FitnessData } from "@/types/user";
import { useEffect, useState } from "react";

export function useProfile() {
    const [data, setData] = useState<FitnessData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const userData = await profileService.dataProfile();
                setData(userData as unknown as FitnessData);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Não foi possível carregar o perfil.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return { data, loading, error };
}