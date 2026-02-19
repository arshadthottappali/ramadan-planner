import { useState } from 'react';
import { ArrowRight, Moon } from 'lucide-react';


export default function Onboarding({ onComplete }) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [date, setDate] = useState('2026-02-18');

    const handleNameSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) setStep(2);
    };

    const handleDateSubmit = (e) => {
        e.preventDefault();
        onComplete(name.trim(), date);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-[#1A4D2E] rounded-full flex items-center justify-center mb-8 shadow-xl shadow-[#1A4D2E]/20">
                <Moon className="w-10 h-10 text-[#D4AF37]" />
            </div>

            <h1 className="text-3xl font-serif font-bold text-[#1A4D2E] mb-2">Welcome to Ramadan Planner</h1>

            {step === 1 ? (
                <>
                    <p className="text-slate-500 mb-8 max-w-xs">Let's make this your best Ramadan yet. What should we call you?</p>
                    <form onSubmit={handleNameSubmit} className="w-full max-w-xs space-y-4">
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full bg-white border-none shadow-sm rounded-2xl px-6 py-4 text-center text-lg focus:ring-2 focus:ring-[#D4AF37] placeholder:text-slate-300"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={20}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="w-full bg-[#1A4D2E] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#1A4D2E]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none hover:bg-[#143d24] transition-all"
                        >
                            Next
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <p className="text-slate-500 mb-8 max-w-xs">When is the first day of Ramadan for you?</p>
                    <form onSubmit={handleDateSubmit} className="w-full max-w-xs space-y-4">
                        <input
                            type="date"
                            required
                            className="w-full bg-white border-none shadow-sm rounded-2xl px-6 py-4 text-center text-lg focus:ring-2 focus:ring-[#D4AF37] text-[#1A4D2E]"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!date}
                            className="w-full bg-[#1A4D2E] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#1A4D2E]/20 flex items-center justify-center gap-2 hover:bg-[#143d24] transition-all disabled:opacity-50 disabled:shadow-none"
                        >
                            Start Journey
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-sm text-slate-400 hover:text-[#1A4D2E]"
                        >
                            Back
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
