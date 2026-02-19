import { Book, PlayCircle, ExternalLink, Heart, Bookmark, Star, Trash2, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { STUDY_RESOURCES } from '../lib/constants';
import { ADKAR_DATA } from '../lib/adkar_data';
import { useState } from 'react';

export default function StudyView({ customResources, onAddResource, onRemoveResource, day, dayData, toggleAdkar }) {
    const [newRes, setNewRes] = useState({ title: '', type: 'Youtube', link: '' });
    const [activeAdkar, setActiveAdkar] = useState('post_prayer'); // morning, evening, post_prayer

    const handleAdd = () => {
        if (newRes.title.trim()) {
            onAddResource(newRes);
            setNewRes({ title: '', type: 'Youtube', link: '' });
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* 1. Daily Adkar Section (New) */}
            <div className="mb-8 px-1">
                <h3 className="font-serif font-bold text-xl text-[#1A4D2E] mb-4 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-[#D4AF37]" />
                    Daily Adkar
                </h3>

                {/* Adkar Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                    <button
                        onClick={() => setActiveAdkar('post_prayer')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeAdkar === 'post_prayer' ? 'bg-white text-[#1A4D2E] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        After Prayer
                    </button>
                    <button
                        onClick={() => setActiveAdkar('morning')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeAdkar === 'morning' ? 'bg-white text-[#1A4D2E] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Morning
                    </button>
                    <button
                        onClick={() => setActiveAdkar('evening')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeAdkar === 'evening' ? 'bg-white text-[#1A4D2E] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Evening
                    </button>
                </div>

                {/* Adkar List */}
                <div className="space-y-4">
                    <div className="space-y-4">
                        {ADKAR_DATA[activeAdkar].map((item) => {
                            const isCompleted = dayData?.adkar?.[activeAdkar]?.[item.id];
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => toggleAdkar && toggleAdkar(day, activeAdkar, item.id)}
                                    className={`p-6 rounded-[2rem] shadow-sm border transition-all cursor-pointer group ${isCompleted
                                        ? 'bg-[#F0FDF4] border-[#1A4D2E] ring-1 ring-[#1A4D2E]'
                                        : 'bg-white border-slate-100 hover:border-[#D4AF37]/30'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-[#1A4D2E] text-lg">{item.title}</h4>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-[#1A4D2E] text-white' : 'bg-[#f8fafc] text-slate-300 group-hover:text-[#D4AF37]'
                                            }`}>
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className={`text-center p-6 rounded-2xl border mb-3 transition-colors ${isCompleted ? 'bg-white border-[#1A4D2E]/20' : 'bg-[#FDFBF7] border-[#EBE7DE]'
                                        }`}>
                                        <p className="font-serif text-2xl text-[#1A4D2E] leading-loose" dir="rtl">{item.arab}</p>
                                    </div>
                                    <p className="text-sm text-slate-500 italic text-center px-4">"{item.trans}"</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 2. User's Watchlist (Custom Resources) */}
            <div className="mb-8 px-1 pt-6 border-t border-dashed border-slate-200">
                <h3 className="font-serif font-bold text-xl text-[#1A4D2E] mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#D4AF37]" />
                    My Watchlist
                </h3>

                {customResources && customResources.length > 0 ? (
                    <div className="space-y-4 mb-4">
                        {customResources.map((item) => (
                            <div key={item.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-[#D4AF37]/30 transition-colors group relative">
                                <button
                                    onClick={() => onRemoveResource(item.id)}
                                    className="absolute top-4 right-4 text-slate-300 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="flex justify-between items-start mb-2 pr-8">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'Youtube' ? 'bg-red-50 text-red-500' : 'bg-[#FFFBEB] text-[#D4AF37]'}`}>
                                            {item.type === 'Youtube' ? <PlayCircle className="w-5 h-5" /> : <Book className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1A4D2E] text-lg leading-tight">{item.title}</h4>
                                            <p className="text-xs text-slate-400">{item.type} • Added recently</p>
                                        </div>
                                    </div>
                                    {item.link && (
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#1A4D2E]">
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200 mb-4">
                        <p className="text-slate-400 text-sm">You haven't added any series yet.</p>
                    </div>
                )}

                {/* Add New Resource Form */}
                <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
                    <div className="text-sm font-bold text-[#1A4D2E] mb-3">Add Custom Resource</div>
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Title (e.g. My Fav Lecture)"
                            className="w-full bg-slate-50 border-none rounded-xl text-sm focus:ring-[#D4AF37] px-3 py-2"
                            value={newRes.title}
                            onChange={e => setNewRes({ ...newRes, title: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <select
                                className="bg-slate-50 border-none rounded-xl text-sm focus:ring-[#D4AF37] px-2 py-2"
                                value={newRes.type}
                                onChange={e => setNewRes({ ...newRes, type: e.target.value })}
                            >
                                <option value="Youtube">YouTube</option>
                                <option value="Book">Book</option>
                                <option value="Article">Article</option>
                                <option value="Other">Other</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Link (https://...)"
                                className="flex-1 bg-slate-50 border-none rounded-xl text-sm focus:ring-[#D4AF37] px-3 py-2"
                                value={newRes.link}
                                onChange={e => setNewRes({ ...newRes, link: e.target.value })}
                            />
                            <button
                                onClick={handleAdd}
                                className="bg-[#1A4D2E] text-white px-4 rounded-xl font-bold text-sm hover:bg-[#143d24]"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Daily Essentials */}
            {STUDY_RESOURCES.map((section, idx) => (
                <div key={idx} className="mb-8 px-1 pt-6 border-t border-dashed border-slate-200">
                    <h3 className="font-serif font-bold text-xl text-[#1A4D2E] mb-4 flex items-center gap-2">
                        {section.category === 'Daily Essentials' ? <Heart className="w-5 h-5 text-[#D4AF37]" /> : <Bookmark className="w-5 h-5 text-[#D4AF37]" />}
                        {section.category}
                    </h3>

                    <div className="space-y-4">
                        {section.items.map((item, i) => (
                            <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:border-[#D4AF37]/30 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'Youtube' ? 'bg-red-50 text-red-500' : 'bg-[#FFFBEB] text-[#D4AF37]'}`}>
                                            {item.type === 'Youtube' ? <PlayCircle className="w-5 h-5" /> : <Book className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#1A4D2E] text-lg leading-tight">{item.title}</h4>
                                            {item.host && <p className="text-xs text-slate-400">{item.host}</p>}
                                        </div>
                                    </div>
                                    {item.link && (
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-[#1A4D2E]">
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>

                                {item.arab && (
                                    <div className="mt-4 text-center bg-[#FDFBF7] p-4 rounded-xl border border-[#EBE7DE]">
                                        <p className="font-serif text-2xl text-[#1A4D2E] mb-2 leading-loose">{item.arab}</p>
                                        <p className="text-sm text-slate-500 italic">"{item.trans}"</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

        </div>
    );
}
