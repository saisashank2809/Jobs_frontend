import { Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const JobMatchButton = ({ onMatch, isLoading }) => {
    return (
        <button
            onClick={onMatch}
            disabled={isLoading}
            className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-5 bg-black text-white hover:bg-gray-900 border-2 border-black rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] transition-all shadow-xl shadow-black/10 disabled:opacity-50"
        >
            {isLoading ? (
                <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    <Sparkles size={16} className="text-yellow-400" />
                    <span>Match Jobs</span>
                </>
            )}
        </button>
    );
};

export default JobMatchButton;
