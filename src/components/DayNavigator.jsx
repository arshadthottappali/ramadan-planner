import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DayNavigator({ currentDay, onDayChange }) {
    return (
        <div className="flex items-center justify-between bg-[#F4F1EA] p-1 rounded-full border border-[#EBE7DE]">
            <button
                onClick={() => onDayChange(Math.max(1, currentDay - 1))}
                disabled={currentDay === 1}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#1A4D2E] shadow-sm disabled:opacity-50"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-serif text-lg font-bold text-[#1A4D2E]">Day {currentDay}</span>

            <button
                onClick={() => onDayChange(Math.min(30, currentDay + 1))}
                disabled={currentDay === 30}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#D4AF37] text-white shadow-sm disabled:opacity-50"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
