import { PRAYERS, EXTRA_PRAYERS, DHIKR, SURAHS } from '../lib/constants';
import { Checkbox } from './ui/Checkbox';
import { BookOpen, Moon, Sun, Clock, PenLine, Tv, Star, MoreHorizontal, PlayCircle, Book, CheckCircle2, ChevronDown, Repeat } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function DayView({ day, data, updateDay, updateDayField, onGoalComplete, settings, updateSettings }) {

    // Ref to track if we already celebrated today's Quran goal
    const quranCelebrated = useRef(false);

    // Local state for toggle (synced with data but local for UI responsiveness if needed)
    // We use data.quran.tracking_type directly.

    const Card = ({ title, icon: Icon, children, className = '', action }) => (
        <div className={`bg-white rounded-[2rem] p-6 shadow-sm border border-[#F3F4F6] mb-6 ${className} transition-transform active:scale-[0.99] duration-300 relative`}>
            <div className="flex items-center justify-between mb-4 relative z-20">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-5 h-5 text-[#D4AF37]" />}
                    <h3 className="font-serif font-bold text-xl text-[#1A4D2E]">{title}</h3>
                </div>
                {action}
            </div>
            {children}
        </div>
    );

    // Helper to safely get quran data (migrated or new)
    const quranData = data.quran || {};
    const trackingType = quranData.tracking_type || 'pages'; // default to pages
    const pagesRead = parseInt(quranData.pages_read) || 0;
    const juzRead = parseInt(quranData.juz_read) || 0;

    // Calculate Progress accurately
    const totalPages = 604;
    const totalJuz = 30;

    let progress = 0;
    let currentVal = 0;
    let goalText = "";

    const [targetPace, setTargetPace] = useState(20);

    // Sync local pace with settings
    useEffect(() => {
        // Assuming 'settings' is available in this scope, e.g., from a parent prop or context
        // For this snippet, 'settings' is not explicitly defined in the provided context,
        // but it's used later in the Goal Settings Dropdown.
        // If 'settings' is a prop, it should be added to the DayView signature.
        // If it's state, it should be defined here.
        // For now, assuming it's accessible.
        if (typeof settings !== 'undefined' && settings && settings.customDailyPages) {
            setTargetPace(settings.customDailyPages);
        }
    }, [settings]);

    if (trackingType === 'pages') {
        progress = Math.min(100, Math.round((pagesRead / totalPages) * 100));
        currentVal = pagesRead;
        // Goal: Finish 604 pages in 30 days ~= 20 pages/day
        const targetPage = day * targetPace;
        goalText = `Page ${targetPage}`;
    } else {
        progress = Math.min(100, Math.round((juzRead / totalJuz) * 100));
        currentVal = juzRead;
        // ~20 pages per Juz. 
        // If pace is 20/day -> Day 1 = 20 pages = Juz 1.
        // If pace is 40/day -> Day 1 = 40 pages = Juz 2.
        const targetJuz = Math.ceil((day * targetPace) / 20);
        goalText = `Juz ${targetJuz}`;
    }

    // Check for goal completion (simple demo: every 10 pages or 1 juz)
    useEffect(() => {
        if (trackingType === 'pages') {
            if (pagesRead > 0 && pagesRead % 10 === 0 && !quranCelebrated.current) {
                onGoalComplete && onGoalComplete();
                quranCelebrated.current = true;
            } else if (pagesRead % 10 !== 0) {
                quranCelebrated.current = false;
            }
        } else {
            if (juzRead > 0 && !quranCelebrated.current) { // Celebrate every Juz increment? potentially logic needs refinement to track 'new' completion
                // For now, simple trigger on change if it's a new juz
                // But strict 'every juz' logic requires prev state. 
                // Lets just leave simple check: if juzRead changed and > 0 (handled by parent update mostly)
            }
        }
    }, [pagesRead, juzRead, trackingType, onGoalComplete]);

    const toggleTrackingType = () => {
        const newType = trackingType === 'pages' ? 'juz' : 'pages';
        updateDay(day, 'quran', 'tracking_type', newType);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 pb-16">

            {/* 1. Quran Tracker Widget (First Priority) */}
            <Card title="Qur'an Tracker" icon={BookOpen} className="bg-[#FFFBEB] border-[#FEF3C7] relative overflow-hidden"
                action={
                    <button onClick={toggleTrackingType} className="flex items-center gap-1 px-2 py-1 bg-white/50 rounded-lg text-xs font-bold text-[#1A4D2E] border border-[#1A4D2E]/10 hover:bg-white transition-colors cursor-pointer relative z-30">
                        <Repeat className="w-3 h-3" />
                        {trackingType === 'pages' ? 'Pages' : 'Juz'}
                    </button>
                }
            >
                {/* Decorative background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10" />

                <div className="flex items-center gap-6 relative z-10">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-[#D4AF37] blur-2xl opacity-20 rounded-full" />

                        <svg className="w-full h-full transform -rotate-90 drop-shadow-md">
                            <circle cx="48" cy="48" r="40" stroke="#FDE68A" strokeWidth="8" fill="none" opacity="0.5" />
                            <circle cx="48" cy="48" r="40" stroke="#D4AF37" strokeWidth="8" fill="none"
                                strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progress) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-xl font-bold text-[#1A4D2E]">{progress}%</span>
                            <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider">Complete</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-2 relative">
                            <div>
                                <span className="text-sm text-slate-500 font-medium block">Current Goal</span>
                                <div className="flex items-center gap-1 cursor-pointer group" onClick={() => document.getElementById('goal-settings').classList.toggle('hidden')}>
                                    <span className="font-bold text-[#1A4D2E] whitespace-nowrap border-b border-dashed border-[#1A4D2E]/30">{goalText}</span>
                                    <ChevronDown className="w-3 h-3 text-[#1A4D2E] opacity-50 group-hover:opacity-100" />
                                </div>
                            </div>

                            {/* Goal Settings Dropdown */}
                            <div id="goal-settings" className="hidden absolute top-full left-0 mt-2 bg-white p-4 rounded-xl shadow-xl z-50 border border-slate-100 w-64 animate-in fade-in zoom-in-95">
                                <h4 className="font-bold text-[#1A4D2E] text-sm mb-3">Set Reading Pace</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => { updateSettings({ quranGoal: 'khatam-1', customDailyPages: 20 }); document.getElementById('goal-settings').classList.add('hidden'); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${settings.quranGoal === 'khatam-1' ? 'bg-[#1A4D2E] text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        1 Khatam (20 pages/day)
                                    </button>
                                    <button
                                        onClick={() => { updateSettings({ quranGoal: 'khatam-2', customDailyPages: 40 }); document.getElementById('goal-settings').classList.add('hidden'); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${settings.quranGoal === 'khatam-2' ? 'bg-[#1A4D2E] text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        2 Khatams (40 pages/day)
                                    </button>
                                    <div className="pt-2 border-t border-slate-100">
                                        <div className="text-xs text-slate-400 mb-1">Custom Pages / Day</div>
                                        <input
                                            type="number"
                                            value={settings.customDailyPages}
                                            onChange={(e) => updateSettings({ quranGoal: 'custom', customDailyPages: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-slate-50 border-none rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl shadow-sm border border-orange-100 justify-between">
                            <button
                                onClick={() => {
                                    const field = trackingType === 'pages' ? 'pages_read' : 'juz_read';
                                    updateDay(day, 'quran', field, Math.max(0, currentVal - 1));
                                }}
                                className="w-8 h-8 flex items-center justify-center bg-orange-50 rounded-lg text-orange-600 hover:bg-orange-100 transition-colors"
                            >-</button>
                            <input
                                type="number"
                                className="w-16 text-center font-bold text-[#1A4D2E] bg-transparent border-none p-0 focus:ring-0 text-lg"
                                value={currentVal}
                                onChange={e => {
                                    const field = trackingType === 'pages' ? 'pages_read' : 'juz_read';
                                    updateDay(day, 'quran', field, e.target.value);
                                }}
                            />
                            <button
                                onClick={() => {
                                    const field = trackingType === 'pages' ? 'pages_read' : 'juz_read';
                                    const max = trackingType === 'pages' ? 604 : 30;
                                    if (currentVal < max) updateDay(day, 'quran', field, currentVal + 1);
                                }}
                                className="w-8 h-8 flex items-center justify-center bg-[#D4AF37] rounded-lg text-white shadow-md hover:bg-[#b5952f] transition-all active:scale-90"
                            >+</button>
                        </div>
                    </div>
                </div>

                {/* Memorization sub-section with Surah Selector and Ayah Range */}
                <div className="mt-6 pt-4 border-t border-dashed border-[#D4AF37]/30">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1A4D2E]" />
                        <span className="text-sm font-bold text-[#1A4D2E]">Memorization Log</span>
                    </div>

                    {/* Surah Selector */}
                    <div className="relative mb-3">
                        <select
                            className="w-full bg-white border-slate-200 rounded-xl text-sm py-2.5 px-3 focus:ring-[#D4AF37] focus:border-[#D4AF37] appearance-none"
                            value={quranData.memorization_surah || ""}
                            onChange={e => updateDay(day, 'quran', 'memorization_surah', e.target.value)}
                        >
                            <option value="" disabled>Choose a Surah</option>
                            {SURAHS.map(surah => (
                                <option key={surah} value={surah}>{surah}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Ayah Range Inputs */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-[#D4AF37] focus-within:border-[#D4AF37]">
                            <span className="text-xs text-slate-400 mr-2">Ayah</span>
                            <input
                                type="number"
                                placeholder="Start"
                                className="w-full border-none p-0 focus:ring-0 text-sm font-medium text-[#1A4D2E]"
                                value={quranData.memorization_ayah_start || ""}
                                onChange={e => updateDay(day, 'quran', 'memorization_ayah_start', e.target.value)}
                            />
                        </div>
                        <span className="text-slate-300">-</span>
                        <div className="flex-1 flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 focus-within:ring-1 focus-within:ring-[#D4AF37] focus-within:border-[#D4AF37]">
                            <span className="text-xs text-slate-400 mr-2">Ayah</span>
                            <input
                                type="number"
                                placeholder="End"
                                className="w-full border-none p-0 focus:ring-0 text-sm font-medium text-[#1A4D2E]"
                                value={quranData.memorization_ayah_end || ""}
                                onChange={e => updateDay(day, 'quran', 'memorization_ayah_end', e.target.value)}
                            />
                        </div>
                    </div>

                </div>
            </Card>

            {/* 2. Spiritual Activities (Checklist) */}
            <Card title="Spiritual Activities" icon={Star} action={<div className="px-3 py-1 bg-[#1A4D2E] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Daily Fard</div>}>
                <div className="mb-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span>Obligatory Prayers</span>
                        <div className="h-px bg-slate-100 flex-1" />
                    </h4>
                    <div className="space-y-1">
                        {PRAYERS.map(prayer => (
                            <Checkbox
                                key={prayer.id}
                                label={prayer.label}
                                checked={data.prayers[prayer.id]}
                                onChange={(val) => {
                                    updateDay(day, 'prayers', prayer.id, val);
                                    if (val && Math.random() > 0.7) onGoalComplete && onGoalComplete(); // Random celebration
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-6 flex items-center gap-2">
                        <span>Sunnah & Extra</span>
                        <div className="h-px bg-slate-100 flex-1" />
                    </h4>
                    <Checkbox label="Morning Dhikr" checked={data.dhikr.morning_dhikr} onChange={v => updateDay(day, 'dhikr', 'morning_dhikr', v)} />
                    <Checkbox label="Evening Dhikr" checked={data.dhikr.evening_dhikr} onChange={v => updateDay(day, 'dhikr', 'evening_dhikr', v)} />
                    <Checkbox label="Taraweeh" checked={data.extra_prayers.taraweeh} onChange={v => updateDay(day, 'extra_prayers', 'taraweeh', v)} />
                    <Checkbox label="Qiyam / Tahajjud" checked={data.extra_prayers.tahajjud} onChange={v => updateDay(day, 'extra_prayers', 'tahajjud', v)} />
                </div>
            </Card>

            {/* 3. Knowledge & Learning */}
            <Card title="Knowledge & Learning" icon={Book}>
                <div className="space-y-3">
                    <div className="group flex items-center gap-4 bg-[#FFFBEB] p-4 rounded-2xl border border-[#FEF3C7] hover:border-[#D4AF37] transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-[#ffedd5] flex items-center justify-center text-[#c2410c] group-hover:scale-110 transition-transform">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-[#1A4D2E]">Offline Reading</div>
                            <div className="text-xs text-slate-500">Books, Seerah, Tafseer</div>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                            <input
                                type="number"
                                className="w-10 text-center text-lg font-bold border-none p-0 focus:ring-0 text-[#D4AF37]"
                                value={data.studies.offline_mins}
                                onChange={e => updateDay(day, 'studies', 'offline_mins', e.target.value)}
                                placeholder="0"
                            />
                            <span className="text-xs text-slate-400 font-medium">min</span>
                        </div>
                    </div>

                    <div className="group flex items-center gap-4 bg-[#F0F9FF] p-4 rounded-2xl border border-[#E0F2FE] hover:border-[#3b82f6] transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-[#dbeafe] flex items-center justify-center text-[#2563eb] group-hover:scale-110 transition-transform">
                            <PlayCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-[#1A4D2E]">Online Classes</div>
                            <div className="text-xs text-slate-500">YouTube, Lectures</div>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                            <input
                                type="number"
                                className="w-10 text-center text-lg font-bold border-none p-0 focus:ring-0 text-[#2563eb]"
                                value={data.studies.online_mins}
                                onChange={e => updateDay(day, 'studies', 'online_mins', e.target.value)}
                                placeholder="0"
                            />
                            <span className="text-xs text-slate-400 font-medium">min</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 4. Notes & Reflections (Lined Paper) */}
            <div className="bg-[#FFFBEB] rounded-[2rem] p-6 shadow-sm border border-[#FEF3C7] mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#D4AF37] opacity-20" />
                <div className="flex items-center gap-2 mb-4">
                    <PenLine className="w-5 h-5 text-[#1A4D2E]" />
                    <h3 className="font-serif font-bold text-xl text-[#1A4D2E]">Notes & Reflections</h3>
                </div>
                <textarea
                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-[#1A4D2E] text-lg leading-8 lined-paper pl-0"
                    rows={6}
                    placeholder="Write your thoughts, duas, or plans for tomorrow here..."
                    value={data.notes}
                    onChange={e => updateDayField(day, 'notes', e.target.value)}
                    style={{ backgroundImage: 'linear-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '100% 2rem', lineHeight: '2rem' }}
                />
            </div>

            {/* 5. Custom Goals / Priority */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-20">
                <h3 className="font-serif font-bold text-xl text-[#1A4D2E] mb-4">Priority for Tomorrow</h3>
                <div className="flex items-center gap-3">
                    <div className="text-[#D4AF37]">
                        <Star className="w-6 h-6 fill-current animate-pulse" />
                    </div>
                    <input
                        type="text"
                        placeholder="What is your main goal?"
                        className="flex-1 border-none focus:ring-0 text-slate-600 placeholder:text-slate-300 text-lg"
                        value={data.plans_tomorrow}
                        onChange={e => updateDayField(day, 'plans_tomorrow', e.target.value)}
                    />
                </div>
            </div>

        </div>
    );
}
