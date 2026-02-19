import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Checkbox } from './ui/Checkbox';

export default function CustomActivities({ day, custom, addCustom, toggleCustom, deleteCustom }) {
    const [newActivity, setNewActivity] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newActivity.trim()) return;
        addCustom(day, newActivity);
        setNewActivity('');
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mt-6">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                <Plus className="w-5 h-5 text-secondary" />
                <h3 className="font-serif font-bold text-slate-800 text-lg">Custom Activities</h3>
            </div>

            <div className="space-y-3 mb-4">
                {custom && custom.map(item => (
                    <div key={item.id} className="flex items-center justify-between group">
                        <Checkbox
                            label={item.text}
                            checked={item.completed}
                            onChange={() => toggleCustom(day, item.id)}
                        />
                        <button
                            onClick={() => deleteCustom(day, item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete activity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {(!custom || custom.length === 0) && (
                    <p className="text-sm text-slate-400 italic">No custom activities added for this day.</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    className="flex-1 rounded-lg border-slate-200 text-sm focus:ring-primary focus:border-primary"
                    placeholder="Add new activity..."
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={!newActivity.trim()}
                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Add
                </button>
            </form>
        </div>
    );
}
