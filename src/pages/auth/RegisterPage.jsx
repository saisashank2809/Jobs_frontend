import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../api/authApi';
import { extractSkills } from '../../api/usersApi';
import { 
    Briefcase, 
    User, 
    Mail, 
    Lock, 
    Phone, 
    MapPin, 
    Sparkles, 
    Check, 
    ChevronRight, 
    ChevronLeft,
    Plus,
    X,
    Upload,
    Activity
} from 'lucide-react';
import { ROLES } from '../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    
    // Auth Data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState(ROLES.SEEKER);
    
    // Profile Data
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    
    // Questionnaire Data
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [interests, setInterests] = useState('');
    
    // UI State
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const fileInputRef = useRef(null);

    const handleAddSkill = (e) => {
        if (e) e.preventDefault();
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setExtracting(true);
        setError(null);
        try {
            const data = await extractSkills(file);
            if (data.skills && data.skills.length > 0) {
                // Merge new skills, avoiding duplicates
                const merged = [...new Set([...skills, ...data.skills])];
                setSkills(merged);
            }
        } catch (err) {
            setError("Failed to extract skills. Please enter them manually.");
        } finally {
            setExtracting(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!email || !password || !confirmPassword) {
                setError("Please fill in all auth details.");
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
        }
        if (step === 2) {
            if (!fullName || !phone || !location) {
                setError("Please fill in all personal details.");
                return;
            }
        }
        setError(null);
        setStep(s => s + 1);
    };

    const prevStep = () => {
        setError(null);
        setStep(s => s - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signUp(email, password, role, fullName, phone, location, skills, interests);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const stepVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            z: 0,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            z: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white overflow-hidden">
            <div className="w-full max-w-2xl">
                {/* Progress Indicator */}
                <div className="mb-12 flex items-center justify-center gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-[10px] transition-all duration-500 border-2 ${
                                step >= i ? 'bg-black text-white border-black' : 'bg-white text-black/20 border-black/10'
                            }`}>
                                {step > i ? <Check size={16} strokeWidth={3} /> : i}
                            </div>
                            {i < 3 && (
                                <div className={`w-12 h-[2px] rounded-full transition-all duration-1000 ${
                                    step > i ? 'bg-black' : 'bg-black/5'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white rounded-[40px] border-4 border-black p-10 md:p-14 shadow-[24px_24px_0px_#000]"
                >
                    <AnimatePresence mode="wait" custom={step}>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                custom={1}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-10">
                                    <h2 className="font-display text-4xl font-black uppercase tracking-tighter">Your Identity</h2>
                                    <p className="text-[10px] font-black text-black/40 mt-3 uppercase tracking-[0.4em]">Step 01 · Basic Credentials</p>
                                </div>

                                {/* Role Selector */}
                                <div>
                                    <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">I am a</label>
                                    <div className="grid grid-cols-2 gap-3 bg-gray-50 border-2 border-black p-2 rounded-2xl">
                                        {[ROLES.SEEKER, ROLES.PROVIDER].map(r => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setRole(r)}
                                                className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${role === r
                                                    ? 'bg-black text-white shadow-xl'
                                                    : 'text-black hover:bg-black/5'
                                                }`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-black rounded-2xl text-black font-bold text-sm placeholder:text-gray-300 focus:ring-8 focus:ring-black/5 transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-black rounded-2xl text-black font-bold text-sm placeholder:text-gray-300 focus:ring-8 focus:ring-black/5 transition-all"
                                            placeholder="Create Password (8+ chars)"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-black rounded-2xl text-black font-bold text-sm placeholder:text-gray-300 focus:ring-8 focus:ring-black/5 transition-all"
                                            placeholder="Confirm Password"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                custom={1}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-10">
                                    <h2 className="font-display text-4xl font-black uppercase tracking-tighter">Profile Details</h2>
                                    <p className="text-[10px] font-black text-black/40 mt-3 uppercase tracking-[0.4em]">Step 02 · Personal Contacts</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-black rounded-2xl text-black font-bold text-sm placeholder:text-gray-300 focus:ring-8 focus:ring-black/5 transition-all"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-black rounded-2xl text-black font-bold text-sm placeholder:text-gray-300 focus:ring-8 focus:ring-black/5 transition-all"
                                            placeholder="+91 Phone Number"
                                        />
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-white border-2 border-black rounded-2xl text-black font-bold text-sm placeholder:text-gray-300 focus:ring-8 focus:ring-black/5 transition-all"
                                            placeholder="Location (City, Country)"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                custom={1}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="text-center mb-10">
                                    <h2 className="font-display text-4xl font-black uppercase tracking-tighter">Your Talents</h2>
                                    <p className="text-[10px] font-black text-black/40 mt-3 uppercase tracking-[0.4em]">Step 03 · Questionnaire</p>
                                </div>

                                {/* Skills Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1">Skills</label>
                                        <label className="cursor-pointer group flex items-center gap-2">
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={handleFileUpload}
                                                accept=".pdf,.docx"
                                                disabled={extracting}
                                            />
                                            <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black hover:text-white transition-all bg-gray-50">
                                                {extracting ? <Activity size={10} className="animate-pulse" /> : <Upload size={10} />}
                                                {extracting ? 'Extracting...' : 'Scan Resume'}
                                            </div>
                                        </label>
                                    </div>

                                    {/* Skills Input */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                                            className="flex-1 px-6 py-4 bg-white border-2 border-black rounded-2xl text-black font-bold text-xs focus:ring-8 focus:ring-black/5 transition-all"
                                            placeholder="Type a skill..."
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddSkill}
                                            className="px-5 bg-black text-white rounded-2xl hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    {/* Skills Display */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {skills.map(s => (
                                            <span key={s} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-black">
                                                {s}
                                                <button onClick={() => handleRemoveSkill(s)} className="text-white/50 hover:text-white">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                        {skills.length === 0 && (
                                            <p className="text-[10px] font-bold text-gray-300 uppercase italic py-2 ml-1">No skills added yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Interests Section */}
                                <div>
                                    <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">Interests & Goals</label>
                                    <textarea
                                        value={interests}
                                        onChange={(e) => setInterests(e.target.value)}
                                        className="w-full px-6 py-4 bg-white border-2 border-black rounded-2xl text-black font-bold text-xs placeholder:text-gray-300 focus:ring-8 focus:ring-black/5 transition-all h-32 resize-none"
                                        placeholder="What kind of roles are you looking for? What industries interest you?"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 text-[10px] font-black text-white bg-black p-4 rounded-xl shadow-lg uppercase tracking-widest text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-12">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex-1 border-4 border-black text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <ChevronLeft size={18} /> Back
                            </button>
                        )}
                        
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex-[2] bg-black text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-2xl"
                            >
                                Continue <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-[2] bg-black text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-30"
                            >
                                {loading ? (
                                    <>
                                        <Activity size={18} className="animate-pulse" /> Finalising...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={18} /> Create Account
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </motion.div>

                <div className="flex flex-col items-center gap-4 mt-12">
                    <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em]">
                        Already part of the network?
                    </p>
                    <Link to="/login" className="text-[10px] font-black text-black uppercase tracking-widest border-b-2 border-black hover:pb-1 transition-all">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
