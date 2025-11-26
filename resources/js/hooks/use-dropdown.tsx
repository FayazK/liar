import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

const useDropdown = (type: string, params: object = {}, id: number | null = null) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Stabilize params in dependencies to avoid infinite re-renders
    const paramsKey = useMemo(() => JSON.stringify(params || {}), [params]);

    const fetchOptions = useCallback(
        async (search = '') => {
            setLoading(true);
            try {
                const response = await axios.get('/dropdown', {
                    params: {
                        type,
                        search,
                        id,
                        ...params,
                    },
                });
                setOptions(response.data);
            } catch (error) {
                console.error('Failed to fetch dropdown options', error);
            }
            setLoading(false);
        },
        [type, id, paramsKey],
    );

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    return { options, loading, fetchOptions };
};

export default useDropdown;
