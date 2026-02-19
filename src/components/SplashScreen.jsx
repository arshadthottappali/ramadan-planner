import { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 500); // Wait for fade out
        }, 2000);
        return () => clearTimeout(timer);
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[100] bg-[#FDFBF7] flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="text-center animate-in fade-in zoom-in duration-1000">
                <div className="text-4xl md:text-6xl font-serif text-[#1A4D2E] mb-4">
                    بِسْمِ ٱللَّٰهِ
                </div>
                <p className="text-[#D4AF37] tracking-[0.2em] text-sm uppercase">In the name of Allah</p>
            </div>
        </div>
    );
}
