import { useState } from 'react';
import { ArrowRight, Moon } from 'lucide-react';

export default function Onboarding({ onComplete }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onComplete(name.trim());
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-[#1A4D2E] rounded-full flex items-center justify-center mb-8 shadow-xl shadow-[#1A4D2E]/20">
                <Moon className="w-10 h-10 text-[#D4AF37]" />
            </div>

            <h1 className="text-3xl font-serif font-bold text-[#1A4D2E] mb-2">Welcome to Ramadan Planner</h1>
            <p className="text-slate-500 mb-8 max-w-xs">Let's make this your best Ramadan yet. What should we call you?</p>

            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
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
                    Start Journey
                    <ArrowRight className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
