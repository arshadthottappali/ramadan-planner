import { useState, useEffect } from 'react';

export function usePrayerTimes({ city, country, coordinates, method = 2 }) {
    const [prayers, setPrayers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTimes = async () => {
            try {
                setLoading(true);
                const date = new Date();
                const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

                let url = '';
                if (coordinates && coordinates.latitude && coordinates.longitude) {
                    url = `https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&method=${method}`;
                } else {
                    url = `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${city}&country=${country}&method=${method}`;
                }

                const response = await fetch(url);

                if (!response.ok) throw new Error('Failed to fetch prayer times');

                const data = await response.json();
                setPrayers(data.data.timings);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchTimes();
    }, [city, country, coordinates, method]);

    return { prayers, loading, error };
}
