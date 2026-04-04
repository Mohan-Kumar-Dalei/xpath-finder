import { useState, useEffect } from "react";
import { toast } from "sonner";
import { socket } from "../utils/socket";
// 🔥 EXACT FIREWORK PRESET
import { confetti } from "@tsparticles/confetti";
// 🔥 PREMIUM ICONS IMPORT
import { Wrench, Sparkles, Rss, MousePointer2, Copy, Loader2, AlertCircle, Key, Edit3, Check } from "lucide-react";

const XPathPanel = ({ data, html }) => {
    const [mode, setMode] = useState("xpath");
    const list = mode === "xpath" ? data?.xpaths : data?.css;

    // ==========================================
    // 🤖 AI & LOCAL STORAGE STATES
    // ==========================================
    const [apiKey, setApiKey] = useState(() => {
        return localStorage.getItem("gemini_api_key") || "";
    });

    const [isKeySaved, setIsKeySaved] = useState(() => {
        return !!localStorage.getItem("gemini_api_key");
    });

    const [aiInput, setAiInput] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResults, setAiResults] = useState([]);

    const [feeds, setFeeds] = useState([]);

    const isSiteLoaded = !!html;
    const isHovered = data && Object.keys(data).length > 0 && data.defaultXPath;

    // ==========================================
    // 📡 HYBRID XML / ATOM FEED EXTRACTOR
    // ==========================================
    useEffect(() => {
        if (!html) {
            setFeeds([]);
            return;
        }
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const extractedFeeds = new Map();

        // 1. The Official Way: Look for standard <link> tags in the header
        const linkNodes = doc.querySelectorAll(
            'link[type*="rss"], link[type*="atom"], link[rel="alternate"][type*="xml"]'
        );

        linkNodes.forEach(node => {
            const href = node.getAttribute("href");
            if (href) {
                extractedFeeds.set(href, {
                    title: node.getAttribute("title") || "RSS/Atom Feed",
                    href: href,
                    type: node.getAttribute("type") || "application/rss+xml"
                });
            }
        });

        // 2. The Smart Way: Aggressively scan <a> tags for feed links (because many sites are messy)
        const aNodes = doc.querySelectorAll("a[href]");

        aNodes.forEach(node => {
            const href = node.getAttribute("href");
            if (!href) return;

            const lowerHref = href.toLowerCase();
            const textContent = (node.textContent || "").toLowerCase();

            const isLikelyFeed =
                lowerHref.endsWith('.xml') ||
                lowerHref.endsWith('.rss') ||
                lowerHref.endsWith('.atom') ||
                lowerHref.includes('/feed') ||
                lowerHref.includes('/rss') ||
                textContent.includes('rss feed') ||
                textContent.includes('atom feed');

            if (isLikelyFeed && !extractedFeeds.has(href)) {
                extractedFeeds.set(href, {
                    title: node.getAttribute("title") || node.textContent?.trim() || "Discovered Feed Link",
                    href: href,
                    type: node.getAttribute("type") || "application/xml"
                });
            }
        });

        setFeeds(Array.from(extractedFeeds.values()));
    }, [html]);

    // ==========================================
    // 🎆 PRO FIREWORK COPY HANDLER
    // ==========================================
    const handleCopy = (text, type, e) => {
        if (!text) return;
        navigator.clipboard.writeText(text);

        if (e) {
            const rect = e.target.getBoundingClientRect();
            const originX = (rect.left + rect.width / 2) / window.innerWidth;
            const originY = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 120,
                spread: 360,
                startVelocity: 35,
                decay: 0.92,
                gravity: 0.8,
                ticks: 100,
                origin: { x: originX, y: originY },
                colors: ["#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6"],
                shapes: ["circle"],
                zIndex: 9999
            });
        }

        toast.success(`${type} copied to clipboard!`, {
            richColors: true,
            duration: 1000
        });
    };

    // ==========================================
    // 🤖 AI SOCKET LOGIC
    // ==========================================
    useEffect(() => {
        socket.connect();
        socket.on("ai_xpath_generated", (res) => {
            setAiLoading(false);
            if (res.success && res.xpaths) {
                setAiResults(res.xpaths);
                toast.success("AI Generated Multiple XPaths! ✨");
            } else {
                toast.error(res.error || "AI Error!");
            }
        });
        return () => {
            socket.off("ai_xpath_generated");
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!html) {
            setAiInput("");
            setAiResults([]);
            setMode("xpath");
        }
    }, [html]);

    const handleSaveKey = () => {
        const keyToUse = apiKey.trim();
        if (!keyToUse) {
            toast.error("API Key cannot be empty! 🛑");
            return;
        }
        localStorage.setItem("gemini_api_key", keyToUse);
        setIsKeySaved(true);
        toast.success("API Key securely saved! 🔑");
    };

    const handleAIFetch = () => {
        const keyToUse = apiKey.trim();

        // 🔥 FIX: Translated Hindi alerts to English
        if (!keyToUse) return toast.warning("Please enter your Gemini API Key! 🔑");
        if (!aiInput.trim()) return toast.warning("Please enter a Target URL or Title! 🛑");
        if (!isSiteLoaded) return toast.error("Please load a website first! 🛑");

        setAiLoading(true);
        setAiResults([]);

        socket.emit("fetch_ai_xpath", {
            refData: aiInput,
            apiKey: keyToUse
        });
    };

    // ==========================================
    // 🎨 UI RENDERING
    // ==========================================
    return (
        <div className="w-full flex flex-col scrollbar-hide">

            <div className="p-4 flex flex-col gap-5 ">

                {/* 🤖 AI FETCH XPATH SECTION */}
                <div className={`p-4 border rounded-xl transition-all duration-300 ${isSiteLoaded ? 'bg-[#0f172a]/80 backdrop-blur-sm border-blue-500/30 shadow-[0_4px_20px_rgba(59,130,246,0.05)]' : 'bg-[#0f172a]/40 border-slate-800 opacity-70'}`}>

                    <div className="flex items-center justify-between mb-3 ">
                        <h3 className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isSiteLoaded ? 'text-blue-400' : 'text-slate-500'}`}>
                            <Sparkles size={14} className={isSiteLoaded ? "text-blue-400" : "text-slate-500"} />
                            Apex AI Fetch
                        </h3>

                        {isKeySaved && (
                            <button
                                onClick={() => setIsKeySaved(false)}
                                className="text-[10px] font-bold text-slate-500 hover:text-amber-400 transition-colors flex items-center gap-1 bg-[#020817] px-2 py-1 rounded border border-slate-700 hover:border-amber-500/50"
                            >
                                <Edit3 size={12} /> Edit Key
                            </button>
                        )}
                    </div>

                    {!isKeySaved && (
                        <div className="mb-3 fade-in">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                    <Key size={14} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Enter Gemini API Key..."
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full pl-9 pr-12 py-2.5 bg-[#020817] text-slate-200 text-sm border border-slate-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                                />
                                <button
                                    onClick={handleSaveKey}
                                    className="absolute inset-y-1.5 right-1.5 px-2.5 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-md transition-colors flex items-center justify-center cursor-pointer"
                                    title="Save Key"
                                >
                                    <Check size={14} />
                                </button>
                            </div>
                            <p className="text-[9px] text-slate-500 mt-1.5 ml-1 font-medium">Your key is securely stored in your local browser only.</p>
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder={isSiteLoaded ? "Enter Reference (e.g., Target Title/Class)..." : "Load site to unlock AI..."}
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        disabled={!isSiteLoaded}
                        className="w-full mb-3 px-3 py-2.5 bg-[#020817] text-slate-200 text-sm border border-slate-700 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all disabled:cursor-not-allowed placeholder:text-slate-600"
                    />

                    <button
                        onClick={handleAIFetch}
                        disabled={!isSiteLoaded || aiLoading || !isKeySaved}
                        className="w-full mb-2 py-2.5 bg-blue-600/10 border border-blue-500/30 text-blue-400 font-bold text-sm rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 group cursor-pointer"
                    >
                        {aiLoading ? (
                            <><Loader2 size={16} className="animate-spin" /> Analyzing DOM...</>
                        ) : (
                            <><Sparkles size={16} className="group-hover:animate-pulse" /> Generate XPaths</>
                        )}
                    </button>

                    {aiResults && aiResults.length > 0 && (
                        <div className="scrollbar-hide mt-4 space-y-2 max-h-32 overflow-y-auto pr-1">
                            {aiResults.map((xpath, idx) => (
                                <div
                                    key={idx}
                                    onClick={(e) => handleCopy(xpath, "AI XPath", e)}
                                    className="p-2.5 bg-[#020817] border border-blue-500/20 rounded-lg text-xs text-slate-300 font-mono break-all cursor-pointer hover:border-blue-500 hover:shadow-[0_0_10px_rgba(59,130,246,0.1)] group flex items-start gap-2 transition-all"
                                >
                                    <span className="flex-1 mt-0.5 leading-relaxed">{xpath}</span>
                                    <Copy size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 📡 DISCOVERED FEEDS SECTION */}
                {isSiteLoaded && (
                    <div className={`scrollbar-hide p-4 border rounded-xl transition-all duration-300 ${feeds.length > 0 ? 'bg-[#0f172a]/80 backdrop-blur-sm border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.05)]' : 'bg-[#0f172a]/40 border-slate-800'}`}>
                        <h3 className={`text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5 ${feeds.length > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                            <Rss size={14} className={feeds.length > 0 ? "text-emerald-400" : "text-slate-500"} />
                            Discovered Feeds
                        </h3>

                        {feeds.length > 0 ? (
                            <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide pr-1 fade-in">
                                {feeds.map((feed, idx) => (
                                    <div
                                        key={idx}
                                        onClick={(e) => handleCopy(feed.href, "Feed URL", e)}
                                        className="group relative p-2.5 bg-[#020817] border border-slate-800 rounded-lg hover:border-emerald-500 transition-all cursor-pointer flex flex-col gap-1.5"
                                    >
                                        <span className="text-xs font-bold text-slate-200">{feed.title}</span>
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] text-emerald-400/70 font-mono truncate">{feed.href}</span>
                                            <Copy size={14} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-5 text-center border border-dashed border-slate-800 rounded-lg bg-[#020817]/50 fade-in">
                                <AlertCircle size={20} className="text-slate-600 mb-2" />
                                <span className="text-xs font-bold text-slate-400">No Feeds Detected</span>
                                <p className="text-[10px] text-slate-500 mt-1">We couldn't find any RSS or Atom feeds on this page.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* 🔥 MANUAL XPATH AREA */}
                <div className={`scrollbar-hide p-4 border rounded-xl transition-all duration-300 flex-1 flex flex-col ${isHovered ? 'bg-[#0f172a]/80 backdrop-blur-sm border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.05)]' : 'bg-[#0f172a]/40 border-slate-800'}`}>
                    <h3 className={`text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5 ${isHovered ? 'text-amber-400' : 'text-slate-500'}`}>
                        <MousePointer2 size={14} className={isHovered ? "text-amber-400" : "text-slate-500"} />
                        Manual Inspection
                    </h3>

                    {!isSiteLoaded ? (
                        <div className="text-center py-6 text-xs text-slate-500 flex-1 flex flex-col items-center justify-center gap-2">
                            <Wrench size={24} className="text-slate-700 mb-1" />
                            Load a URL to start inspecting.
                        </div>
                    ) : !isHovered ? (
                        <div className="text-center py-6 text-xs text-slate-500 italic flex-1 flex flex-col items-center justify-center gap-2">
                            <MousePointer2 size={24} className="text-slate-700 mb-1 animate-bounce" />
                            Hover over any element in the preview...
                        </div>
                    ) : (
                        <div className="flex flex-col fade-in flex-1">
                            <div className="mb-5">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Primary Selector</p>
                                <div className="group relative p-3 bg-[#020817] border border-slate-700 rounded-lg hover:border-amber-500 transition-all cursor-pointer flex items-start gap-3 shadow-sm" onClick={(e) => handleCopy(data?.defaultXPath, "Default XPath", e)}>
                                    <div className="flex-1 break-all text-xs text-amber-100 font-mono mt-0.5 leading-relaxed">{data?.defaultXPath}</div>
                                    <div className="w-7 h-7 rounded-md bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-slate-900 transition-colors shrink-0">
                                        <Copy size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex p-1 mb-4 bg-[#020817] border border-slate-800 rounded-lg shrink-0">
                                <button onClick={() => setMode("xpath")} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === "xpath" ? "bg-amber-500/10 text-amber-400 shadow-sm border border-amber-500/20" : "text-slate-500 hover:text-slate-300 border border-transparent"}`}>XPath List</button>
                                <button onClick={() => setMode("css")} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${mode === "css" ? "bg-amber-500/10 text-amber-400 shadow-sm border border-amber-500/20" : "text-slate-500 hover:text-slate-300 border border-transparent"}`}>CSS Selectors</button>
                            </div>

                            <div className="space-y-2 pb-6">
                                {list?.map((item, i) => (
                                    <div key={i} className="group relative p-2.5 bg-[#020817] border border-slate-800 rounded-lg hover:border-amber-500/50 transition-all cursor-pointer flex items-center justify-between gap-3" onClick={(e) => handleCopy(item, mode === "xpath" ? "XPath" : "CSS Selector", e)}>
                                        <div className="flex-1 break-all text-[11px] text-slate-300 font-mono group-hover:text-slate-100 transition-colors">{item}</div>
                                        <Copy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 shrink-0" />
                                    </div>
                                ))}
                                {(!list || list.length === 0) && <div className="text-center text-slate-500 text-xs py-4 italic">No {mode.toUpperCase()} found.</div>}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default XPathPanel;