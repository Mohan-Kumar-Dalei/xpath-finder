import { useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { Toaster, toast } from "sonner";
import InputPanel from "./components/InputPanel";
import PreviewFrame from "./components/PreviewFrame";
import XPathPanel from "./components/XPathPanel";
import Footer from "./components/Footer";

// 🔥 CUSTOM TEXT-ONLY SHIMMER CSS
const textShimmerStyles = `
  @keyframes text-shimmer {
    0% { background-position: -200% center; }
    40% { background-position: 200% center; }
    100% { background-position: 200% center; }
  }
  .shimmer-text {
    background: linear-gradient(
      90deg, 
      #94a3b8 0%,    /* Slate-400 (Base Color) */
      #ffffff 20%,   /* Pure White (Shine Color) */
      #94a3b8 40%
    );
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    /* 2.5s total: 1s me chamkega, 1.5s wait karega */
    animation: text-shimmer 2.5s infinite; 
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
      const res = await axios.get(
        `http://localhost:3000/api/fetch?url=${url}`
      );
      const cleanHTML = DOMPurify.sanitize(res.data);
      setHtml(cleanHTML);
      toast.success("Website loaded successfully! ✨");
    } catch (err) {
      console.error(err);
      toast.error("Error loading site. Please check the URL or server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#020817] text-slate-300 selection:bg-amber-500/30 selection:text-amber-200 font-sans overflow-hidden">
      {/* Injecting CSS for Text Shimmer */}
      <style>{textShimmerStyles}</style>

      <Toaster theme="dark" closeButton={true} richColors position="bottom-right" />

      {/* Modern Glassmorphic Header */}
      <header className="px-6 py-4 border-b border-slate-800 bg-[#020817]/90 backdrop-blur-md z-20 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            XPath
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              Finder
            </span>
            {isLoading && (
              <span className="relative flex h-2.5 w-2.5 ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
          </h1>
        </div>

        {/* 🔥 Updated: Text-Only Shimmer Effect */}
        <div className="hidden sm:flex items-center bg-slate-800/50 px-4 py-1.5 rounded-full border border-slate-700/50 cursor-default">
          <span className="text-xs font-bold tracking-widest flex items-center gap-1.5">
            {/* Shimmer on "Made with" */}
            <span className="shimmer-text">MADE WITH</span>

            {/* Emoji unaffected by gradient */}
            <span className="text-red-500 animate-pulse text-[14px]">❤️</span>

            {/* Shimmer on "Mohan" */}
            <span className="shimmer-text">MOHAN</span>
          </span>
        </div>
      </header>

      {/* Input Section */}
      <section className="bg-[#0f172a] border-b border-slate-800 z-10 shrink-0">
        <InputPanel url={url} setUrl={setUrl} loadSite={loadSite} />
      </section>

      {/* Dashboard Main Content Area */}
      <main className="flex flex-1 flex-col lg:flex-row overflow-hidden bg-[#020817] relative">
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

        <div className="lg:w-[35%] xl:w-[25%] flex flex-col bg-[#0a0f1c] shrink-0 h-[40vh] lg:h-auto">
          <div className="px-4 py-2 border-b border-slate-800 bg-[#0a0f1c] z-10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              Inspector Details
            </span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <XPathPanel data={selectors} html={html} />
          </div>
        </div>
      </main>

      <div className="shrink-0  bg-[#020817]/60 backdrop-blur-lg">
        <Footer />
      </div>
    </div>
  );
}

export default App;