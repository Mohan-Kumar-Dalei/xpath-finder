const Footer = () => {
    return (
        <footer className="py-3.5 bg-[#0a0a0a] border-t border-neutral-800/50 flex items-center justify-center relative z-10">
            <p className="text-sm text-neutral-400 font-medium flex items-center gap-1.5">
                Code with
                {/* 💓 Pulsing Heart Emoji */}
                <span className="text-red-500 text-base inline-block animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                    ❤️
                </span>
                by
                {/* ✨ Glowing Name with Portfolio Link */}
                <a
                    href="https://mohankumardalei-portfolio.netlify.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-500 hover:text-yellow-400 font-bold tracking-wider hover:underline underline-offset-4 decoration-yellow-500/50 transition-all duration-300"
                >
                    Mohan
                </a>
            </p>
        </footer>
    );
};

export default Footer;