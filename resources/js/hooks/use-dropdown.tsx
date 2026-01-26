import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface DropdownOption {
    id: number;
    name: string;
}

const useDropdown = (type: string, params: object = {}, id: number | number[] | null = null) => {
    const [options, setOptions] = useState<DropdownOption[]>([]);
    const [loading, setLoading] = useState(false);

    // Stabilize params in dependencies to avoid infinite re-renders
    const paramsKey = useMemo(() => JSON.stringify(params || {}), [params]);

    // Normalize ID to comma-separated string for API
    const normalizedId = useMemo(() => {
        if (id === null) return null;
        if (Array.isArray(id)) {
            return id.length > 0 ? id.join(',') : null;
        }
        return id;
    }, [id]);

    const fetchOptions = useCallback(
        async (search = '') => {
            setLoading(true);
            try {
                const response = await axios.get('/dropdown', {
                    params: {
                        type,
                        search,
                        ...(normalizedId !== null ? { id: normalizedId } : {}),
                        ...params,
                    },
                });
                setOptions(response.data);
            } catch {
                // Silently fail - user will see empty dropdown
                setOptions([]);
            }
            setLoading(false);
        },
        [type, normalizedId, paramsKey],
    );

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    return { options, loading, fetchOptions };
};

export default useDropdown;
