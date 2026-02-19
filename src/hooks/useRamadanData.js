import { useState, useEffect } from 'react';
import { INITIAL_DAY_STATE, RAMADAN_DAYS } from '../lib/constants';

export function useRamadanData() {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('ramadan-planner-data');
        // Initialize 30 days structure first
        const initial = {};
        for (let i = 1; i <= RAMADAN_DAYS; i++) {
            initial[i] = { ...INITIAL_DAY_STATE };
        }

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Deep merge saved data with initial structure to ensure new fields exist
                const merged = { ...initial };
                Object.keys(parsed).forEach(day => {
                    if (merged[day]) {
                        merged[day] = {
                            ...merged[day],
                            ...parsed[day],
                            // Ensure nested objects are merged too
                            prayers: { ...merged[day].prayers, ...(parsed[day].prayers || {}) },
                            extra_prayers: { ...merged[day].extra_prayers, ...(parsed[day].extra_prayers || {}) },
                            dhikr: { ...merged[day].dhikr, ...(parsed[day].dhikr || {}) },
                            quran: { ...merged[day].quran, ...(parsed[day].quran || {}) },
                            studies: { ...merged[day].studies, ...(parsed[day].studies || {}) },
                            adkar: { ...merged[day].adkar, ...(parsed[day].adkar || {}) },
                        };
                    }
                });
                return merged;
            } catch (e) {
                console.error("Failed to parse saved data", e);
                return initial;
            }
        }
        return initial;
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('ramadan-planner-data', JSON.stringify(data));
    }, [data]);

    const updateDay = (day, section, key, value) => {
        setData(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [section]: key ? {
                    ...prev[day][section],
                    [key]: value
                } : value // Handle direct updates like notes
            }
        }));
    };

    // Helper to update flat fields like notes
    const updateDayField = (day, field, value) => {
        setData(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value
            }
        }));
    };

    const toggleAdkar = (day, section, id) => {
        setData(prev => {
            const currentSection = prev[day]?.adkar?.[section] || {};
            return {
                ...prev,
                [day]: {
                    ...prev[day],
                    adkar: {
                        ...prev[day].adkar,
                        [section]: {
                            ...currentSection,
                            [id]: !currentSection[id]
                        }
                    }
                }
            };
        });
    };

    const addCustom = (day, text) => {
        const newItem = { id: Date.now(), text, completed: false };
        setData(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                custom: [...(prev[day].custom || []), newItem]
            }
        }));
    };

    const toggleCustom = (day, id) => {
        setData(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                custom: (prev[day].custom || []).map(item =>
                    item.id === id ? { ...item, completed: !item.completed } : item
                )
            }
        }));
    };

    const deleteCustom = (day, id) => {
        setData(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                custom: (prev[day].custom || []).filter(item => item.id !== id)
            }
        }));
    };

    const resetData = () => {
        if (confirm('Are you sure you want to reset all data?')) {
            const initial = {};
            for (let i = 1; i <= RAMADAN_DAYS; i++) {
                initial[i] = { ...INITIAL_DAY_STATE };
            }
            setData(initial);
        }
    };

    const [customResources, setCustomResources] = useState(() => {
        const saved = localStorage.getItem('ramadan-planner-resources');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('ramadan-planner-resources', JSON.stringify(customResources));
    }, [customResources]);

    const addResource = (resource) => {
        setCustomResources(prev => [...prev, { ...resource, id: Date.now() }]);
    };

    const removeResource = (id) => {
        setCustomResources(prev => prev.filter(r => r.id !== id));
    };

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('ramadan-planner-settings');
        return saved ? JSON.parse(saved) : { userName: null, quranGoal: 'khatam-1', customDailyPages: 20, ramadanStartDate: null };
    });

    useEffect(() => {
        localStorage.setItem('ramadan-planner-settings', JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const exportData = () => {
        const fullBackup = {
            data,
            customResources,
            settings,
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ramadan-planner-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return {
        data, updateDay, updateDayField, resetData, addCustom, toggleCustom, deleteCustom, toggleAdkar,
        customResources, addResource, removeResource,
        settings, updateSettings,
        exportData
    };
}
