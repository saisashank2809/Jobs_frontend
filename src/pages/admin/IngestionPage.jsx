import { useState } from 'react';
import { triggerIngestion } from '../../api/adminApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Download, RefreshCw, CheckCircle, AlertOctagon, Database, Power, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IngestionPage = () => {
    const [loading, setLoading] = useState(null);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const handleIngest = async (source) => {
        setLoading(source);
        setResults(null);
        setError(null);

        try {
            const data = await triggerIngestion(source);
            setResults(data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'INGESTION_FAILURE');
        } finally {
            setLoading(null);
        }
    };

    const sources = [
        { id: 'deloitte', name: 'Deloitte', pattern: 'bg-zinc-900 text-white' },
        { id: 'pwc', name: 'PwC', pattern: 'bg-white border border-zinc-200 text-zinc-900' },
        { id: 'kpmg', name: 'KPMG', pattern: 'bg-zinc-50 text-zinc-600' },
        { id: 'ey', name: 'EY', pattern: 'bg-zinc-900 text-white font-medium' },
        { id: 'generic', name: 'Generic GCC', pattern: 'bg-zinc-800 text-white' }
    ];

    return (
        <div className="max-w-6xl mx-auto py-20 px-8 bg-[#FBFBFB] min-h-screen">
            <header className="mb-20 border-b border-zinc-100 pb-12">
                <h1 className="text-4xl font-sans font-bold text-zinc-900 tracking-tight flex items-center gap-6">
                    <div className="w-16 h-16 bg-zinc-900 card grid place-items-center shadow-lg shadow-zinc-900/20">
                        <Database size={32} className="text-white" />
                    </div>
                    Data Management
                </h1>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-6 ml-1">
                    System Data Import & External Scrapers
                </p>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <div className="md:col-span-2 lg:col-span-3 bg-white border border-zinc-100 card p-8 shadow-xl shadow-zinc-900/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8">
                        <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 rounded-3xl grid place-items-center">
                            <Power size={32} className="text-zinc-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-sans font-bold text-zinc-900 tracking-tight">Global System Update</h3>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-2">Synchronize all configured sources</p>
                        </div>
                    </div>
                    <button
                        disabled={loading !== null}
                        onClick={() => handleIngest('all')}
                        className="bg-zinc-900 text-white px-12 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all flex items-center gap-4 shadow-xl shadow-zinc-900/10 disabled:opacity-30 active:scale-95"
                    >
                        <RefreshCw size={20} className={loading === 'all' ? 'animate-spin' : ''} />
                        {loading === 'all' ? "Processing..." : "Start Global Update"}
                    </button>
                </div>

                {sources.map(source => (
                    <div key={source.id} className="bg-white border border-zinc-100 card p-8 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-zinc-900/5 transition-all duration-500 group">
                        <div className={`w-16 h-16 rounded-2xl mx-auto mb-8 grid place-items-center font-bold text-xl shadow-sm transition-all group-hover:scale-110 ${source.pattern}`}>
                            {source.name.charAt(0)}
                        </div>
                        <h3 className="text-xl font-sans font-bold text-zinc-900 tracking-tight mb-8 uppercase">{source.name}</h3>
                        <button
                            disabled={loading !== null}
                            onClick={() => handleIngest(source.id)}
                            className="w-full bg-zinc-50 border border-zinc-100 text-zinc-400 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                        >
                            {loading === source.id ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
                            Scrape Jobs
                        </button>
                    </div>
                ))}
            </motion.div>

            <AnimatePresence>
                {results && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-20 bg-white border border-zinc-100 card p-8 overflow-hidden shadow-2xl shadow-zinc-900/5"
                    >
                        <h3 className="text-2xl font-sans font-bold text-zinc-900 mb-8 flex items-center gap-4 tracking-tight">
                            <CheckCircle size={32} className="text-zinc-900" /> Synchronization Success
                        </h3>
                        <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-3xl overflow-x-auto">
                            <pre className="text-[10px] font-mono font-bold text-zinc-400 leading-relaxed uppercase">
                                {JSON.stringify(results, null, 2)}
                            </pre>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-16 bg-black text-white border-4 border-black card p-8 overflow-hidden shadow-[24px_24px_0px_rgba(0,0,0,0.03)]"
                    >
                        <h3 className="text-2xl font-display font-black text-white mb-6 flex items-center gap-4 uppercase tracking-tighter">
                            <AlertOctagon size={32} /> Import_Error
                        </h3>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40 italic">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IngestionPage;
