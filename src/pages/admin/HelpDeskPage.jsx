import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getActiveSessions, getSessionDetails, sendAdminMessage, releaseSession } from '../../api/adminApi';
import { Bot, User, MessageSquare, Clock, Shield, Zap, CheckCircle, ArrowLeft, Send, LogOut, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../../api/client';

const HelpDeskPage = () => {
    const location = useLocation();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSessionId, setSelectedSessionId] = useState(
        location.state?.sessionId || null
    );

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await getActiveSessions();
                setSessions(data || []);
            } catch (err) {
                console.error('Failed to fetch sessions:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
        const interval = setInterval(fetchSessions, 15000); // refresh list every 15s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-12 px-8">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-sans font-bold tracking-tight text-zinc-900">Help Desk Monitor</h1>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em] mt-3">Live Session Intervention & Support</p>
                </div>
                <Link to="/admin/tower" className="flex items-center gap-2 text-[10px] font-bold text-zinc-300 hover:text-zinc-900 uppercase tracking-widest transition-colors">
                    <ArrowLeft size={14} /> System Administration
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
                {/* Sessions list */}
                <div className="col-span-1 bg-white border border-zinc-100 card overflow-hidden flex flex-col shadow-xl shadow-zinc-900/5">
                    <div className="p-6 border-b border-zinc-50 bg-[#FBFBFB] flex items-center gap-3">
                        <MessageSquare size={16} className="text-zinc-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Active Sessions</span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-3 space-y-2">
                        {loading && <p className="text-xs text-gray-400 p-4 animate-pulse">Loading...</p>}
                        {!loading && sessions.length === 0 && (
                            <p className="text-xs text-gray-400 text-center p-8">No active sessions.</p>
                        )}
                        {sessions.map(session => {
                            const isSelected = session.id === selectedSessionId;
                            return (
                                <button
                                    key={session.id}
                                    onClick={() => setSelectedSessionId(session.id)}
                                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${isSelected
                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/20'
                                        : 'border-transparent hover:border-zinc-50 hover:bg-zinc-50'
                                        }`}
                                >
                                    <div className="text-sm font-bold truncate">
                                        {session.user?.full_name || session.user?.email || session.users_jobs?.full_name || 'Anonymous Guest'}
                                    </div>
                                    <div className={`text-[10px] mt-2 font-bold flex items-center gap-2 ${isSelected ? 'text-white/40' : 'text-zinc-300'}`}>
                                        <Clock size={10} />
                                        {session.created_at ? new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Chat viewer */}
                <div className="col-span-1 lg:col-span-2">
                    {selectedSessionId
                        ? <AdminChatViewer sessionId={selectedSessionId} sessions={sessions} />
                     : (
                            <div className="h-full border border-dashed border-zinc-100 card grid place-items-center text-center p-20 bg-white/50">
                                <div>
                                    <Shield size={48} className="text-zinc-100 mx-auto mb-6" />
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Select Session to Intervene</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};


// ── Admin Chat Viewer ──────────────────────────────────────────

const AdminChatViewer = ({ sessionId, sessions }) => {
    const [messages, setMessages] = useState([]);
    const [intercepted, setIntercepted] = useState(false);
    const [intercepting, setIntercepting] = useState(false);
    const [exited, setExited] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [confirmExit, setConfirmExit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const isNearBottomRef = useRef(true);
    const prevMessageCountRef = useRef(0);

    // Track whether the user has scrolled away from the bottom
    const handleScroll = () => {
        const el = chatContainerRef.current;
        if (!el) return;
        const threshold = 80; // px from bottom
        isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    };

    // Poll session details instead of WebSocket to avoid disconnecting the seeker
    useEffect(() => {
        let isMounted = true;

        const fetchDetails = async () => {
            try {
                const session = await getSessionDetails(sessionId);
                if (!isMounted) return;

                let log = session.conversation_log || [];
                if (typeof log === 'string') {
                    try { log = JSON.parse(log); } catch { log = []; }
                }
                setMessages(log);
            } catch (err) {
                console.error('Failed to fetch session details:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDetails();
        const interval = setInterval(fetchDetails, 3000); // 3-second polling

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [sessionId]);

    // Only auto-scroll if the user is already near the bottom and new messages arrive
    useEffect(() => {
        const newCount = messages.length;
        if (newCount > prevMessageCountRef.current && isNearBottomRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        prevMessageCountRef.current = newCount;
    }, [messages]);

    const handleIntercept = async () => {
        setIntercepting(true);
        try {
            await api.post(`/admin/sessions/${sessionId}/intercept`);
            setIntercepted(true);
        } catch (err) {
            console.error('Intercept failed:', err);
        } finally {
            setIntercepting(false);
        }
    };

    const handleExit = async () => {
        setExiting(true);
        try {
            await releaseSession(sessionId);
        } catch (err) {
            console.error('Release API not available yet:', err);
        } finally {
            setExited(true);
            setIntercepted(false);
            setConfirmExit(false);
            setExiting(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || sending) return;

        const text = inputValue.trim();
        setInputValue('');
        setSending(true);

        // Always scroll to bottom when admin sends a message
        isNearBottomRef.current = true;

        // Optimistic update
        setMessages(prev => [...prev, {
            role: 'admin',
            content: text,
            timestamp: new Date().toISOString()
        }]);

        try {
            await sendAdminMessage(sessionId, text);
        } catch (err) {
            console.error('Failed to send admin message:', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white border border-zinc-100 card overflow-hidden flex flex-col h-full min-h-[500px] shadow-2xl shadow-zinc-900/5">
            {/* Header */}
            <div className="px-8 py-5 border-b border-zinc-50 bg-[#FBFBFB] flex items-center justify-between shrink-0 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${exited ? 'bg-zinc-300' : 'bg-zinc-900 animate-pulse'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 truncate">
                        Secure Monitor: <span className="text-zinc-900">{sessions.find(s => s.id === sessionId)?.user?.full_name || 'Active Session'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-zinc-200 hidden lg:block">{sessionId.slice(0, 16)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* Confirm exit inline prompt */}
                    {confirmExit && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                            <AlertTriangle size={12} className="text-red-400 shrink-0" />
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest whitespace-nowrap">Hand off to AI?</span>
                            <button
                                onClick={handleExit}
                                disabled={exiting}
                                className="ml-2 text-[10px] font-black uppercase tracking-widest text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition-all"
                            >
                                {exiting ? '...' : 'Confirm'}
                            </button>
                            <button
                                onClick={() => setConfirmExit(false)}
                                className="text-[10px] font-bold uppercase tracking-widest text-red-300 hover:text-red-500 px-2 py-1 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Exit button — only shown while intercepted and not yet exited */}
                    {intercepted && !exited && !confirmExit && (
                        <button
                            onClick={() => setConfirmExit(true)}
                            className="flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border border-zinc-200 text-zinc-400 hover:border-red-200 hover:text-red-500 hover:bg-red-50"
                        >
                            <LogOut size={13} /> Exit Session
                        </button>
                    )}

                    {/* Join / Joined / Released button */}
                    {exited ? (
                        <div className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-zinc-50 text-zinc-300">
                            <Bot size={14} /> AI Resumed
                        </div>
                    ) : (
                        <button
                            onClick={handleIntercept}
                            disabled={intercepted || intercepting}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                                intercepted
                                    ? 'bg-zinc-50 text-zinc-300 cursor-not-allowed'
                                    : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-900/10'
                            }`}
                        >
                            {intercepted
                                ? <><CheckCircle size={14} /> Joined Session</>
                                : <><Zap size={14} /> {intercepting ? 'Connecting...' : 'Join Session'}</>
                            }
                        </button>
                    )}
                </div>
            </div>

            {/* AI Resumed Banner */}
            {exited && (
                <div className="flex items-center justify-center gap-3 px-8 py-3 bg-zinc-50 border-b border-zinc-100 shrink-0">
                    <Bot size={12} className="text-zinc-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Session handed back — AI assistant is now responding
                    </span>
                </div>
            )}

            {/* Messages */}
            <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {loading && messages.length === 0 && (
                    <div className="h-full grid place-items-center text-black/20 text-xs font-medium text-center">
                        Loading chat history...
                    </div>
                )}
                {!loading && messages.length === 0 && (
                    <div className="h-full grid place-items-center text-black/20 text-xs font-medium text-center">
                        Waiting for messages...
                    </div>
                )}
                {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    const isSystem = msg.role === 'system';
                    const isAdmin = msg.role === 'admin';

                    if (isSystem) {
                        return (
                            <div key={idx} className="flex justify-center">
                                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 border border-zinc-100 px-5 py-2 rounded-full flex items-center gap-2 uppercase tracking-widest">
                                    <Shield size={12} /> {msg.content}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <div key={idx} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 border transition-all ${isUser
                                ? 'bg-zinc-900 border-zinc-800 text-white'
                                : isAdmin
                                    ? 'bg-white border-zinc-100 text-zinc-900 shadow-sm'
                                    : 'bg-zinc-50 border-zinc-100 text-zinc-400'
                                }`}>
                                {isUser ? <User size={16} /> : isAdmin ? <Shield size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`max-w-[75%] ${isUser ? 'text-right' : 'text-left'}`}>
                                <div className={`p-5 card text-xs leading-relaxed shadow-sm transition-all ${isUser
                                    ? 'bg-zinc-900 text-white rounded-tr-sm'
                                    : isAdmin
                                        ? 'bg-white border border-zinc-100 text-zinc-900 rounded-tl-sm shadow-xl shadow-zinc-900/5'
                                        : 'bg-white border border-zinc-50 text-zinc-600 rounded-tl-sm'
                                    }`}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                </div>
                                <div className="text-[9px] font-bold text-zinc-300 mt-2 px-1 uppercase tracking-widest">
                                    {isUser ? 'User' : isAdmin ? 'Staff' : 'AI Assistant'} · {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form (Only if intercepted and not exited) */}
            {intercepted && !exited && (
                <div className="p-6 border-t border-zinc-100 bg-[#FBFBFB] flex items-center gap-4 shrink-0">
                    <form onSubmit={handleSend} className="flex-1 flex gap-4">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message to the seeker..."
                            className="flex-1 bg-white border border-zinc-100 rounded-2xl px-6 py-4 text-xs font-semibold text-zinc-900 placeholder:text-zinc-200 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || sending}
                            className="bg-zinc-900 text-white px-8 py-4 rounded-2xl flex items-center justify-center hover:bg-zinc-800 disabled:opacity-30 transition-all font-bold text-xs"
                        >
                            {sending ? '...' : <Send size={20} />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default HelpDeskPage;
