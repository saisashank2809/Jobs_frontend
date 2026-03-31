import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { setMockJobContext, setMockMode, getMockEvaluation, uploadMockResume } from '../../api/mockInterviewApi';
import { useAuth } from '../../hooks/useAuth';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useMicrophone } from '../../hooks/useMicrophone';
import { usePlayback } from '../../hooks/usePlayback';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Mic,
    MicOff,
    StopCircle,
    Play,
    CheckCircle,
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
} from 'lucide-react';

// ── Config ────────────────────────────────────────────────────
// URLs come from .env — never hardcoded in source
const MOCK_BACKEND = import.meta.env.VITE_MOCK_API_URL || 'http://localhost:8001/mock';
const MOCK_WS_BASE = import.meta.env.VITE_MOCK_WS_URL || 'ws://localhost:8001/mock/ws';


// ── Sub-components ────────────────────────────────────────────

/** Siri-style animated wave visualizer */
const SiriVisualizer = ({ isActive }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const phaseRef = useRef(0);
    const waves = [
        { amplitude: 12, frequency: 0.06, color: 'rgba(255,0,128,0.8)', speed: 0.08 },
        { amplitude: 10, frequency: 0.04, color: 'rgba(0,210,255,0.8)', speed: -0.06 },
        { amplitude: 8, frequency: 0.08, color: 'rgba(75,0,255,0.8)', speed: 0.1 },
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
            className={`relative w-16 h-16 rounded-full overflow-hidden border-2 border-black shadow-[4px_4px_0px_#000] transition-all duration-500 ${
                isActive ? 'scale-110' : ''
            }`}
            style={{ background: '#050505' }}
        >
            <canvas ref={canvasRef} width={64} height={64} style={{ filter: 'blur(2px)', transform: 'scale(1.3)' }} />
        </div>
    );
};

/** Evaluation report card */
const EvalReport = ({ evaluation }) => {
    if (!evaluation) return null;
    const {
        overall_score = 0,
        strengths = [],
        areas_for_improvement = [],
        detailed_feedback = '',
        recommended_topics_to_review = [],
    } = evaluation;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border-2 border-black p-10 shadow-[12px_12px_0px_rgba(0,0,0,0.05)] space-y-8"
        >
            <h2 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <div className="w-2 h-6 bg-black" /> Final Assessment Report
            </h2>

            {/* Score */}
            <div className="flex items-center gap-8">
                <div className="text-7xl font-black font-display tracking-tighter leading-none">
                    {overall_score}%
                </div>
                <div className="flex-1 h-5 bg-gray-100 border-2 border-black rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-black rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${overall_score}%` }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-2xl border-2 border-black">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 opacity-50">Strengths</h3>
                    <ul className="space-y-2">
                        {strengths.length > 0 ? (
                            strengths.map((s, i) => (
                                <li key={i} className="flex gap-2 text-xs font-bold uppercase tracking-wide">
                                    <CheckCircle size={14} className="shrink-0 mt-0.5 text-black" /> {s}
                                </li>
                            ))
                        ) : (
                            <li className="text-xs font-bold opacity-30 uppercase">No data</li>
                        )}
                    </ul>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border-2 border-black">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 opacity-50">Areas for Improvement</h3>
                    <ul className="space-y-2">
                        {areas_for_improvement.length > 0 ? (
                            areas_for_improvement.map((a, i) => (
                                <li key={i} className="flex gap-2 text-xs font-bold uppercase tracking-wide">
                                    <AlertTriangle size={14} className="shrink-0 mt-0.5 text-black" /> {a}
                                </li>
                            ))
                        ) : (
                            <li className="text-xs font-bold opacity-30 uppercase">No data</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Feedback */}
            {detailed_feedback && (
                <div className="p-6 bg-gray-50 rounded-2xl border-2 border-black">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 opacity-50">Detailed Analysis</h3>
                    <p className="text-sm font-medium leading-relaxed text-black">{detailed_feedback}</p>
                </div>
            )}

            {/* Topics */}
            {recommended_topics_to_review.length > 0 && (
                <div>
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 opacity-50">Topics to Review</h3>
                    <div className="flex flex-wrap gap-2">
                        {recommended_topics_to_review.map((t, i) => (
                            <span key={i} className="px-4 py-2 border-2 border-black rounded-xl text-[9px] font-black uppercase tracking-widest">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// ── Main Page ─────────────────────────────────────────────────
const MockInterviewPage = () => {
    const { id } = useParams();
    const location = useLocation();
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
    const [currentResponse, setCurrentResponse] = useState('');
    const [evaluation, setEvaluation] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [violationCount, setViolationCount] = useState(0);
    const [showViolationAlert, setShowViolationAlert] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [forceResumeUpload, setForceResumeUpload] = useState(false);

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
                    } else if (parsed.type === 'response_start') {
                        setCurrentResponse('');
                    } else if (parsed.type === 'response_chunk') {
                        setCurrentResponse((prev) => prev + parsed.text);
                    } else if (parsed.type === 'response_done') {
                        setCurrentResponse('');
                        setResponses((prev) => [...prev, parsed.text]);
                    } else if (parsed.type === 'response') {
                        setResponses((prev) => [...prev, parsed.text]);
                    }
                } catch {
                    setResponses((prev) => [...prev, data]);
                }
            }
        },
        [playPCMChunk]
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

    const fetchEvaluation = async () => {
        setIsEvaluating(true);
        setErrorMsg('');
        try {
            const data = await getMockEvaluation(sessionId);
            if (data.error) throw new Error(data.error);
            setEvaluation(data);
        } catch (err) {
            setErrorMsg('Failed to fetch evaluation: ' + err.message);
        } finally {
            setIsEvaluating(false);
        }
    };

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
        setEvaluation(null);
        setTranscripts([]);
        setResponses([]);
        setViolationCount(0);
        setShowViolationAlert(false);

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

    const handleStop = (isTimeout = false) => {
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
                'Thank you for the interview. The allocated time has ended. Analysing your performance now…',
            ]);
        }
        fetchEvaluation();
    };

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
    }, [isTimerActive, timeLeft]);

    const formatTime = (s) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    // ── Status pill color ───────────────────────────────────────
    const statusColors = {
        disconnected: 'bg-gray-100 text-gray-500',
        connecting: 'bg-yellow-50 text-yellow-700 border-yellow-300',
        listening: 'bg-green-50 text-green-700 border-green-300',
        processing: 'bg-blue-50 text-blue-700 border-blue-300',
        speaking: 'bg-purple-50 text-purple-700 border-purple-300',
    };
    const statusPill = statusColors[isSpeaking ? 'speaking' : statusClass] || statusColors.disconnected;

    // ── ENTRY SCREEN ──────────────────────────────────────────
    if (step === 'entry') {
        return (
            <div className="min-h-screen pt-16 pb-24 px-4 md:px-8 bg-white flex flex-col items-center justify-center">
                <div className="w-full max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-10"
                    >
                        <Link
                            to={id ? `/jobs/${id}` : '/jobs'}
                            className="inline-flex items-center gap-2 text-black font-black uppercase text-[10px] tracking-[0.3em] hover:translate-x-[-4px] transition-transform"
                        >
                            <ArrowLeft size={16} /> Back to Job
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white rounded-3xl border-4 border-black p-10 shadow-[16px_16px_0px_#000]"
                    >
                        {/* Header */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                                    <Radio size={20} className="text-white" />
                                </div>
                                <h1 className="font-display text-3xl font-black uppercase tracking-tighter">
                                    Mock Interview
                                </h1>
                            </div>
                            {(companyName || jobTitle) && (
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 mt-2">
                                    {companyName && `${companyName} · `}{jobTitle}
                                </p>
                            )}
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">
                                Configure your session for the best results.
                            </p>
                        </div>

                        {/* Interview Type */}
                        <div className="mb-8">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 opacity-40">
                                1 · Interview Type
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {['technical', 'hr'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setInterviewType(type)}
                                        className={`py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                                            interviewType === type
                                                ? 'bg-black text-white border-black shadow-[4px_4px_0px_rgba(0,0,0,0.2)]'
                                                : 'bg-white text-black border-black hover:bg-gray-50'
                                        }`}
                                    >
                                        {type === 'technical' ? '⚙ Technical' : '🧑‍💼 HR / Behavioral'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="mb-8">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 opacity-40">
                                2 · Duration
                            </p>
                            <div className="grid grid-cols-4 gap-3">
                                {[5, 10, 15, 20].map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={`py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                                            duration === d
                                                ? 'bg-black text-white border-black'
                                                : 'bg-white text-black border-black hover:bg-gray-50'
                                        }`}
                                    >
                                        {d} min
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Proctor Toggle */}
                        <div className="mb-10 p-5 border-2 border-black/10 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="font-black text-xs uppercase tracking-widest">Proctor Mode</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-1">
                                    Mandatory fullscreen + tab monitoring
                                </p>
                            </div>
                            <button
                                onClick={() => setProctorMode((prev) => !prev)}
                                className={`w-14 h-8 rounded-full border-2 border-black transition-all duration-300 flex items-center ${
                                    proctorMode ? 'bg-black' : 'bg-white'
                                }`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full border-2 border-black mx-1 transition-transform duration-300 ${
                                        proctorMode ? 'translate-x-6' : ''
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Resume Status */}
                        <div className="mb-10">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 opacity-40">
                                3 · Resume Data
                            </p>
                            <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                                hasResume ? 'border-black bg-gray-50' : 'border-red-200 bg-red-50'
                            }`}>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            hasResume ? 'bg-black' : 'bg-red-500'
                                        }`}>
                                            <FileText size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="font-black text-xs uppercase tracking-widest">
                                                {sessionResumeName 
                                                    ? 'Session Override Active' 
                                                    : profile?.resume_text 
                                                        ? 'Using Profile Resume' 
                                                        : 'No Resume Detected'}
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide mt-1">
                                                {sessionResumeName 
                                                    ? `File: ${sessionResumeName}`
                                                    : profile?.resume_text 
                                                        ? 'Picked up automatically from your profile' 
                                                        : 'Upload one below or in your profile to start'}
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
                                        <div className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                                            {uploadingResume ? <Activity size={12} className="animate-pulse" /> : <Upload size={12} />}
                                            {hasResume ? 'Change' : 'Upload'}
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Advisory */}
                        <div className="mb-10 p-5 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
                            <p className="text-[10px] font-bold text-yellow-800 uppercase tracking-widest leading-relaxed">
                                💡 Best Results: Sit in a quiet room and use headphones with a microphone for accurate voice recognition.
                            </p>
                        </div>

                        {/* Start button */}
                        <button
                            onClick={handleStart}
                            disabled={isStarting || !hasResume || uploadingResume}
                            className="w-full py-5 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-[0.25em] hover:bg-gray-900 transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_rgba(0,0,0,0.15)] disabled:opacity-40"
                        >
                            {isStarting ? (
                                <>
                                    <Activity size={20} className="animate-pulse" /> Initialising…
                                </>
                            ) : (
                                <>
                                    {!hasResume ? 'Resume Required' : (
                                        <>
                                            <Play size={20} /> Launch Interview Session
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
            <div className="min-h-screen pt-16 pb-24 px-4 md:px-8 bg-white">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Top bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                        <div className="flex items-center gap-4">
                            <SiriVisualizer isActive={isSpeaking} />
                            <div>
                                <h1 className="font-display text-2xl font-black uppercase tracking-tighter">
                                    Mock Interview
                                </h1>
                                {(companyName || jobTitle) && (
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40">
                                        {companyName}{jobTitle && ` · ${jobTitle.slice(0, 40)}`}
                                    </p>
                                )}
                            </div>
                            {isTimerActive && (
                                <div className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-display font-black text-xl tracking-widest">
                                    <Clock size={16} /> {formatTime(timeLeft)}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Status */}
                            <span className={`px-4 py-2 border-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${statusPill}`}>
                                {isSpeaking ? 'AI Speaking (Mic Paused)' : status}
                            </span>

                            {/* Mute */}
                            <button
                                onClick={() => setIsMuted((prev) => !prev)}
                                disabled={!isActive}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-30 ${
                                    isMuted
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-black border-black hover:bg-black hover:text-white'
                                }`}
                            >
                                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                                {isMuted ? 'Unmute' : 'Mute'}
                            </button>

                            {/* Stop */}
                            <button
                                onClick={() => handleStop()}
                                disabled={!isActive}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-red-500 bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-30"
                            >
                                <StopCircle size={16} /> End Session
                            </button>

                            {/* Back to entry */}
                            <button
                                onClick={() => {
                                    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
                                    setStep('entry');
                                    handleStop();
                                }}
                                className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-black bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                            >
                                <ArrowLeft size={16} /> Back
                            </button>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {errorMsg && (
                        <div className="p-4 bg-red-50 border-2 border-red-500 rounded-2xl">
                            <p className="text-red-600 font-bold text-xs uppercase tracking-widest">{errorMsg}</p>
                        </div>
                    )}

                    {/* Transcript + Response panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Participant Transcript */}
                        <div className="bg-white rounded-3xl border-2 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.04)]">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3 pb-4 border-b-2 border-black">
                                <User size={16} /> Participant
                            </h2>
                            <div
                                ref={transcriptRef}
                                className="h-80 overflow-y-auto flex flex-col gap-3 pr-2"
                                style={{ scrollbarWidth: 'thin' }}
                            >
                                {transcripts.length === 0 ? (
                                    <p className="text-xs font-bold uppercase tracking-widest text-black/20 italic">
                                        Waiting for participant input…
                                    </p>
                                ) : (
                                    transcripts.map((t, i) => (
                                        <motion.p
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-sm font-medium text-black border-b border-black/5 pb-3"
                                        >
                                            {t}
                                        </motion.p>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* AI Response */}
                        <div className="bg-white rounded-3xl border-2 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.04)]">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-3 pb-4 border-b-2 border-black">
                                <Bot size={16} /> AI Interviewer
                            </h2>
                            <div
                                ref={responseRef}
                                className="h-80 overflow-y-auto flex flex-col gap-3 pr-2"
                                style={{ scrollbarWidth: 'thin' }}
                            >
                                {responses.length === 0 && !currentResponse ? (
                                    <p className="text-xs font-bold uppercase tracking-widest text-black/20 italic">
                                        Waiting for AI response…
                                    </p>
                                ) : (
                                    responses.map((r, i) => (
                                        <motion.p
                                            key={i}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-sm font-medium text-black border-b border-black/5 pb-3"
                                        >
                                            {r}
                                        </motion.p>
                                    ))
                                )}
                                {currentResponse && (
                                    <p className="text-sm font-bold text-black mt-1">
                                        {currentResponse}
                                        <span className="animate-pulse">█</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Evaluation */}
                    {isEvaluating && (
                        <div className="bg-white rounded-3xl border-2 border-black p-10 shadow-[8px_8px_0px_rgba(0,0,0,0.04)] flex items-center justify-center gap-4">
                            <BarChart2 size={24} className="animate-pulse" />
                            <p className="font-black uppercase tracking-widest text-sm animate-pulse">
                                Analysing Transcripts… Securing Evaluation Data
                            </p>
                        </div>
                    )}
                    {evaluation && !isEvaluating && <EvalReport evaluation={evaluation} />}
                </div>
            </div>

            {/* Proctor Violation Overlay */}
            <AnimatePresence>
                {showViolationAlert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center p-8 bg-black/95 border-4 border-red-500"
                    >
                        <h2 className="text-red-500 text-5xl font-black uppercase tracking-tighter mb-6">
                            ⚠ Proctor Violation
                        </h2>
                        <p className="text-white text-lg max-w-lg mb-6 font-bold">
                            Warning: You have left the interview window. This action has been logged.
                        </p>
                        <div className="text-3xl text-white mb-8 font-black">
                            Total Violations: <span className="text-red-500">{violationCount}</span>
                        </div>
                        <button
                            onClick={() => setShowViolationAlert(false)}
                            className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-100 transition-all"
                        >
                            I Understand &amp; Will Resume
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MockInterviewPage;
