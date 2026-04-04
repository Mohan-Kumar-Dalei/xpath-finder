import { useState } from "react";
import axios from "./utils/axios";
import { Toaster, toast } from "sonner";
import InputPanel from "./components/InputPanel";
import PreviewFrame from "./components/PreviewFrame";
import XPathPanel from "./components/XPathPanel";
import Footer from "./components/Footer";

// 🔥 CUSTOM TEXT-ONLY SHIMMER CSS
const textShimmerStyles = `
  @keyframes text-shimmer-continuous {
    0% { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  .shimmer-text {
    background: linear-gradient(
      to right, 
      #94a3b8 20%,    /* Slate-400 (Base Color) */
      #ffffff 50%,    /* Pure White (Shine Center) */
      #94a3b8 80%     /* Slate-400 (Base Color) */
    );
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    /* 3s total, linear speed, infinite loop (No pausing) */
    animation: text-shimmer-continuous 3s linear infinite; 
  }
`;

function App() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [selectors, setSelectors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const loadSite = async () => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL first! 🛑");
      return;
    }

    setIsLoading(true);
    setHtml("");
    setSelectors({});

    try {
      const res = await axios.get(`/api/fetch?url=${url}`);

      // 100% RAW HTML for accurate feeding and XPath
      setHtml(res.data);
      toast.success("Website loaded successfully! ✨");
    } catch (err) {
      console.error(err);
      toast.error("Error loading site. Please check the URL or server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Main Wrapper: Strict h-screen, fully responsive, relative for floating footer
    <div className="h-screen flex flex-col bg-[#020817] text-slate-300 selection:bg-amber-500/30 selection:text-amber-200 font-sans relative overflow-hidden">

      <style>{textShimmerStyles}</style>

      <Toaster theme="dark" closeButton={true} richColors position="bottom-right" duration={1000}/>

      {/* 🔥 FULLY RESPONSIVE HEADER LAYOUT */}
      <header className="px-4 lg:px-6 py-3 border-b border-slate-800 bg-[#020817]/90 backdrop-blur-md z-20 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-sm shrink-0">

        {/* Left Side: Logo & Loader */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-100 flex items-center whitespace-nowrap">
              XPath
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 ml-1.5">
                Finder
              </span>
            </h1>

            {/* 🔥 ASLI FIX: Fixed width container (w-6) jo hamesha space reserve karke rakhega. Layout shift nahi hoga! */}
            <div className="w-6 flex items-center justify-center ml-1">
              {isLoading && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
              )}
            </div>
          </div>

          {/* Mobile Badge: Shows on small screens next to the logo */}
          <div className="flex lg:hidden items-center bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50 cursor-default shrink-0">
            <span className="text-[10px] font-bold tracking-widest flex items-center gap-1">
              <span className="shimmer-text">MADE WITH</span>
              <span className="text-red-500 animate-pulse text-[12px]">❤️</span>
              <span className="shimmer-text">MOHAN</span>
            </span>
          </div>
        </div>

        {/* Center: Input Panel */}
        <div className="w-full lg:flex-1 flex justify-center max-w-4xl xl:max-w-4xl">
          <div className="w-full -my-3 lg:-my-5">
            <InputPanel url={url} setUrl={setUrl} loadSite={loadSite} />
          </div>
        </div>

        {/* Right Side: Desktop Badge */}
        <div className="hidden lg:flex items-center bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700/50 cursor-default shrink-0">
          <span className="text-xs font-bold tracking-widest flex items-center gap-1.5">
            <span className="shimmer-text">MADE WITH</span>
            <span className="text-red-500 animate-pulse text-[14px]">❤️</span>
            <span className="shimmer-text">MOHAN</span>
          </span>
        </div>

      </header>

      {/* Dashboard Main Content Area */}
      <main className="flex flex-1 flex-col lg:flex-row overflow-hidden bg-[#020817] relative z-0">

        {/* Preview Section */}
        <div className="flex-1 lg:w-[65%] xl:w-[75%] flex flex-col relative border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="absolute top-0 left-0 w-full px-4 py-2 bg-[#020817]/80 backdrop-blur border-b border-slate-800 z-10 flex justify-between items-center shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Live Preview
            </span>
          </div>

          <div className="flex-1 overflow-hidden pt-10 bg-white/5">
            <PreviewFrame html={html} setXpath={setSelectors} isLoading={isLoading} />
          </div>
        </div>

        {/* XPath Panel Section */}
        <div className="lg:w-[35%] xl:w-[25%] flex flex-col bg-[#0a0f1c] shrink-0 h-[40vh] lg:h-auto">
          <div className="px-4 py-2 border-b border-slate-800 bg-[#0a0f1c] z-10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              Inspector Details
            </span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide pb-16">
            <XPathPanel data={selectors} html={html} />
          </div>
        </div>
      </main>

      {/* 🔥 FLOATING GLASS FOOTER */}
        <div className="pointer-events-auto">
          <Footer />
        </div>

    </div>
  );
}

export default App;