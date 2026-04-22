import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { setMockJobContext, setMockMode, uploadMockResume, createMockInterviewReview } from '../../api/mockInterviewApi';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useMicrophone } from '../../hooks/useMicrophone';
import { usePlayback } from '../../hooks/usePlayback';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toJpeg } from 'html-to-image';
import {
    ArrowLeft,
    Mic,
    MicOff,
    StopCircle,
    Clock,
    Zap,
    Activity,
    User,
    Bot,
    AlertTriangle,
    BarChart2,
    ChevronRight,
    Radio,
    FileText,
    Upload,
    Download,
    CheckCircle,
} from 'lucide-react';

// ── Config ────────────────────────────────────────────────────
// URLs come from .env — never hardcoded in source
const MOCK_WS_BASE = import.meta.env.VITE_MOCK_WS_URL || 'ws://localhost:8001/mock/ws';


// ── Sub-components ────────────────────────────────────────────

const SiriVisualizer = ({ isActive }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const phaseRef = useRef(0);
    const waves = [
        { amplitude: 12, frequency: 0.06, color: 'rgba(24,24,27,0.8)', speed: 0.08 },
        { amplitude: 10, frequency: 0.04, color: 'rgba(113,113,122,0.8)', speed: -0.06 },
        { amplitude: 8, frequency: 0.08, color: 'rgba(161,161,170,0.8)', speed: 0.1 },
    ];

    const animate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'screen';
        phaseRef.current += 0.03;
        waves.forEach((wave, i) => {
            ctx.beginPath();
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 2.5;
            const targetAmp = isActive ? wave.amplitude : 3;
            wave.currentAmp = wave.currentAmp
                ? wave.currentAmp + (targetAmp - wave.currentAmp) * 0.15
                : targetAmp;
            for (let x = 0; x < width; x++) {
                const y =
                    height / 2 +
                    Math.sin(x * wave.frequency + phaseRef.current * wave.speed + i) *
                    wave.currentAmp;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        });
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [isActive]);

    return (
        <div
            className={`relative w-20 h-20 rounded-full overflow-hidden border border-zinc-100 bg-[#FAFAFA] transition-all duration-500 ${isActive ? 'scale-110 shadow-xl shadow-zinc-900/5' : ''
                }`}
        >
            <canvas ref={canvasRef} width={80} height={80} style={{ filter: 'blur(3px)', transform: 'scale(1.2)' }} />
        </div>
    );
};

// ── Main Page ─────────────────────────────────────────────────
const MockInterviewPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const { addNotification } = useNotifications();
    const jobTitle = location.state?.jobTitle || '';
    const companyName = location.state?.companyName || '';

    // Session step: 'entry' | 'interview'
    const [step, setStep] = useState('entry');

    // Entry state
    const [interviewType, setInterviewType] = useState('technical');
    const [duration, setDuration] = useState(10);
    const [proctorMode, setProctorMode] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [sessionResumeName, setSessionResumeName] = useState(null);

    // Interview state
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState('Disconnected');
    const [statusClass, setStatusClass] = useState('disconnected');
    const [errorMsg, setErrorMsg] = useState('');
    const [transcripts, setTranscripts] = useState([]);
    const [responses, setResponses] = useState([]);
    const [conversationLog, setConversationLog] = useState([]);
    const [currentResponse, setCurrentResponse] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [violationCount, setViolationCount] = useState(0);
    const [showViolationAlert, setShowViolationAlert] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isSavingInterview, setIsSavingInterview] = useState(false);
    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
    const [reviewTicket, setReviewTicket] = useState(null);
    const [showCompletionOptions, setShowCompletionOptions] = useState(false);

    // Compute safe session ID (default to 'default_session' if no job ID is in the URL)
    const sessionId = id || 'default_session';

    const { session, profile } = useAuth();
    const token = session?.access_token;

    // Resume is available if either profile has it OR session has it
    const hasResume = !!profile?.resume_text || !!sessionResumeName;

    // Compute WebSocket URL with session and token
    const wsUrl = `${MOCK_WS_BASE}?session_id=${sessionId}${token ? `&token=${token}` : ''}`;

    const transcriptRef = useRef(null);
    const responseRef = useRef(null);
    const forcedMuteRef = useRef(false);
    const stopSessionRef = useRef(null);
    const endingRef = useRef(false);
    const interviewRecordIdRef = useRef(crypto.randomUUID());

    // Auto-scroll transcript/response panels
    useEffect(() => {
        if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
        }
    }, [transcripts]);
    useEffect(() => {
        if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
        }
    }, [responses, currentResponse]);

    const updateStatus = (text, cls) => {
        setStatus(text);
        setStatusClass(cls);
    };

    const appendConversationEntry = useCallback((role, content) => {
        const normalizedContent = typeof content === 'string' ? content.trim() : '';
        if (!normalizedContent) return;

        setConversationLog((prev) => [
            ...prev,
            {
                role,
                content: normalizedContent,
                created_at: new Date().toISOString(),
            },
        ]);
    }, []);

    const { initPlayback, playPCMChunk, stopPlayback, isSpeaking } = usePlayback((speaking) => {
        forcedMuteRef.current = speaking;
    });

    const handleMessage = useCallback(
        (data) => {
            if (data instanceof ArrayBuffer) {
                forcedMuteRef.current = true;
                updateStatus('Speaking', 'speaking');
                playPCMChunk(data);
            } else if (typeof data === 'string') {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.type === 'transcript') {
                        setTranscripts((prev) => [...prev, parsed.text]);
                        appendConversationEntry('user', parsed.text);
                    } else if (parsed.type === 'response_start') {
                        setCurrentResponse('');
                    } else if (parsed.type === 'response_chunk') {
                        setCurrentResponse((prev) => prev + parsed.text);
                    } else if (parsed.type === 'response_done') {
                        setCurrentResponse('');
                        setResponses((prev) => [...prev, parsed.text]);
                        appendConversationEntry('assistant', parsed.text);
                    } else if (parsed.type === 'response') {
                        setResponses((prev) => [...prev, parsed.text]);
                        appendConversationEntry('assistant', parsed.text);
                    } else if (parsed.type === 'session_end_trigger') {
                        if (stopSessionRef.current) stopSessionRef.current();
                    }
                } catch {
                    setResponses((prev) => [...prev, data]);
                    appendConversationEntry('assistant', data);
                }
            }
        },
        [appendConversationEntry, playPCMChunk]
    );

    const { connect, sendAudioChunk, disconnect } = useWebSocket(
        wsUrl,
        () => {
            updateStatus('Listening', 'listening');
            startMic();
        },
        handleMessage,
        (err) => {
            setErrorMsg(err);
            handleStop();
        },
        () => handleStop()
    );

    const { startMic, stopMic } = useMicrophone(
        (blob) => {
            sendAudioChunk(blob);
            updateStatus('Processing', 'processing');
            setTimeout(() => {
                setStatus((curr) => (curr === 'Processing' ? 'Listening' : curr));
                setStatusClass((curr) => (curr === 'processing' ? 'listening' : curr));
            }, 500);
        },
        (err) => {
            setErrorMsg(err);
            handleStop();
        },
        isSpeaking,
        forcedMuteRef,
        isMuted
    );

    const persistInterviewForReview = useCallback(async () => {
        if (!session?.user?.id || reviewTicket?.id) return;

        setIsSavingInterview(true);
        try {
            const record = await createMockInterviewReview({
                id: interviewRecordIdRef.current,
                userId: session.user.id,
                jobId: id || null,
                interviewType,
                durationMinutes: duration,
                transcript: conversationLog,
                userTranscript: transcripts,
                aiTranscript: responses,
            });

            setReviewTicket(record);
        } catch (err) {
            console.error('Failed to queue interview for admin review:', err);
            setErrorMsg('Your interview ended, but we could not queue the review yet. Please try again.');
        } finally {
            setIsSavingInterview(false);
        }
    }, [conversationLog, duration, id, interviewType, responses, reviewTicket?.id, session?.user?.id, transcripts]);

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingResume(true);
        setErrorMsg('');
        try {
            const data = await uploadMockResume(file, sessionId);
            if (data.error) throw new Error(data.error);
            setSessionResumeName(file.name);
        } catch (err) {
            setErrorMsg('Resume upload failed: ' + err.message);
        } finally {
            setUploadingResume(false);
        }
    };

    const handleStart = async () => {
        setIsStarting(true);
        setErrorMsg('');
        setTranscripts([]);
        setResponses([]);
        setConversationLog([]);
        setReviewTicket(null);
        setViolationCount(0);
        setShowViolationAlert(false);
        endingRef.current = false;
        interviewRecordIdRef.current = crypto.randomUUID();

        try {
            // Push job context to mock backend (runs on the same server as jobs backend)
            await setMockJobContext(companyName, jobTitle, sessionId);
            await setMockMode(interviewType, sessionId);
        } catch (err) {
            console.error('Failed to set context/mode:', err);
        }

        if (proctorMode) {
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                }
            } catch (err) {
                console.error('Fullscreen request failed:', err);
            }
        }

        setTimeLeft(duration * 60);
        setIsTimerActive(true);
        setIsActive(true);
        updateStatus('Connecting', 'connecting');
        initPlayback();
        connect();
        setIsStarting(false);
        setStep('interview');
    };

    const handleStop = useCallback(async (isTimeout = false) => {
        if (endingRef.current) return;
        endingRef.current = true;
        setIsActive(false);
        setIsTimerActive(false);
        setIsMuted(false);
        stopMic();
        disconnect();
        stopPlayback();
        updateStatus('Disconnected', 'disconnected');
        if (isTimeout) {
            setResponses((prev) => [
                ...prev,
                'Thank you for the interview. The allocated time has ended.',
            ]);
        }
        
        // Instead of auto-persisting, we show options
        setShowCompletionOptions(true);
    }, [disconnect, stopMic, stopPlayback]);

    const handleFinalSubmit = async () => {
        await persistInterviewForReview();
        setIsReviewSubmitted(true);
        setShowCompletionOptions(false);

        // Add local notification
        addNotification({
            title: 'Review Submitted',
            message: `Your interview for ${jobTitle || 'selected role'} has been sent to our experts.`,
            type: 'info',
            link: '/interview-reviews'
        });
    };

    const handleFinalCancel = () => {
        if (window.confirm('Are you sure you want to discard this practice session? Your progress will not be saved for review.')) {
            // Reset everything and go back to entry
            setStep('entry');
            setIsActive(false);
            setTranscripts([]);
            setResponses([]);
            setConversationLog([]);
            setReviewTicket(null);
            setShowCompletionOptions(false);
            setIsReviewSubmitted(false);
        }
    };

    // Keep stopSessionRef in sync
    useEffect(() => {
        stopSessionRef.current = handleStop;
    }, [handleStop]);

    // Proctor violation detection
    useEffect(() => {
        if (proctorMode && isActive) {
            const handler = () => {
                if (document.visibilityState === 'hidden') {
                    setViolationCount((prev) => prev + 1);
                    setShowViolationAlert(true);
                }
            };
            document.addEventListener('visibilitychange', handler);
            return () => document.removeEventListener('visibilitychange', handler);
        }
    }, [proctorMode, isActive]);

    // Timer countdown
    useEffect(() => {
        let interval = null;
        if (isTimerActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0 && isTimerActive) {
            clearInterval(interval);
            handleStop(true);
        }
        return () => clearInterval(interval);
    }, [handleStop, isTimerActive, timeLeft]);

    const formatTime = (s) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    // ── Status pill color ───────────────────────────────────────
    const statusColors = {
        disconnected: 'bg-zinc-50 text-zinc-400 border-zinc-100',
        connecting: 'bg-zinc-50 text-zinc-500 border-zinc-100 animate-pulse',
        listening: 'bg-zinc-900 text-white border-zinc-900',
        processing: 'bg-zinc-100 text-zinc-600 border-zinc-200',
        speaking: 'bg-zinc-50 text-zinc-900 border-zinc-200',
    };
    const statusPill = statusColors[isSpeaking ? 'speaking' : statusClass] || statusColors.disconnected;

    // ── ENTRY SCREEN ──────────────────────────────────────────
    if (step === 'entry') {
        return (
            <div className="min-h-screen py-8 px-4 md:px-6 bg-[#FBFBFB] flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6"
                    >
                        <Link
                            to={id ? `/jobs/${id}` : '/jobs'}
                            className="inline-flex items-center gap-3 text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em] hover:text-zinc-900 transition-colors"
                        >
                            <ArrowLeft size={14} /> Back
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-xl shadow-zinc-900/5"
                    >
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                                    <Radio size={20} className="text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                                    Mock Interview
                                </h1>
                            </div>
                            {(companyName || jobTitle) && (
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mt-4 flex items-center gap-3">
                                    <div className="w-8 h-[1px] bg-zinc-100" />
                                    {companyName && `${companyName} • `}{jobTitle}
                                </p>
                            )}
                        </div>

                        {/* Interview Type */}
                        <div className="mb-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6 text-zinc-300">
                                01 / SELECT MODE
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {['technical', 'hr'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setInterviewType(type)}
                                        className={`py-3 rounded-xl border transition-all duration-300 font-bold text-[11px] uppercase tracking-widest ${interviewType === type
                                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-900/10'
                                                : 'bg-zinc-50 text-zinc-400 border-zinc-100 premium-tag'
                                            }`}
                                    >
                                        {type === 'technical' ? 'Technical Interview' : 'Behavioral Interview'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="mb-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6 text-zinc-300">
                                02 / INTERVIEW DURATION
                            </p>
                            <div className="grid grid-cols-4 gap-3">
                                {[5, 10, 15, 20].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={`py-2.5 rounded-xl border transition-all duration-500 font-bold text-[11px] uppercase tracking-widest ${duration === d
                                                ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/10'
                                                : 'bg-zinc-50 text-zinc-400 border-zinc-100 hover:bg-zinc-100'
                                            }`}
                                    >
                                        {d}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Proctor Toggle */}
                        <div className="mb-6 p-6 bg-zinc-50/50 rounded-2xl border border-zinc-100 flex items-center justify-between">
                            <div>
                                <p className="font-bold text-xs uppercase tracking-widest text-zinc-900">Enable Proctoring</p>
                                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide mt-1">
                                    Monitor focus during session
                                </p>
                            </div>
                            <button
                                onClick={() => setProctorMode((prev) => !prev)}
                                className={`w-12 h-7 rounded-full border transition-all duration-500 flex items-center ${proctorMode ? 'bg-zinc-900 border-zinc-900' : 'bg-zinc-200 border-zinc-200'
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full mx-1 transition-transform duration-500 ${proctorMode ? 'translate-x-[20px]' : ''
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Resume Status */}
                        <div className="mb-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6 text-zinc-300">
                                03 / RESUME CONTEXT
                            </p>
                            <div className={`p-6 rounded-2xl border transition-all duration-500 ${hasResume ? 'border-zinc-100 bg-[#FAFAFA]' : 'border-red-100 bg-red-50/50'
                                }`}>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${hasResume ? 'bg-zinc-900' : 'bg-red-500'
                                            }`}>
                                            <FileText size={22} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-xs uppercase tracking-widest text-zinc-900">
                                                {sessionResumeName
                                                    ? 'Custom Session Resume'
                                                    : profile?.resume_text
                                                        ? 'Using Profile Data'
                                                        : 'Resume Missing'}
                                            </p>
                                            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide mt-1">
                                                {sessionResumeName
                                                    ? `${sessionResumeName}`
                                                    : profile?.resume_text
                                                        ? 'Automated mapping enabled'
                                                        : 'Upload required for logic sync'}
                                            </p>
                                        </div>
                                    </div>

                                    <label className="cursor-pointer group">
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleResumeUpload}
                                            accept=".pdf,.docx"
                                            disabled={uploadingResume}
                                        />
                                        <div className="flex items-center gap-2.5 px-6 py-3 bg-white border border-zinc-100 rounded-full font-bold text-[10px] uppercase tracking-widest hover:border-zinc-900 transition-all shadow-sm">
                                            {uploadingResume ? <Activity size={14} className="animate-pulse" /> : <Upload size={14} />}
                                            {hasResume ? 'Update' : 'Initialize'}
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Advisory */}
                        <div className="mb-6 p-6 bg-zinc-50 border border-zinc-100 rounded-2xl">
                            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest leading-relaxed flex items-center gap-3">
                                <Zap size={16} className="text-zinc-900 shrink-0" />
                                Optimal results require a silent environment and high-fidelity audio input.
                            </p>
                        </div>

                        {/* Start button */}
                        <button
                            onClick={handleStart}
                            disabled={isStarting || !hasResume || uploadingResume}
                            className="w-full py-6 bg-zinc-900 text-white rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-zinc-900/20 disabled:opacity-30 active:scale-95"
                        >
                            {isStarting ? (
                                <>
                                    <Activity size={20} className="animate-pulse" /> STARTING SESSION...
                                </>
                            ) : (
                                <>
                                    {!hasResume ? 'UPLOAD RESUME TO START' : (
                                        <>
                                            START PRACTICE INTERVIEW
                                            <ChevronRight size={20} />
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // ── INTERVIEW SCREEN ──────────────────────────────────────
    return (
        <>
            <div className="min-h-screen pt-8 pb-12 px-6 md:px-10 bg-[#FBFBFB]">
                <div className="max-w-[1600px] mx-auto space-y-8">
                    {/* Top bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-zinc-100">
                        <div className="flex items-center gap-6">
                            <SiriVisualizer isActive={isSpeaking} />
                            <div>
                                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                                    Practice Interview
                                </h1>
                                {(companyName || jobTitle) && (
                                    <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-400 mt-2 truncate max-w-md">
                                        {companyName}{jobTitle && ` • ${jobTitle}`}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            {isTimerActive && (
                                <div className="flex items-center gap-3 px-6 py-3 bg-zinc-50 border border-zinc-100 text-zinc-900 rounded-full font-sans font-bold text-lg tracking-tight shadow-sm">
                                    <Clock size={18} className="text-zinc-300" /> {formatTime(timeLeft)}
                                </div>
                            )}

                            {/* Status */}
                            <span className={`px-6 py-3 border rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${statusPill}`}>
                                {isSpeaking ? 'PROCESSING' : status.toUpperCase()}
                            </span>

                            {/* Mute */}
                            <button
                                onClick={() => setIsMuted((prev) => !prev)}
                                disabled={!isActive}
                                className={`premium-tag flex items-center gap-2.5 px-6 py-3.5 rounded-full border font-bold text-[10px] uppercase tracking-widest transition-all disabled:opacity-30 ${isMuted
                                        ? 'bg-zinc-900 text-white border-zinc-900'
                                        : 'bg-white text-zinc-900 border-zinc-100 hover:border-zinc-900'
                                    }`}
                            >
                                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                                {isMuted ? 'Unmute' : 'Mute'}
                            </button>

                            {/* Stop */}
                            <button
                                onClick={() => handleStop()}
                                disabled={!isActive}
                                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-red-100 bg-red-50/50 text-red-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
                            >
                                <StopCircle size={16} /> End
                            </button>

                            {/* Back to entry */}
                            <button
                                onClick={() => {
                                    if (document.fullscreenElement) document.exitFullscreen().catch(() => { });
                                    setStep('entry');
                                    handleStop();
                                }}
                                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full border border-zinc-100 bg-white text-zinc-900 font-bold text-[10px] uppercase tracking-widest hover:border-zinc-900 transition-all"
                            >
                                <ArrowLeft size={16} /> Exit
                            </button>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                            <AlertTriangle size={18} className="text-red-500" />
                            <p className="text-red-600 font-bold text-xs uppercase tracking-widest">{errorMsg}</p>
                        </div>
                    )}

                    {!isActive && (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[40px] border border-zinc-100 p-12 shadow-2xl shadow-zinc-900/5"
                        >
                            {showCompletionOptions ? (
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                                    <div className="max-w-2xl">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-2 h-2 bg-zinc-900 rounded-full animate-pulse" />
                                            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900">Session Completed</p>
                                        </div>
                                        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">Ready to Submit?</h2>
                                        <p className="text-base text-zinc-500 leading-relaxed">
                                            You've completed your practice session. Choose whether to submit your transcript for a detailed expert review or discard this session and try again.
                                        </p>
                                        <div className="flex items-center gap-8 mt-8">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Duration</span>
                                                <span className="text-sm font-bold text-zinc-900">{duration} Minutes</span>
                                            </div>
                                            <div className="w-px h-8 bg-zinc-100" />
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Transcript</span>
                                                <span className="text-sm font-bold text-zinc-900">{conversationLog.length} Exchanges</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-6 min-w-[360px]">
                                        <button
                                            onClick={handleFinalSubmit}
                                            className="flex-1 w-full py-4 bg-zinc-900 text-white rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 active:scale-95"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            onClick={handleFinalCancel}
                                            className="flex-1 w-full py-4 bg-white text-zinc-400 border border-zinc-100 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:border-zinc-900 hover:text-zinc-900 transition-all active:scale-95"
                                        >
                                            Discard
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                    <div className="max-w-3xl">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-4">Interview Submitted</p>
                                        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">Thank you for completing your mock interview.</h2>
                                        <p className="text-base text-zinc-500 leading-relaxed">
                                            Your analysis will be ready in some time. We have shared your interview transcript and the AI interviewer transcript with our admin review team.
                                        </p>
                                    </div>

                                    <div className="min-w-[260px] bg-[#FAFAFA] border border-zinc-100 rounded-[28px] p-8">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-3">Review Status</p>
                                        <div className="flex items-center gap-3 text-zinc-900 font-bold text-sm">
                                            {isSavingInterview ? <Activity size={18} className="animate-pulse" /> : <CheckCircle size={18} />}
                                            {isSavingInterview ? 'Sending transcript to admin...' : reviewTicket?.status === 'pending_review' ? 'Queued for admin review' : 'Awaiting review'}
                                        </div>
                                        {reviewTicket?.id && (
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300 mt-4 break-all">
                                                Ticket {reviewTicket.id}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Transcript + Response panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Participant Transcript */}
                        <div className="bg-white rounded-2xl border border-zinc-100 p-8 shadow-2xl shadow-zinc-900/5">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-6 flex items-center gap-4 pb-6 border-b border-zinc-100 text-zinc-400">
                                <User size={18} className="text-zinc-300" /> Participant Signal
                            </h2>
                            <div
                                ref={transcriptRef}
                                className="h-96 overflow-y-auto flex flex-col gap-6 pr-4 custom-scrollbar"
                            >
                                {transcripts.length === 0 ? (
                                    <p className="text-xs font-medium text-zinc-300 italic">
                                        Awaiting input stream...
                                    </p>
                                ) : (
                                    transcripts.map((t, i) => (
                                        <motion.p
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base font-medium text-zinc-600 leading-relaxed"
                                        >
                                            {t}
                                        </motion.p>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* AI Response */}
                        <div className="bg-white rounded-2xl border border-zinc-100 p-8 shadow-2xl shadow-zinc-900/5">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-6 flex items-center gap-4 pb-6 border-b border-zinc-100 text-zinc-400">
                                <Bot size={18} className="text-zinc-300" /> AI Interviewer
                            </h2>
                            <div
                                ref={responseRef}
                                className="h-96 overflow-y-auto flex flex-col gap-6 pr-4 custom-scrollbar"
                            >
                                {responses.length === 0 && !currentResponse ? (
                                    <p className="text-xs font-medium text-zinc-300 italic">
                                        Awaiting logic synthesis...
                                    </p>
                                ) : (
                                    responses.map((r, i) => (
                                        <motion.p
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-base font-medium text-zinc-900 leading-relaxed"
                                        >
                                            {r}
                                        </motion.p>
                                    ))
                                )}
                                {currentResponse && (
                                    <p className="text-base font-bold text-zinc-900 leading-relaxed">
                                        {currentResponse}
                                        <span className="inline-block w-1.5 h-5 bg-zinc-900 ml-1 animate-pulse align-middle" />
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Proctor Violation Overlay */}
            <AnimatePresence>
                {showViolationAlert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center p-8 bg-white/80 backdrop-blur-2xl"
                    >
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <AlertTriangle size={40} className="text-red-500" />
                        </div>
                        <h2 className="text-zinc-900 text-4xl font-bold tracking-tight mb-6">
                            Focus Interrupted
                        </h2>
                        <p className="text-zinc-500 text-base max-w-md mb-6 font-medium leading-relaxed">
                            Sim session requires absolute cognitive focus. This interruption has been logged in the performance matrix.
                        </p>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="px-6 py-4 bg-zinc-50 rounded-3xl border border-zinc-100">
                                <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-1">Total Violations</p>
                                <p className="text-2xl font-bold text-zinc-900">{violationCount}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowViolationAlert(false)}
                            className="px-12 py-5 bg-zinc-900 text-white rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20 active:scale-95"
                        >
                            Return to Interface
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MockInterviewPage;
