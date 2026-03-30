import { useState } from "react";
import { toast } from "sonner";

const XPathPanel = ({ data }) => {
    const [mode, setMode] = useState("xpath");

    const list = mode === "xpath" ? data?.xpaths : data?.css;

    // 📋 Copy Handler Function
    const handleCopy = (text, type) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${type} copied to clipboard! 📋`, {
            style: {
                background: '#1a1a1a',
                color: '#e5e7eb',
                border: '1px solid #eab308' // Yellow border
            }
        });
    };

    // ✨ EMPTY STATE: Jab tak koi element select nahi hota
    if (!data || Object.keys(data).length === 0) {
        return (
            <div className="w-[30%] bg-[#0a0a0a] border-l border-neutral-800/50 flex flex-col items-center justify-center p-8 text-center h-full">
                <div className="w-16 h-16 rounded-full bg-[#121212] border border-neutral-800 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                    <i className="ri-code-box-line text-3xl text-neutral-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-200 mb-2 tracking-tight">Inspect Element</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                    Hover and click on any element in the preview area to generate its XPath and CSS selectors.
                </p>
            </div>
        );
    }

    return (
        <div className="w-[30%] bg-[#0a0a0a] border-l border-neutral-800/50 flex flex-col h-full">

            {/* Header */}
            <div className="p-5 border-b border-neutral-800/50 bg-[#0d0d0d]">
                <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 flex items-center gap-2">
                    <i className="ri-tools-line text-yellow-500"></i>
                    Selectors
                </h2>
            </div>

            <div className="p-5 flex-1 flex flex-col overflow-hidden">
                {/* 🔥 DEFAULT XPATH CARD */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <i className="ri-star-fill"></i> Default XPath
                    </h3>

                    <div
                        className="group relative p-3 bg-[#121212] border border-yellow-500/30 rounded-xl hover:border-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.1)] transition-all cursor-pointer flex items-start gap-3"
                        onClick={() => handleCopy(data?.defaultXPath, "Default XPath")}
                    >
                        <div className="flex-1 break-all text-sm text-gray-200 font-mono mt-0.5">
                            {data?.defaultXPath}
                        </div>
                        {/* Copy Icon */}
                        <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:bg-yellow-500 group-hover:text-[#0a0a0a] group-hover:border-yellow-500 transition-colors shrink-0">
                            <i className="ri-clipboard-line"></i>
                        </div>
                    </div>
                </div>

                {/* 🔘 PREMIUM SEGMENTED TOGGLE */}
                <div className="flex p-1 mb-4 bg-[#121212] border border-neutral-800 rounded-lg">
                    <button
                        onClick={() => setMode("xpath")}
                        className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ${mode === "xpath"
                                ? "bg-[#1a1a1a] text-yellow-500 shadow-sm border border-neutral-700/50"
                                : "text-neutral-500 hover:text-gray-300"
                            }`}
                    >
                        XPath List
                    </button>
                    <button
                        onClick={() => setMode("css")}
                        className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ${mode === "css"
                                ? "bg-[#1a1a1a] text-yellow-500 shadow-sm border border-neutral-700/50"
                                : "text-neutral-500 hover:text-gray-300"
                            }`}
                    >
                        CSS Selectors
                    </button>
                </div>

                {/* 🔥 MULTIPLE LIST (Custom Scrollbar UI) */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {list?.map((item, i) => (
                        <div
                            key={i}
                            className="group relative p-3 bg-[#121212] border border-neutral-800 rounded-lg hover:border-neutral-500 hover:bg-[#151515] transition-all cursor-pointer flex items-center justify-between gap-3"
                            onClick={() => handleCopy(item, mode === "xpath" ? "XPath" : "CSS Selector")}
                        >
                            <div className="flex-1 break-all text-sm text-neutral-300 font-mono group-hover:text-white transition-colors">
                                {item}
                            </div>
                            {/* Copy Icon on Hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-yellow-500 shrink-0">
                                <i className="ri-file-copy-line text-lg"></i>
                            </div>
                        </div>
                    ))}

                    {/* Fallback agar list khali ho */}
                    {(!list || list.length === 0) && (
                        <div className="text-center text-neutral-500 text-sm py-4 italic">
                            No {mode.toUpperCase()} found for this element.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default XPathPanel;