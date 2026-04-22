const Footer = () => {
    return (
        <footer className="border-t border-zinc-100 py-16 bg-white/50 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-10">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">
                    &copy; {new Date().getFullYear()} // OTTOBON_JOBS_NETWORK
                </div>
                <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[9px] font-black text-zinc-300 uppercase tracking-[0.3em]">
                    <a href="#" className="hover:text-black transition-colors">TERMINAL_PRIVACY</a>
                    <a href="#" className="hover:text-black transition-colors">SYSTEM_TERMS</a>
                    <a href="#" className="hover:text-black transition-colors">NODE_STATUS</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
