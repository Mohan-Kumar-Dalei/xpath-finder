import { useEffect, useRef } from "react";
import getSelectors from "../utils/getSelectors";

const PreviewFrame = ({ html, setXpath, isLoading }) => {
    const iframeRef = useRef(null);

    // Tumhara original logic (No changes here 🔥)
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !html) return;

        iframe.onload = () => {
            const doc = iframe.contentDocument;
            if (!doc) return;

            let prev = null;
            let isFrozen = false;

            // 🔴 Hover
            const handleMouseOver = (e) => {
                if (isFrozen) return;
                const el = e.target;
                if (!el || el.nodeType !== 1) return;
                if (prev) prev.style.outline = "";
                el.style.outline = "2px solid red";
                prev = el;
                const selectors = getSelectors(el, doc);
                setXpath(selectors);
            };

            // 🔵 Click → Freeze
            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const el = e.target;
                if (!el || el.nodeType !== 1) return;
                isFrozen = true;
                if (prev) prev.style.outline = "";
                el.style.outline = "2px solid blue";
                prev = el;
                const selectors = getSelectors(el, doc);
                setXpath(selectors);
            };

            // 🔓 Double click → Unfreeze
            const handleDoubleClick = () => {
                isFrozen = false;
            };

            doc.addEventListener("mouseover", handleMouseOver);
            doc.addEventListener("click", handleClick);
            doc.addEventListener("dblclick", handleDoubleClick);

            return () => {
                doc.removeEventListener("mouseover", handleMouseOver);
                doc.removeEventListener("click", handleClick);
                doc.removeEventListener("dblclick", handleDoubleClick);
            };
        };
    }, [html, setXpath]);

    // ----------------------------------------------------------------
    // UI RENDERING LOGIC
    // ----------------------------------------------------------------

    // ⏳ STATE 1: LOADING SKELETON (Glass shine modern effect)
    if (isLoading) {
        return (
            <div className="w-full h-full bg-[#121212] p-6 flex flex-col gap-6 overflow-hidden relative">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent z-10"></div>

                <div className="w-full h-12 bg-neutral-800/50 rounded-lg animate-pulse border border-neutral-700/30"></div>

                <div className="flex gap-6 h-full">
                    <div className="w-1/4 h-full bg-neutral-800/40 rounded-lg animate-pulse border border-neutral-700/30 hidden md:block"></div>
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="w-full h-48 bg-neutral-800/40 rounded-lg animate-pulse border border-neutral-700/30"></div>
                        <div className="w-3/4 h-5 bg-neutral-800/50 rounded animate-pulse mt-4"></div>
                        <div className="w-full h-4 bg-neutral-800/30 rounded animate-pulse"></div>
                        <div className="w-5/6 h-4 bg-neutral-800/30 rounded animate-pulse"></div>
                        <div className="w-1/2 h-4 bg-neutral-800/30 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // ✨ STATE 2: INITIAL WELCOME SCREEN (Minimal & Premium)
    if (!html) {
        return (
            <div className="w-full h-full bg-[#121212] flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                {/* Subtle background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>

                {/* Minimal text container */}
                <div className="relative z-10 px-8 py-5 bg-[#1a1a1a]/50 border border-neutral-800/80 rounded-xl shadow-xl backdrop-blur-xl">
                    <h2 className="text-sm font-sm text-neutral-500 tracking-wide">
                        Paste a website URL above to start inspecting elements ⚡
                    </h2>
                </div>
            </div>
        );
    }

    // 🌐 STATE 3: ACTUAL IFRAME (Jab URL load ho jaye)
    return (
        <div className="w-full h-full bg-white relative">
            <iframe
                ref={iframeRef}
                srcDoc={html}
                className="w-full h-full border-none outline-none"
                title="preview"
            />
        </div>
    );
};

export default PreviewFrame;