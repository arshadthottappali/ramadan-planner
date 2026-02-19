import { Check } from 'lucide-react';

export function Checkbox({ label, checked, onChange, subLabel, className = '' }) {
    return (
        <label className={`
      flex items-center gap-3 cursor-pointer group py-3 border-b border-dashed border-[#EBE7DE] last:border-0
      ${className}
    `}>
            <div className={`
        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0
        ${checked
                    ? 'bg-[#1A4D2E] border-[#1A4D2E]'
                    : 'bg-white border-[#D1D5DB]'
                }
      `}>
                {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <div className="flex-1">
                <span className={`text-base font-medium transition-colors ${checked ? 'text-[#1A4D2E] line-through opacity-70' : 'text-[#374151]'}`}>
                    {label}
                </span>
                {subLabel && <p className="text-xs text-slate-400 mt-0.5">{subLabel}</p>}
            </div>
            <input
                type="checkbox"
                className="hidden"
                checked={checked || false}
                onChange={(e) => onChange(e.target.checked)}
            />
        </label>
    )
}
