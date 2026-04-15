import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../api/authApi';
import { extractSkills, uploadAvatar } from '../../api/usersApi';
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
    Activity,
    Calendar,
    Target
} from 'lucide-react';
import { ROLES, DESIRED_JOB_ROLES, WORK_PREFERENCES, EXPERIENCE_LEVELS, JOB_TITLES } from '../../utils/constants';
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
    const [dob, setDob] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    
    // Questionnaire Data
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [interests, setInterests] = useState('');
    const [aspirations, setAspirations] = useState([]);
    const [workPreference, setWorkPreference] = useState(WORK_PREFERENCES.HYBRID);
    
    // Experience Data
    const [experience, setExperience] = useState('');
    const [workExperiencePosition, setWorkExperiencePosition] = useState('');
    const [customPosition, setCustomPosition] = useState('');
    const [workExperienceDescription, setWorkExperienceDescription] = useState('');
    
    // UI State
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [extracting, setExtracting] = useState(false);
    const fileInputRef = useRef(null);

    const maxSteps = role === ROLES.PROVIDER ? 2 : 5;

    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);
        if (selectedRole === ROLES.PROVIDER && step > 2) {
            setStep(2);
        }
    };

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
            if (!fullName || !phone || !location || !dob) {
                setError("Please fill in all personal details.");
                return;
            }
        }
        setError(null);
        if (step < maxSteps) {
            setStep(s => s + 1);
        }
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
            let finalAvatarUrl = "";
            
            // 1. If an avatar was selected, upload it first
            if (avatarFile) {
                setUploadingAvatar(true);
                // We don't have a userId yet, so we use a temp name or let the API handle it
                // Actually, the uploadAvatar needs a userId. 
                // Let's modify uploadAvatar to handle optional userId or use email as folder name temp.
                // Or better, upload it to a 'temp' folder and have the backend move it.
                // For simplicity here, I'll use the email as a unique identifier.
                const tempId = email.replace(/[^a-zA-Z0-9]/g, '_');
                finalAvatarUrl = await uploadAvatar(tempId, avatarFile);
                setUploadingAvatar(false);
            }

            // 2. Submit all data including the avatar URL
            await signUp(
                email, 
                password, 
                role, 
                fullName, 
                phone, 
                location, 
                skills, 
                interests, 
                dob, 
                aspirations, 
                finalAvatarUrl, 
                workPreference,
                experience,
                workExperiencePosition === 'Other' ? customPosition : workExperiencePosition,
                workExperienceDescription
            );
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
            setUploadingAvatar(false);
        }
    };

    const handleAvatarSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError("Invalid format. Please use a Static Image or GIF.");
            return;
        }

        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const stepVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            z: 0,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            z: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FBFBFB] overflow-hidden">
            <div className="w-full max-w-2xl mt-10 mb-20">
                {/* Refined Progress Indicator */}
                <div className="mb-14 flex items-center justify-center gap-6">
                    {Array.from({ length: maxSteps }, (_, i) => i + 1).map(i => (
                        <div key={i} className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-[20px] flex items-center justify-center text-[11px] font-bold transition-all duration-700 border ${
                                step >= i ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/10' : 'bg-white text-zinc-300 border-zinc-100'
                            }`}>
                                {step > i ? <Check size={18} strokeWidth={3} /> : i}
                            </div>
                            {i < maxSteps && (
                                <div className={`w-12 h-[1px] transition-all duration-1000 ${
                                    step > i ? 'bg-zinc-900' : 'bg-zinc-100'
                                }`} />
                            )}
                        </div>
                    ))}
                </div>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white rounded-[48px] border border-zinc-100 p-10 md:p-16 shadow-xl shadow-zinc-900/5"
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
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-10"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-sans font-bold text-zinc-900 tracking-tight">Your Basics</h2>
                                    <p className="text-[10px] font-bold text-zinc-400 mt-4 uppercase tracking-[0.3em]">Step 01 · Credentials</p>
                                </div>

                                {/* Role Selector */}
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-5 ml-1">Register As</label>
                                    <div className="grid grid-cols-2 gap-4 bg-zinc-50/50 border border-zinc-100 p-2 rounded-[24px]">
                                        {[ROLES.SEEKER, ROLES.PROVIDER].map(r => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => handleRoleChange(r)}
                                                className={`py-4 rounded-[18px] text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${role === r
                                                    ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/10 scale-[1.02]'
                                                    : 'text-zinc-400 hover:bg-white hover:text-zinc-900'
                                                }`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-zinc-50/50 border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-zinc-50/50 border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                            placeholder="Create Password (8+ chars)"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={18} />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-zinc-50/50 border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
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
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-10"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-sans font-bold text-zinc-900 tracking-tight">Your Profile</h2>
                                    <p className="text-[10px] font-bold text-zinc-400 mt-4 uppercase tracking-[0.3em]">Step 02 · Details</p>
                                </div>

                                {/* Avatar Upload Section */}
                                <div className="flex flex-col items-center gap-6 mb-12">
                                    <div className="relative group/avatar">
                                        <div className="w-28 h-28 rounded-full bg-zinc-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center ring-4 ring-zinc-50/50 relative">
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={32} className="text-zinc-200" />
                                            )}
                                            
                                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center gap-1">
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    onChange={handleAvatarSelect}
                                                    accept="image/*"
                                                />
                                                <Upload size={16} className="text-white" />
                                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Select</span>
                                            </label>
                                        </div>
                                        {avatarPreview && (
                                            <button 
                                                onClick={() => { setAvatarPreview(null); setAvatarFile(null); }}
                                                className="absolute -top-1 -right-1 w-6 h-6 bg-white border border-zinc-100 rounded-full flex items-center justify-center text-zinc-400 hover:text-rose-500 shadow-lg transition-colors"
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">Profile Photo</p>
                                        <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest">Supports Images & GIFs</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-zinc-50/50 border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={18} />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-zinc-50/50 border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                            placeholder="+91 Phone Number"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-zinc-50/50 border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                            placeholder="Location (City, Country)"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" size={18} />
                                        <input
                                            type="date"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-zinc-50/50 border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                            required
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
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-10"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-sans font-bold text-zinc-900 tracking-tight">Your Skills</h2>
                                    <p className="text-[10px] font-bold text-zinc-400 mt-4 uppercase tracking-[0.3em]">Step 03 · Background</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] ml-1">Skills</label>
                                        <label className="cursor-pointer group flex items-center gap-2">
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={handleFileUpload}
                                                accept=".pdf,.docx"
                                                disabled={extracting}
                                            />
                                            <div className="flex items-center gap-2 px-4 py-2 border border-zinc-100 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-all bg-zinc-50 hover:shadow-lg hover:shadow-zinc-900/10">
                                                {extracting ? <Activity size={10} className="animate-pulse" /> : <Upload size={10} />}
                                                {extracting ? 'Scanning...' : 'upload your resume to scan for skills'}
                                            </div>
                                        </label>
                                    </div>

                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={(e) => setNewSkill(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                                            className="flex-1 px-6 py-5 bg-zinc-50/50 border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-xs focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                            placeholder="Add a skill..."
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddSkill}
                                            className="w-16 bg-zinc-900 text-white rounded-[22px] flex items-center justify-center hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2 min-h-[60px]">
                                        {skills.map(s => (
                                            <motion.span 
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                key={s} 
                                                className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest"
                                            >
                                                {s}
                                                <button onClick={() => handleRemoveSkill(s)} className="text-white/40 hover:text-white transition-colors">
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            </motion.span>
                                        ))}
                                        {skills.length === 0 && (
                                            <p className="text-[10px] font-bold text-zinc-300 uppercase italic py-4 ml-1">Add your skills below...</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-1">Personal Interests</label>
                                    <textarea
                                        value={interests}
                                        onChange={(e) => setInterests(e.target.value)}
                                        className="w-full px-6 py-5 bg-zinc-50/50 border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-xs placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all h-36 resize-none"
                                        placeholder="Outline your professional trajectory and core interests..."
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                custom={1}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-10"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-sans font-bold text-zinc-900 tracking-tight">Experience</h2>
                                    <p className="text-[10px] font-bold text-zinc-400 mt-4 uppercase tracking-[0.3em]">Step 04 · Professional History</p>
                                </div>

                                <div className="space-y-8">
                                    {/* Total Experience Dropdown */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-1">Total Experience</label>
                                        <select
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className="w-full px-6 py-5 bg-zinc-50/50 border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-sm focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select Tenure</option>
                                            {EXPERIENCE_LEVELS.map(exp => (
                                                <option key={exp} value={exp}>{exp}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Work Experience Section */}
                                    <div className="p-8 bg-zinc-50/50 border border-zinc-100 rounded-[32px] space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-1">Last / Current Position</label>
                                            <select
                                                value={workExperiencePosition}
                                                onChange={(e) => setWorkExperiencePosition(e.target.value)}
                                                className="w-full px-6 py-5 bg-white border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-sm focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled>Select Role</option>
                                                {JOB_TITLES.map(title => (
                                                    <option key={title} value={title}>{title}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {workExperiencePosition === 'Other' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="relative group"
                                            >
                                                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-1">Specify Role</label>
                                                <input
                                                    type="text"
                                                    value={customPosition}
                                                    onChange={(e) => setCustomPosition(e.target.value)}
                                                    className="w-full px-6 py-5 bg-white border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-sm placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all"
                                                    placeholder="Enter your job title..."
                                                />
                                            </motion.div>
                                        )}

                                        <div>
                                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-4 ml-1">Work Description</label>
                                            <textarea
                                                value={workExperienceDescription}
                                                onChange={(e) => setWorkExperienceDescription(e.target.value)}
                                                className="w-full px-6 py-5 bg-white border border-zinc-100 rounded-[22px] text-zinc-900 font-semibold text-xs placeholder:text-zinc-300 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 transition-all h-32 resize-none"
                                                placeholder="Describe your responsibilities and achievements..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setExperience('');
                                                setWorkExperiencePosition('');
                                                setWorkExperienceDescription('');
                                                nextStep();
                                            }}
                                            className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] hover:text-zinc-900 transition-colors py-2 px-4"
                                        >
                                            Skip this step
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 5 && (
                            <motion.div
                                key="step4"
                                custom={1}
                                variants={stepVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-10"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-sans font-bold text-zinc-900 tracking-tight">Your Goals</h2>
                                    <p className="text-[10px] font-bold text-zinc-400 mt-4 uppercase tracking-[0.3em]">Step 05 · Career Targets</p>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-5 ml-1">Target Roles (MAX 5)</label>
                                    <div className="flex flex-wrap gap-3">
                                        {DESIRED_JOB_ROLES.map(roleName => {
                                            const isSelected = aspirations.includes(roleName);
                                            return (
                                                <button
                                                    key={roleName}
                                                    type="button"
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setAspirations(aspirations.filter(a => a !== roleName));
                                                        } else if (aspirations.length < 5) {
                                                            setAspirations([...aspirations, roleName]);
                                                        }
                                                    }}
                                                    className={`px-5 py-3.5 border rounded-[18px] font-bold text-[10px] uppercase tracking-widest transition-all duration-300 ${
                                                        isSelected 
                                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/10 scale-[1.02]' 
                                                        : 'bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300 hover:text-zinc-900'
                                                    } ${(aspirations.length >= 5 && !isSelected) ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                                                    disabled={aspirations.length >= 5 && !isSelected}
                                                >
                                                    {roleName}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {aspirations.length >= 5 && (
                                        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-6 ml-1 bg-rose-50/50 inline-block px-4 py-2 rounded-lg">Threshold reached.</p>
                                    )}
                                </div>

                                {/* Work Preference Selector */}
                                <div className="mt-16 p-10 bg-zinc-50/50 border border-zinc-100 rounded-[40px] relative overflow-hidden group">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Work Preference</h3>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1">How do you prefer to work?</p>
                                        </div>
                                        <div className="px-5 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                                            {workPreference}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {[
                                            { id: WORK_PREFERENCES.ONSITE, label: 'Onsite', color: 'bg-blue-500' },
                                            { id: WORK_PREFERENCES.REMOTE, label: 'Remote', color: 'bg-emerald-500' },
                                            { id: WORK_PREFERENCES.HYBRID, label: 'Hybrid / Both', color: 'bg-indigo-400' }
                                        ].map((pref) => (
                                            <button
                                                key={pref.id}
                                                type="button"
                                                onClick={() => setWorkPreference(pref.id)}
                                                className={`flex items-center gap-3 px-6 py-4 rounded-[20px] transition-all duration-500 border font-bold text-[11px] uppercase tracking-widest ${
                                                    workPreference === pref.id
                                                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-900/10'
                                                        : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300 hover:text-zinc-600'
                                                }`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${pref.color}`} />
                                                {pref.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-10 text-[10px] font-bold text-rose-500 bg-rose-50/50 border border-rose-100 p-5 rounded-[20px] uppercase tracking-widest text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-14">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex-1 border border-zinc-100 text-zinc-400 py-5 rounded-[22px] font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <ChevronLeft size={18} /> Back
                            </button>
                        )}
                        
                        {step < maxSteps ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex-[2] bg-zinc-900 text-white py-5 rounded-[22px] font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10"
                            >
                                Next Phase <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-[2] bg-zinc-900 text-white py-5 rounded-[22px] font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg shadow-zinc-900/10 disabled:opacity-30"
                            >
                                {loading ? (
                                    <>
                                        <Activity size={18} className="animate-pulse" /> Processing...
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

                <div className="flex flex-col items-center gap-4 mt-12 mb-10">
                    <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em]">
                        Existing network member?
                    </p>
                    <Link to="/login" className="text-base font-bold text-zinc-900 border-b-2 border-zinc-900 hover:pb-1 transition-all tracking-widest uppercase">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
