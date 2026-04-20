import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useChatWebSocket } from '../../hooks/useChatWebSocket';
import { createChatSession, getMySessions } from '../../api/chatApi';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Loader from '../../components/ui/Loader';
import { Send, User, Bot, Briefcase, ArrowLeft, MessageSquare, Plus, Clock, Shield, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatPage = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [sessionId, setSessionId] = useState(() => location.state?.sessionId || null);
    const [loadingList, setLoadingList] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        const fetchSessions = async () => {
            try {
                const list = await getMySessions();
                setSessions(list);
            } catch (err) {
                console.error("Failed to fetch sessions", err);
            } finally {
                setLoadingList(false);
            }
        };
        fetchSessions();
    }, [user?.id]);

    useEffect(() => {
        if (location.state?.sessionId) {
            setSessionId(location.state.sessionId);
            getMySessions().then(setSessions);
        }
    }, [location.state?.sessionId]);

    const handleSelectSession = (id) => {
        setSessionId(id);
    };

    return (
        <div className="h-[calc(100vh-140px)] max-w-[1600px] mx-auto px-6 md:px-10 flex flex-col overflow-hidden">
            {/* Minimalist Header - Fixed (Non-shrinking) */}
            <header className="shrink-0 relative z-10 pb-8 flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-zinc-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-4 border border-zinc-100 shadow-sm">
                        <Sparkles size={12} className="text-zinc-400" />
                        AI Assistance
                    </div>
                    <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-zinc-900">
                        Coach
                    </h1>
                </motion.div>

                <Link to="/jobs">
                    <motion.button 
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-[10px] font-extrabold text-[#313851] flex items-center gap-2.5 transition-all uppercase tracking-[0.2em] bg-white px-7 py-3.5 rounded-2xl border border-[#C2CBD3] premium-shadow-hover"
                    >
                        <ArrowLeft size={16} /> Back to Market
                    </motion.button>
                </Link>
            </header>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-0 overflow-hidden pb-2">
                {/* Sidebar - Fixed/H-Full */}
                <div className="col-span-1 h-full overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/80 backdrop-blur-xl card border border-zinc-100 flex flex-col h-full overflow-hidden shadow-sm"
                    >
                        <div className="p-6 border-b border-zinc-50 bg-zinc-50/30">
                            <h2 className="text-[11px] font-bold text-zinc-400 flex items-center gap-3 uppercase tracking-[0.3em]">
                                <MessageSquare size={16} />
                                Active Sessions
                            </h2>
                        </div>

                        <div className="overflow-y-auto p-4 space-y-2">
                            {loadingList ? (
                                <div className="p-4 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest animate-pulse">Syncing...</div>
                            ) : sessions.length === 0 ? (
                                <div className="p-8 text-center text-zinc-300 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                    No active streams.
                                </div>
                            ) : (
                                sessions.map((session, idx) => {
                                    const isActive = session.id === sessionId;
                                    const isMostRecent = idx === 0;
                                    return (
                                        <button
                                            key={session.id}
                                            onClick={() => handleSelectSession(session.id)}
                                            className={`relative w-full text-left p-5 rounded-2xl transition-all duration-300 border flex items-center justify-between group cursor-pointer ${isActive
                                                ? 'bg-[#313851] text-white border-[#313851] shadow-lg shadow-zinc-900/10 scale-[1.02]'
                                                : isMostRecent 
                                                    ? 'bg-[#F6F3ED] text-[#313851] border-[#C2CBD3] hover:bg-[#E5E9F0]'
                                                    : 'bg-white text-zinc-600 border-transparent hover:bg-[#E5E9F0] hover:text-[#313851]'
                                                }`}
                                        >
                                            {/* Hover Accent Bar */}
                                            {!isActive && (
                                                <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#313851] opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full" />
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-[#313851]'}`}>
                                                        {session.job_title || "General Coach"}
                                                    </div>
                                                    {isMostRecent && !isActive && (
                                                        <span className="px-2 py-0.5 rounded-full bg-[#313851] text-[7px] text-white font-extrabold tracking-widest uppercase">Latest</span>
                                                    )}
                                                </div>
                                                <div className={`text-[9px] font-bold uppercase tracking-[0.1em] flex items-center gap-2 ${isActive ? 'text-white/60' : 'text-zinc-400 opacity-60'}`}>
                                                    <Clock size={12} />
                                                    {session.created_at ? new Date(session.created_at).toLocaleDateString() : 'Initial'}
                                                </div>
                                            </div>

                                            <ChevronRight 
                                                size={16} 
                                                className={`transition-all duration-300 ${isActive ? 'text-white translate-x-0' : 'text-[#C2CBD3] opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`}
                                            />
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Main Chat Area - Occupies remaining space */}
                <div className="col-span-1 lg:col-span-3 h-full overflow-hidden">
                    {sessionId ? (
                        <ChatWindow sessionId={sessionId} />
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/50 backdrop-blur-sm card border border-dashed border-zinc-200 h-full grid place-items-center text-center p-8"
                        >
                            <div>
                                <div className="w-24 h-24 bg-zinc-100 card grid place-items-center mx-auto mb-10 shadow-inner">
                                    <Bot size={48} className="text-zinc-300" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">Select a Session</h3>
                                <p className="text-xs font-medium text-zinc-400 max-w-sm mx-auto leading-relaxed uppercase tracking-wider">
                                    Connect to an existing logic stream or initiate a new session from any job details page.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChatWindow = ({ sessionId }) => {
    const { messages, sendMessage, isConnected, isTyping } = useChatWebSocket(sessionId);
    const [input, setInput] = useState('');
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || !isConnected) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="bg-white card border border-zinc-100 h-full flex flex-col overflow-hidden shadow-sm hover:shadow-xl hover:shadow-zinc-900/5 transition-all duration-500">
            {/* Header */}
            <div className="py-5 px-10 border-b border-zinc-50 flex justify-between items-center text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] bg-zinc-50/30 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <span className="text-zinc-300">NODE</span>
                    <span className="font-mono text-zinc-900 bg-white px-2 py-1 rounded-lg border border-zinc-100">{sessionId.slice(0, 8)}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-rose-500 animate-pulse'}`} />
                    <span className={isConnected ? 'text-zinc-900' : 'text-rose-500'}>
                        {isConnected ? 'LIVE' : 'RECONNECTING...'}
                    </span>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-8 space-y-12 bg-[#FDFDFD]">
                {messages.length === 0 && !isTyping && (
                    <div className="h-full grid place-items-center">
                        <div className="text-center opacity-20">
                            <Bot size={80} className="mx-auto mb-6" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Initializing Stream...</p>
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    const isAdmin = msg.role === 'admin';

                    return (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-6 ${isUser ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-10 h-10 rounded-2xl grid place-items-center shrink-0 shadow-sm border ${isUser
                                ? 'bg-zinc-900 border-zinc-900 text-white'
                                : 'bg-white border-zinc-100 text-zinc-400'
                                }`}>
                                {isUser ? <User size={18} /> : isAdmin ? <Shield size={18} /> : <Bot size={18} />}
                            </div>
                            <div className={`max-w-[85%] space-y-2 ${isUser ? 'text-right' : 'text-left'}`}>
                                <div className={`p-6 card text-[13px] font-medium leading-relaxed ${isUser
                                    ? 'bg-zinc-900 text-white rounded-tr-sm shadow-lg shadow-zinc-900/10'
                                    : 'bg-white border border-zinc-100 text-zinc-700 rounded-tl-sm shadow-sm'
                                    }`}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            p: ({ node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                                            li: ({ node, ...props }) => <li className="font-medium" {...props} />,
                                            h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-4 mt-8 first:mt-0" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-3 mt-6 first:mt-0" {...props} />,
                                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-zinc-100 pl-4 italic my-4 text-zinc-400" {...props} />,
                                            code: ({ node, inline, className, children, ...props }) => {
                                                return inline ? (
                                                    <code className="bg-zinc-100/50 px-2 py-0.5 rounded font-mono text-zinc-900" {...props}>{children}</code>
                                                ) : (
                                                    <code className="block bg-zinc-900 text-zinc-100 p-6 rounded-2xl text-[11px] font-mono whitespace-pre-wrap mb-4 border border-zinc-800" {...props}>{children}</code>
                                                );
                                            },
                                            strong: ({ node, ...props }) => <strong className="font-bold text-zinc-900" {...props} />,
                                            a: ({ node, ...props }) => <a className="text-zinc-900 underline font-bold hover:text-blue-600 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                                <div className={`text-[9px] font-bold text-zinc-300 uppercase tracking-widest px-2`}>
                                    {isUser ? 'You' : isAdmin ? 'Expert' : 'Coach'} · {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {isTyping && (
                    <div className="flex gap-6">
                        <div className="w-10 h-10 rounded-2xl grid place-items-center bg-white border border-zinc-100 text-zinc-400">
                            <Bot size={18} />
                        </div>
                        <div className="p-6 card rounded-tl-sm bg-zinc-50/50 border border-zinc-100 w-24">
                            <div className="flex gap-2 justify-center">
                                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Form */}
            <div className="p-8 border-t border-zinc-50 bg-white">
                <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto w-full">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isConnected ? "Message Coach..." : "Connecting..."}
                        disabled={!isConnected}
                        className="w-full bg-zinc-50/50 border border-zinc-100 card px-10 py-6 pr-24 text-zinc-900 font-medium text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all shadow-sm"
                    />
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!isConnected || !input.trim()}
                        className="absolute right-3 p-4 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-lg shadow-zinc-900/10"
                    >
                        <Send size={20} />
                    </motion.button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;

