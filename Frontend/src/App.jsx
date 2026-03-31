import { useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { Toaster, toast } from "sonner";
import InputPanel from "./components/InputPanel";
import PreviewFrame from "./components/PreviewFrame";
import XPathPanel from "./components/XPathPanel";
import Footer from "./components/Footer";

function App() {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [selectors, setSelectors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const loadSite = async () => {
    // Agar URL khali hai toh error toast dikhao
    if (!url.trim()) {
      toast.error("Please enter a valid URL first! 🛑");
      return;
    }

    setIsLoading(true); // Loading start
    setHtml(""); // Purana HTML clear karo taaki Skeleton dikhe

    try {
      const res = await axios.get(
        `http://localhost:3000/api/fetch?url=${url}`
      );

      const cleanHTML = DOMPurify.sanitize(res.data);
      setHtml(cleanHTML);

      // Success toast
      toast.success("Website loaded successfully! ✨");
    } catch (err) {
      console.error(err);
      // Alert ki jagah Sonner ka error toast
      toast.error("Error loading site. Please check the URL or server.");
    } finally {
      setIsLoading(false); // Loading khatam
    }
  };

  return (
    // Outer container: Deep dark background with light text
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-gray-200 selection:bg-yellow-500/30 selection:text-yellow-100 font-sans relative">

      {/* 🔔 Sonner Toaster Component (Dark theme ke sath) */}
      <Toaster theme="dark" richColors position="top-right" />

      {/* 🏆 MODERN HEADER */}
      <header className="p-4 border-b border-neutral-800/50 flex items-center justify-center bg-[#0d0d0d]">
        <h1 className="text-3xl font-extrabold tracking-tighter text-neutral-100">
          Xpath<span className="text-yellow-400"> Finder</span>
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 ml-2 animate-pulse"></span>
        </h1>
      </header>

      {/* 🔝 Top Input Panel */}
      <InputPanel url={url} setUrl={setUrl} loadSite={loadSite} />

      {/* 🔽 Main Layout */}
      <div className="flex flex-1 overflow-hidden border-t border-neutral-800 shadow-[0_-2px_15px_rgba(234,179,8,0.03)]">

        {/* LEFT: Preview - Darker card look with a subtle yellow tinted right border */}
        <div className="w-[70%] bg-[#121212] border-r border-yellow-500/20 shadow-[inset_-4px_0_15px_rgba(0,0,0,0.5)] relative">
          {/* 🔥 isLoading prop pass kiya skeleton trigger karne ke liye */}
          <PreviewFrame html={html} setXpath={setSelectors} isLoading={isLoading} />
        </div>

        {/* RIGHT: XPath */}
        <XPathPanel data={selectors} />
      </div>
      <Footer />
    </div>
  );
}

export default App;