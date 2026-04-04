import { useState, useEffect } from "react";
import { Clock, Copyright } from "lucide-react"; // 🔥 Premium Lucide Icons

const Footer = () => {
    // Live time track karne ke liye state
    const [time, setTime] = useState(new Date());

    // Har second time update karne ke liye useEffect
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // Cleanup function
        return () => clearInterval(timer);
    }, []);

    return (
        // 🔥 CHANGED: Removed top border, added glassmorphism (bg-opacity + backdrop-blur)
        <footer className="px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 shrink-0">

            {/* Left Side: Copyright Section */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium tracking-wide">
                <Copyright size={14} className="text-slate-600" />
                <span>
                    {time.getFullYear()} XPath Finder by Mohan. All rights reserved.
                </span>
            </div>

            {/* Right Side: Real-Time Live Clock */}
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/20 shadow-sm transition-all hover:bg-amber-500/20 hover:shadow-amber-500/10">
                <Clock size={14} className="animate-pulse" />
                <span className="tracking-wider">
                    {time.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    })}
                </span>
            </div>

        </footer>
    );
};

export default Footer;