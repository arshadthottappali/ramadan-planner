import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DayNavigator({ currentDay, onDayChange }) {
    return (
        <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-[#EBE7DE]/50 shadow-sm">
            <button
                onClick={() => onDayChange(Math.max(1, currentDay - 1))}
                disabled={currentDay === 1}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-[#1A4D2E] shadow-sm disabled:opacity-50 hover:bg-slate-50"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center leading-none">
                <span className="font-serif text-lg font-bold text-[#1A4D2E]">Day {currentDay}</span>
            </div>

            <button
                onClick={() => onDayChange(Math.min(30, currentDay + 1))}
                disabled={currentDay === 30}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#D4AF37] text-white shadow-sm disabled:opacity-50 hover:bg-[#c4a030]"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
