import { BarChart, Activity, BookOpen, Trophy, TrendingUp, Calendar, Info, Settings, Download, Trash2 } from 'lucide-react';

export default function StatsView({ data, settings, updateSettings, onExport, onReset }) {

    // --- Data Processing ---

    // 1. Quran Progress (Cumulative Phase)
    const totalPages = 604;
    const RAMADAN_LENGTH = 30;
    let maxPage = 0;
    let daysTracked = 0;

    // Burndown Data
    const burndownData = [];

    for (let i = 1; i <= RAMADAN_LENGTH; i++) {
        const dayData = data[i];
        const ideal = Math.round((i / RAMADAN_LENGTH) * totalPages);

        let actual = null;
        if (dayData && dayData.quran && dayData.quran.pages_read) {
            actual = parseInt(dayData.quran.pages_read);
            if (actual > maxPage) maxPage = actual;
            daysTracked = i; // simple assumption: last day with data is "current day"
        }

        burndownData.push({ day: i, ideal, actual });
    }

    const quranProgress = Math.min(100, Math.round((maxPage / totalPages) * 100));

    // Projected Khatams Calculation
    // Rate = maxPage / daysTracked
    // Projection = Rate * 30
    // Khatams = Projection / 604
    let projectedKhatams = 0;
    let projectedPages = 0;

    if (daysTracked > 0) {
        const rate = maxPage / daysTracked;
        projectedPages = Math.round(rate * RAMADAN_LENGTH);
        projectedKhatams = (projectedPages / totalPages).toFixed(2);
    }

    // 2. Daily Activity Heatmap
    // Score based on Prayers (5), Quran (2), Dhikr (3) -> Total 10
    let totalPrayersDone = 0;
    let totalPrayersPossible = 0;
    const heatmapData = [];

    for (let i = 1; i <= RAMADAN_LENGTH; i++) {
        const dayData = data[i];
        let score = 0;

        if (dayData) {
            // Prayers
            if (dayData.prayers) {
                const done = Object.values(dayData.prayers).filter(Boolean).length;
                score += done;
                totalPrayersDone += done;
                totalPrayersPossible += 5;
            }

            // Quran
            if (dayData.quran && (dayData.quran.pages_read > 0 || dayData.quran.juz_read > 0)) {
                score += 2;
            }

            // Other habits
            if (dayData.dhikr?.morning_dhikr) score += 1;
            if (dayData.dhikr?.evening_dhikr) score += 1;
            if (dayData.extra_prayers?.taraweeh) score += 1;
        }

        // Normalize to 0-4 for color intensity
        // Max score 10. 0-2=1, 3-5=2, 6-8=3, 9-10=4
        let intensity = 0;
        if (score > 0) intensity = 1;
        if (score > 3) intensity = 2;
        if (score > 6) intensity = 3;
        if (score > 8) intensity = 4;

        heatmapData.push({ day: i, intensity, score });
    }

    const prayerAdherence = totalPrayersPossible > 0 ? Math.round((totalPrayersDone / totalPrayersPossible) * 100) : 0;

    // Chart Helpers
    const getX = (day) => (day / RAMADAN_LENGTH) * 300;
    const getY = (pages) => 100 - (pages / totalPages) * 100;
    const idealPath = `M 0 100 L 300 0`;
    let actualPath = "M 0 100";
    burndownData.forEach(d => {
        if (d.actual !== null) {
            actualPath += ` L ${getX(d.day)} ${getY(d.actual)}`;
        }
    });


    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">

            {/* Header Card */}
            <div className="bg-[#1A4D2E] text-white p-6 rounded-[2rem] shadow-xl mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-serif font-bold mb-1">Salam, {settings?.userName || 'Friend'}</h2>
                        <p className="text-white/60 text-xs uppercase tracking-widest">Ramadan Progress</p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md">
                        <Trophy className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 px-1">

                {/* 1. Quran Completion & Projection */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                                <h3 className="font-bold text-[#1A4D2E]">Qur'an Progress</h3>
                            </div>
                            <p className="text-slate-400 text-sm">Page {maxPage} of {totalPages}</p>
                        </div>
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="6" fill="none" />
                                <circle cx="32" cy="32" r="28" stroke="#1A4D2E" strokeWidth="6" fill="none"
                                    strokeDasharray="176" strokeDashoffset={176 - (176 * quranProgress) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute font-bold text-[#1A4D2E] text-xs">{quranProgress}%</span>
                        </div>
                    </div>

                    {/* Projection Badge */}
                    <div className="bg-[#FFFBEB] rounded-xl p-4 border border-[#FEF3C7] flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
                        <div>
                            <div className="text-xs text-[#92400e] font-bold uppercase tracking-wider mb-1">Current Pace Projection</div>
                            <div className="text-lg font-serif font-bold text-[#1A4D2E]">
                                {projectedKhatams} <span className="text-sm font-sans font-normal opacity-80">Khatams</span>
                            </div>
                            <div className="text-[10px] text-slate-500">Based on {daysTracked} days of reading</div>
                        </div>
                    </div>
                </div>

                {/* 2. Reading Burndown Chart */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-[#D4AF37]" />
                        <h3 className="font-bold text-[#1A4D2E]">Burndown Chart</h3>
                    </div>

                    <div className="h-40 w-full relative mb-2">
                        <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <line x1="0" y1="25" x2="300" y2="25" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                            <line x1="0" y1="75" x2="300" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                            <path d={idealPath} fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                            <path d={actualPath} fill="none" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            {burndownData.filter(d => d.actual !== null).map((d, i) => (
                                <circle key={i} cx={getX(d.day)} cy={getY(d.actual)} r="3" fill="#1A4D2E" />
                            ))}
                        </svg>
                        <div className="absolute bottom-0 left-0 text-[10px] text-slate-400">Day 1</div>
                        <div className="absolute bottom-0 right-0 text-[10px] text-slate-400">Day 30</div>
                    </div>
                </div>

                {/* 3. Daily Activity Heatmap */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#D4AF37]" />
                            <h3 className="font-bold text-[#1A4D2E]">Daily Activity</h3>
                        </div>
                        <div className="group relative">
                            <Info className="w-4 h-4 text-slate-300 cursor-help" />
                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Measures Prayers, Quran, and Habits completed each day.
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {heatmapData.map((d) => {
                            const colors = [
                                'bg-slate-100', // 0: Empty
                                'bg-[#d1fae5]', // 1: Low
                                'bg-[#6ee7b7]', // 2: Med
                                'bg-[#10b981]', // 3: High
                                'bg-[#065f46]', // 4: Max
                            ];
                            const color = colors[d.intensity] || colors[0];

                            return (
                                <div key={d.day} className="flex flex-col items-center gap-1">
                                    <div
                                        className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-[10px] font-bold ${d.intensity > 2 ? 'text-white' : 'text-slate-400'} transition-all hover:scale-110`}
                                        title={`Day ${d.day}: ${d.score} pts`}
                                    >
                                        {d.day}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-3 px-2">
                        <span className="text-[10px] text-slate-400">Less</span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-sm bg-slate-100" />
                            <div className="w-2 h-2 rounded-sm bg-[#d1fae5]" />
                            <div className="w-2 h-2 rounded-sm bg-[#6ee7b7]" />
                            <div className="w-2 h-2 rounded-sm bg-[#10b981]" />
                            <div className="w-2 h-2 rounded-sm bg-[#065f46]" />
                        </div>
                        <span className="text-[10px] text-slate-400">More</span>
                    </div>
                </div>

                {/* 4. Prayer Adherence Bar */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#D4AF37]" />
                            <h3 className="font-bold text-[#1A4D2E]">Prayer Consistency</h3>
                        </div>
                        <span className="font-bold text-2xl text-[#1A4D2E]">{prayerAdherence}%</span>
                    </div>

                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#1A4D2E] rounded-full transition-all duration-1000"
                            style={{ width: `${prayerAdherence}%` }}
                        />
                    </div>
                </div>

                {/* 5. Data Management */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Settings className="w-5 h-5 text-[#D4AF37]" />
                        <h3 className="font-bold text-[#1A4D2E]">Settings</h3>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#1A4D2E] font-bold focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                                value={settings.userName || ''}
                                onChange={(e) => updateSettings({ userName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ramadan Start Date</label>
                            <input
                                type="date"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#1A4D2E] font-bold focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                                value={settings.ramadanStartDate || '2026-02-18'}
                                onChange={(e) => updateSettings({ ramadanStartDate: e.target.value })}
                            />
                            <div className="flex items-center gap-2 mt-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <p className="text-[10px] text-green-700 font-medium">Changes saved automatically</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                        <Download className="w-5 h-5 text-[#D4AF37]" />
                        <h3 className="font-bold text-[#1A4D2E]">Data Management</h3>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onExport}
                            className="w-full py-3 bg-slate-50 text-[#1A4D2E] font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Backup Data (JSON)
                        </button>

                        <button
                            onClick={onReset}
                            className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Reset All Data
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
