import { profileService } from "@/infra/container";
import { Profile } from "@/api/Profile/profiles";
import { useEffect, useState } from "react";

export function useMe() {
    const [data, setData] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                setLoading(true);
                const userData = await profileService.get();
                setData(userData);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Não foi possível carregar o usuário.');
            } finally {
                setLoading(false);
            }
        };
        fetchMe();
    }, []);

    return { data, loading, error };
}