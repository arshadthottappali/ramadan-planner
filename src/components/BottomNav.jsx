import { Home, BookOpen, Star, User } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'study', icon: BookOpen, label: 'Study' },
        { id: 'prayer', icon: Star, label: 'Prayer' }, // Using Star for "Spiritual"
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="absolute bottom-0 left-0 w-full bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#EBE7DE] pb-4 pt-2 px-6 z-50 rounded-t-3xl">
            <div className="flex justify-between items-center px-2">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 relative ${isActive ? '-translate-y-2' : ''}`}
                        >
                            {isActive && (
                                <div className="absolute -bottom-6 w-12 h-12 bg-[#D4AF37] rounded-full -z-10 blur-xl opacity-20" />
                            )}
                            <div className={`
                 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm
                 ${isActive ? 'bg-[#D4AF37] text-white shadow-lg scale-110' : 'text-slate-400 hover:bg-slate-50'}
               `}>
                                <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>
        </div>
    );
}
