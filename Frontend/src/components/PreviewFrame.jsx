import { useEffect, useRef, useState, useMemo } from "react";
import getSelectors from "../utils/getSelectors";
import { ChevronUp, ChevronDown } from "lucide-react";

// 🔥 NAKED SCROLLBAR CSS FOR DOM TREE
const scrollbarStyles = `
  .naked-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .naked-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .naked-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(148, 163, 184, 0.2);
    border-radius: 10px;
  }
  .naked-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(245, 158, 11, 0.5); /* Amber hover for premium feel */
  }
`;

// 🔥 IFRAME INJECTION CSS (For sleek Preview Scrollbar & Y-Axis Only)
const iframeCustomScrollbar = `
  <style>
    ::-webkit-scrollbar {
      width: 6px !important;
      height: 6px !important;
    }
    ::-webkit-scrollbar-track {
      background: transparent !important;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(15, 23, 42, 0.4) !important; 
      border-radius: 10px !important;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: rgba(15, 23, 42, 0.7) !important;
    }
    body {
      overflow-x: hidden !important; /* Force Y-Axis Scroll Only */
    }
  </style>
`;

// 🌲 RECURSIVE DOM TREE COMPONENT
const DOMNode = ({ node, isRoot = false, matchedNodesSet, activeMatchNode }) => {
    const [isExpanded, setIsExpanded] = useState(isRoot);

    useEffect(() => {
        if (activeMatchNode && node.nodeType === Node.ELEMENT_NODE) {
            const targetNode = activeMatchNode.nodeType === Node.ATTRIBUTE_NODE ? activeMatchNode.ownerElement : activeMatchNode;
            if (node !== targetNode && node.contains(targetNode)) {
                setTimeout(() => setIsExpanded(true), 0);
            }
        }
    }, [activeMatchNode, node]);

    if (!node) return null;

    const isMatchedElement = matchedNodesSet?.has(node);
    const isActiveElement = activeMatchNode === node;

    const highlightClass = isActiveElement
        ? "bg-amber-500 text-slate-900 px-1 rounded-sm font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all"
        : isMatchedElement
            ? "bg-amber-500/20 border border-amber-500/40 text-amber-200 px-1 rounded-sm font-medium"
            : "";

    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        const isMatchedText = matchedNodesSet?.has(node);
        const isActiveText = activeMatchNode === node;

        const txtClass = isActiveText
            ? "bg-amber-500 text-slate-900 px-1 rounded-sm font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all"
            : isMatchedText
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-200 px-1 rounded-sm font-medium"
                : "text-slate-400";

        return text ? (
            <div id={isActiveText ? "active-devtools-match" : undefined} className={`pl-6 text-xs py-0.5 break-all ${txtClass}`}>
                {text}
            </div>
        ) : null;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const tagName = node.tagName.toLowerCase();

    const hasChildren = node.childNodes.length > 0;

    const attributes = Array.from(node.attributes).map(attr => {
        const isAttrMatched = matchedNodesSet?.has(attr);
        const isAttrActive = activeMatchNode === attr;

        const attrClass = isAttrActive
            ? "bg-amber-500 text-slate-900 px-1 rounded-sm font-bold shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all"
            : isAttrMatched
                ? "bg-amber-500/20 border border-amber-500/40 text-amber-200 px-1 rounded-sm font-medium"
                : "";

        return (
            <span key={attr.name} id={isAttrActive ? "active-devtools-match" : undefined} className={`ml-1.5 ${attrClass}`}>
                <span className={isAttrMatched || isAttrActive ? 'text-inherit' : 'text-[#9cdcfe]'}>{attr.name}</span>
                <span className={isAttrMatched || isAttrActive ? 'text-inherit opacity-70' : 'text-slate-500'}>=</span>
                <span className={isAttrMatched || isAttrActive ? 'text-inherit font-medium' : 'text-[#ce9178]'}>"{attr.value}"</span>
            </span>
        );
    });

    return (
        <div className="pl-4 font-mono text-[12px] leading-relaxed cursor-default ml-1 border-l border-slate-800 hover:border-slate-600 transition-colors inline-block min-w-full">
            <div onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }} className="hover:bg-slate-800/50 px-1 py-0.5 rounded cursor-pointer flex items-start group transition-colors">
                <span className="w-4 inline-block text-slate-600 group-hover:text-slate-400 select-none shrink-0 transition-colors">
                    {hasChildren ? (isExpanded ? "▼" : "▶") : ""}
                </span>

                <span className="whitespace-nowrap">
                    <span className="text-slate-500">&lt;</span>
                    <span id={isActiveElement ? "active-devtools-match" : undefined} className={highlightClass || "text-[#569cd6] font-medium"}>
                        {tagName}
                    </span>
                    {attributes}
                    <span className="text-slate-500">&gt;</span>

                    {!isExpanded && hasChildren && <span className="text-slate-500 mx-1">...&lt;/{tagName}&gt;</span>}
                </span>
            </div>

            {isExpanded && hasChildren && (
                <div className="my-0.5">
                    {Array.from(node.childNodes).map((child, i) => (
                        <DOMNode key={i} node={child} matchedNodesSet={matchedNodesSet} activeMatchNode={activeMatchNode} />
                    ))}
                    <div className="px-1 py-0.5 ml-4 text-slate-500 hover:bg-slate-800/50 rounded inline-block transition-colors">
                        &lt;<span className="text-[#569cd6] font-medium">/{tagName}</span>&gt;
                    </div>
                </div>
            )}
        </div>
    );
};


const PreviewFrame = ({ html, setXpath, isLoading }) => {
    const iframeRef = useRef(null);
    const [activeTab, setActiveTab] = useState("preview");

    const [xpathQuery, setXpathQuery] = useState("");
    const [testError, setTestError] = useState("");

    const [devtoolsMatches, setDevtoolsMatches] = useState([]);
    const [iframeMatches, setIframeMatches] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Injecting our custom scrollbar CSS directly into the HTML string for the iframe
    const processedHtml = useMemo(() => {
        if (!html) return "";
        return html + iframeCustomScrollbar;
    }, [html]);

    const parsedDoc = useMemo(() => {
        if (!html) return null;
        const parser = new DOMParser();
        return parser.parseFromString(html, "text/html");
    }, [html]);

    const matchedNodesSet = useMemo(() => new Set(devtoolsMatches), [devtoolsMatches]);
    const activeMatchNode = devtoolsMatches[currentIndex] || null;

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !html || activeTab !== "preview") return;

        iframe.onload = () => {
            const doc = iframe.contentDocument;
            if (!doc) return;
            let prev = null;
            let isFrozen = false;

            const handleMouseOver = (e) => {
                if (isFrozen) return;
                const el = e.target;
                if (!el || el.nodeType !== 1) return;

                if (el.hasAttribute('data-devtool-highlight')) return;

                if (prev && !prev.hasAttribute('data-devtool-highlight')) prev.style.outline = "";
                el.style.outline = "2px solid #ef4444";
                prev = el;
                setXpath(getSelectors(el, doc));
            };

            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const el = e.target;
                if (!el || el.nodeType !== 1 || el.hasAttribute('data-devtool-highlight')) return;
                isFrozen = true;
                if (prev && !prev.hasAttribute('data-devtool-highlight')) prev.style.outline = "";
                el.style.outline = "2px solid #3b82f6";
                prev = el;
                setXpath(getSelectors(el, doc));
            };

            const handleDoubleClick = () => isFrozen = false;

            doc.addEventListener("mouseover", handleMouseOver);
            doc.addEventListener("click", handleClick);
            doc.addEventListener("dblclick", handleDoubleClick);

            return () => {
                doc.removeEventListener("mouseover", handleMouseOver);
                doc.removeEventListener("click", handleClick);
                doc.removeEventListener("dblclick", handleDoubleClick);
            };
        };
    }, [html, setXpath, activeTab]);

    const evaluateXPath = (query) => {
        setXpathQuery(query);
        setTestError("");

        iframeMatches.forEach(node => {
            let el = node.nodeType === Node.ATTRIBUTE_NODE ? node.ownerElement : node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
            if (el && el.style) {
                el.style.outline = "";
                el.style.backgroundColor = "";
                el.removeAttribute('data-devtool-highlight');
            }
        });

        if (!query.trim() || !parsedDoc) {
            setDevtoolsMatches([]);
            setIframeMatches([]);
            setCurrentIndex(0);
            return;
        }

        try {
            const devResult = parsedDoc.evaluate(query, parsedDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            const newDevMatches = [];
            for (let i = 0; i < devResult.snapshotLength; i++) {
                newDevMatches.push(devResult.snapshotItem(i));
            }

            const iframeDoc = iframeRef.current?.contentDocument;
            const newIframeMatches = [];
            if (iframeDoc) {
                const ifrResult = iframeDoc.evaluate(query, iframeDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                for (let i = 0; i < ifrResult.snapshotLength; i++) {
                    newIframeMatches.push(ifrResult.snapshotItem(i));
                }
            }

            setDevtoolsMatches(newDevMatches);
            setIframeMatches(newIframeMatches);
            setCurrentIndex(0);
        } catch (err) {
            if (query.length > 3) setTestError("Invalid XPath syntax");
            setDevtoolsMatches([]);
            setIframeMatches([]);
        }
    };

    const nextMatch = () => {
        if (devtoolsMatches.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % devtoolsMatches.length);
        }
    };

    const prevMatch = () => {
        if (devtoolsMatches.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + devtoolsMatches.length) % devtoolsMatches.length);
        }
    };

    useEffect(() => {
        if (iframeMatches.length === 0) return;

        iframeMatches.forEach((node, idx) => {
            let el = node.nodeType === Node.ATTRIBUTE_NODE ? node.ownerElement : node.nodeType === Node.TEXT_NODE ? node.parentElement : node;

            if (el && el.style) {
                el.setAttribute('data-devtool-highlight', 'true');
                if (idx === currentIndex) {
                    el.style.outline = "3px solid #f59e0b";
                    el.style.backgroundColor = "rgba(245, 158, 11, 0.3)";
                    if (activeTab === "preview") {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                } else {
                    el.style.outline = "2px dashed #fbbf24";
                    el.style.backgroundColor = "rgba(251, 191, 36, 0.1)";
                }
            }
        });

        if (activeTab === "devtools") {
            setTimeout(() => {
                const activeEl = document.getElementById("active-devtools-match");
                if (activeEl) activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "center" });
            }, 50);
        }

    }, [currentIndex, iframeMatches, activeTab]);

    if (isLoading || !html) {
        return (
            <div className="w-full h-full bg-[#020817] flex flex-col p-8 relative overflow-hidden">
                {isLoading ? (
                    <div className="w-full h-full flex flex-col gap-8 animate-pulse opacity-80 mt-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-slate-800/60 shrink-0"></div>
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-slate-800/60 rounded-md w-1/3"></div>
                                <div className="h-3 bg-slate-800/40 rounded-md w-1/4"></div>
                            </div>
                        </div>
                        <div className="w-full h-48 sm:h-64 bg-slate-800/30 rounded-2xl border border-slate-800/50"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-slate-800/50 rounded-md w-full"></div>
                            <div className="h-4 bg-slate-800/50 rounded-md w-[92%]"></div>
                            <div className="h-4 bg-slate-800/50 rounded-md w-[85%]"></div>
                            <div className="h-4 bg-slate-800/50 rounded-md w-[60%]"></div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="relative z-10 px-8 py-6 bg-[#0f172a]/50 backdrop-blur-sm border border-slate-800 rounded-xl flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center border border-slate-700/50">
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <p className="text-slate-400 font-medium">Paste a website URL above to start inspecting elements ⚡</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#020817] flex flex-col relative">
            <style>{scrollbarStyles}</style>

            {/* 🔥 TOP TOGGLE TABS */}
            <div className="flex bg-[#0f172a] border-b border-slate-800 p-2 gap-2 shrink-0 z-10">
                <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex-1 py-2 px-4 text-xs tracking-wide font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === "preview"
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner'
                        : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    LIVE PREVIEW
                </button>
                <button
                    onClick={() => setActiveTab("devtools")}
                    className={`flex-1 py-2 px-4 text-xs tracking-wide font-bold rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === "devtools"
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner'
                        : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                    INSPECT PANEL
                </button>
            </div>

            {/* 🔥 TAB 1: VISUAL PREVIEW */}
            <div className={`flex-1 w-full bg-white relative ${activeTab === "preview" ? "block" : "hidden"}`}>
                <iframe ref={iframeRef} srcDoc={processedHtml} sandbox="allow-same-origin" className="w-full h-full border-none outline-none" title="preview" />
            </div>

            {/* 🔥 TAB 2: CHROME DEVTOOLS TREE */}
            <div className={`flex-1 flex flex-col w-full bg-[#020817] overflow-hidden ${activeTab === "devtools" ? "flex" : "hidden"}`}>
                <div className="flex-1 overflow-auto naked-scrollbar p-4 bg-[#020817] pb-10">
                    {parsedDoc && parsedDoc.documentElement && (
                        <DOMNode
                            node={parsedDoc.documentElement}
                            isRoot={true}
                            matchedNodesSet={matchedNodesSet}
                            activeMatchNode={activeMatchNode}
                        />
                    )}
                </div>
            </div>

            {/* 🔥 BOTTOM SEARCH BAR */}
            <div className="shrink-0 border-t border-slate-800 bg-[#0f172a] p-3 flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.2)] z-10">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Find by XPath: //div[contains(@class,'blog')]/a/@href"
                            value={xpathQuery}
                            onChange={(e) => evaluateXPath(e.target.value)}
                            className="w-full bg-[#020817] border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 font-mono focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-slate-600"
                        />
                        {testError && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full font-bold">
                                {testError}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center bg-[#020817] border border-slate-700 rounded-lg overflow-hidden shadow-sm">
                        <span className={`px-3 py-2.5 text-xs font-bold border-r border-slate-700 ${devtoolsMatches.length > 0 ? 'text-amber-500' : 'text-slate-500'}`}>
                            {devtoolsMatches.length > 0 ? `${currentIndex + 1} of ${devtoolsMatches.length}` : '0 Matches'}
                        </span>

                        <button
                            onClick={prevMatch}
                            disabled={devtoolsMatches.length === 0}
                            className="px-3 py-2.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
                        >
                            <ChevronUp size={16} />
                        </button>

                        <button
                            onClick={nextMatch}
                            disabled={devtoolsMatches.length === 0}
                            className="px-3 py-2.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border-l border-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
                        >
                            <ChevronDown size={16} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PreviewFrame;