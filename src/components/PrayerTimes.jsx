import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { Clock, MapPin, Moon, Sun, Sunrise, Sunset, Navigation, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PrayerTimes() {
    // Load saved settings or default
    const [location, setLocation] = useState(() => {
        const saved = localStorage.getItem('prayer-location');
        return saved ? JSON.parse(saved) : { city: 'London', country: 'UK' };
    });

    const [method, setMethod] = useState(() => {
        const saved = localStorage.getItem('prayer-method');
        return saved ? parseInt(saved) : 2;
    });

    const [useGeo, setUseGeo] = useState(false);
    const [coordinates, setCoordinates] = useState(null);
    const [geoLoading, setGeoLoading] = useState(false);

    // Persist settings changes
    useEffect(() => {
        localStorage.setItem('prayer-location', JSON.stringify(location));
    }, [location]);

    useEffect(() => {
        localStorage.setItem('prayer-method', method.toString());
    }, [method]);

    const { prayers, loading, error } = usePrayerTimes({
        city: location.city,
        country: location.country,
        coordinates: useGeo ? coordinates : null,
        method
    });

    const CALCULATION_METHODS = [
        { id: 2, name: 'ISNA (North America)' },
        { id: 3, name: 'Muslim World League' },
        { id: 4, name: 'Umm Al-Qura (Makkah)' },
        { id: 5, name: 'Egyptian General Authority' },
        { id: 1, name: 'Karachi (Hanfi)' },
        { id: 12, name: 'UOIF (France)' },
        { id: 13, name: 'Diyanet (Turkey)' },
    ];

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoordinates({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                setUseGeo(true);
                setGeoLoading(false);
            },
            (error) => {
                console.error(error);
                alert('Unable to retrieve your location');
                setGeoLoading(false);
            }
        );
    };

    const handleManualInput = (field, value) => {
        setUseGeo(false); // Switch back to manual mode if user types
        setLocation(prev => ({ ...prev, [field]: value }));
    };

    // Helper to format 24h time to 12h
    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const [nextPrayer, setNextPrayer] = useState(null);

    useEffect(() => {
        if (!prayers) return;

        const calculateNext = () => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

            for (const prayer of prayerOrder) {
                const timeStr = prayers[prayer];
                if (!timeStr) continue;

                const [hours, minutes] = timeStr.split(':').map(Number);
                const prayerTime = hours * 60 + minutes;

                if (prayerTime > currentTime) {
                    setNextPrayer(prayer);
                    return;
                }
            }

            // If all passed, next is Fajr (tomorrow)
            setNextPrayer('Fajr');
        };

        calculateNext();
        // Update every minute (optional but good for accuracy)
        const timer = setInterval(calculateNext, 60000);
        return () => clearInterval(timer);

    }, [prayers]);

    const PrayerRow = ({ name, time, icon: Icon, isNext }) => (
        <div className={`flex items-center justify-between p-4 rounded-2xl mb-3 transition-all ${isNext ? 'bg-[#1A4D2E] text-white shadow-lg scale-105' : 'bg-white border border-slate-100 text-slate-600'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isNext ? 'bg-white/20' : 'bg-slate-50'}`}>
                    <Icon className={`w-5 h-5 ${isNext ? 'text-white' : 'text-[#D4AF37]'}`} />
                </div>
                <span className="font-bold text-lg">{name}</span>
            </div>
            <div className="flex flex-col items-end">
                <span className={`font-mono text-xl font-bold ${isNext ? 'text-[#D4AF37]' : 'text-[#1A4D2E]'}`}>{formatTime(time)}</span>
                {isNext && <span className="text-[10px] uppercase tracking-wider opacity-80">Next Prayer</span>}
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Location Header */}
            <div className="bg-[#1A4D2E] text-white p-6 rounded-[2.5rem] shadow-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 opacity-80">
                            <MapPin className="w-4 h-4" />
                            <span className="text-xs font-medium tracking-wider uppercase">Location & Method</span>
                        </div>
                        <button
                            onClick={handleLocateMe}
                            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                        >
                            {geoLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                            {useGeo ? 'Using GPS' : 'Locate Me'}
                        </button>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-3xl font-serif font-bold">
                            {useGeo ? 'Current Location' : `${location.city}, ${location.country}`}
                        </h2>
                    </div>

                    <div className="flex flex-col gap-3">
                        {!useGeo && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={location.city}
                                    onChange={e => handleManualInput('city', e.target.value)}
                                    className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/50 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                                    placeholder="London"
                                />
                                <input
                                    type="text"
                                    value={location.country}
                                    onChange={e => handleManualInput('country', e.target.value)}
                                    className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/50 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                                    placeholder="UK"
                                />
                            </div>
                        )}

                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:ring-[#D4AF37] focus:border-[#D4AF37] appearance-none cursor-pointer"
                        >
                            {CALCULATION_METHODS.map(m => (
                                <option key={m.id} value={m.id} className="text-[#1A4D2E]">{m.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <div className="animate-spin text-[#D4AF37] mb-2"><Clock className="w-8 h-8" /></div>
                    <p>Fetching prayer times...</p>
                </div>
            ) : error ? (
                <div className="text-center p-8 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                    <p>Could not load prayer times. Please check city name.</p>
                </div>
            ) : (
                <div className="px-1">
                    {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => (
                        <PrayerRow
                            key={name}
                            name={name}
                            time={prayers?.[name]}
                            icon={name === 'Fajr' || name === 'Isha' ? Moon : name === 'Maghrib' ? Sunset : name === 'Sunrise' ? Sunrise : Sun}
                            isNext={nextPrayer === name}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
