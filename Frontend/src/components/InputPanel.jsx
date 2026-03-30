const InputPanel = ({ url, setUrl, loadSite }) => {
    return (
        <div className="p-5 bg-[#0d0d0d] border-b border-neutral-800/50 flex justify-center">

            {/* Container with sm:flex-row for better mobile responsiveness */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl relative">

                {/* Input Field Container */}
                <div className="relative flex-1 group">

                    {/* Link Icon: Jab input pe click (focus) hoga, toh icon yellow glow karega */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-300 group-focus-within:text-yellow-500 text-neutral-500">
                        <i className="ri-link text-lg"></i>
                    </div>

                    <input
                        type="text"
                        placeholder="Enter website URL (e.g., https://example.com)..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-[#121212] text-gray-100 border border-neutral-800 hover:border-neutral-600 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all duration-300 placeholder-neutral-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] cursor-text"
                    />
                </div>

                {/* Premium Load Button */}
                <button
                    onClick={loadSite}
                    className="group relative flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent text-yellow-500 font-bold tracking-wider rounded-lg border border-yellow-500/50 hover:bg-yellow-500 hover:text-[#0a0a0a] hover:border-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all duration-300 active:scale-95 cursor-pointer"
                >
                    <span>Load Site</span>
                    <i className="ri-flashlight-line text-xl leading-none transform group-hover:rotate-12 transition-transform duration-300"></i>
                </button>

            </div>
        </div>
    );
};

export default InputPanel;