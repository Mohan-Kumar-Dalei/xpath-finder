import { Link, Zap } from "lucide-react"; // 🔥 Lucide Icons

const InputPanel = ({ url, setUrl, loadSite }) => {
    return (
        <div className="p-5 bg-[#0f172a] border-b border-slate-800 flex justify-center relative z-10 shadow-sm">

            {/* Container with sm:flex-row for better mobile responsiveness */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl relative items-center">

                {/* Input Field Container */}
                <div className="relative flex-1 group w-full">

                    {/* Link Icon: Jab input pe click (focus) hoga, toh icon amber glow karega */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-300 group-focus-within:text-amber-500 text-slate-500">
                        <Link size={18} />
                    </div>

                    <input
                        type="text"
                        placeholder="Enter website URL (e.g., https://example.com)..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-[#020817] text-slate-100 border border-slate-700 hover:border-slate-600 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 placeholder:text-slate-600 shadow-inner cursor-text"
                    />
                </div>

                {/* 🔥 Premium Modern Load Button with Text Flip */}
                <button
                    onClick={loadSite}
                    className="group relative flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold tracking-wide rounded-xl hover:from-amber-400 hover:to-orange-400 shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.5)] transition-all duration-300 active:scale-95 shrink-0 w-full sm:w-auto cursor-pointer"
                >
                    {/* Text Flip Effect Container */}
                    <div className="h-5 overflow-hidden flex flex-col justify-start">
                        <span className="flex items-center h-5 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full">
                            Load Site
                        </span>
                        <span className="flex items-center h-5 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full text-slate-900">
                            Load Site
                        </span>
                    </div>

                    <Zap size={18} className="transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 drop-shadow-sm" />
                </button>

            </div>
        </div>
    );
};

export default InputPanel;