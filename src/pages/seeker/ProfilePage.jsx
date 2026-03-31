import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { uploadResume, getMyProfile, updateProfile, extractSkills } from '../../api/usersApi';
import Loader from '../../components/ui/Loader';
import { 
    Upload, 
    FileText, 
    CheckCircle, 
    AlertCircle, 
    RefreshCw, 
    Activity, 
    Sparkles, 
    Plus, 
    X, 
    Save, 
    Edit2,
    MapPin,
    Phone,
    User,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [extracting, setExtracting] = useState(false);
    
    // Editable State
    const [editMode, setEditMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [skills, setSkills] = useState([]);
    const [interests, setInterests] = useState('');
    const [newSkill, setNewSkill] = useState('');

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getMyProfile();
            setProfile(data);
            
            // Sync local editable state
            setFullName(data.full_name || '');
            setPhone(data.phone || '');
            setLocation(data.location || '');
            setSkills(data.skills || []);
            setInterests(data.interests || '');
        } catch (err) {
            console.error(err);
            setError("Failed to fetch profile details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

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

    const handleScanResume = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setExtracting(true);
        setError(null);
        try {
            const data = await extractSkills(file);
            if (data.skills && data.skills.length > 0) {
                const merged = [...new Set([...skills, ...data.skills])];
                setSkills(merged);
                setMessage(`AI Scan Complete: ${data.skills.length} skills identified.`);
            }
        } catch (err) {
            setError("AI Skill Extraction failed. Manual input required.");
        } finally {
            setExtracting(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setMessage(null);

        try {
            await updateProfile({
                full_name: fullName,
                phone: phone,
                location: location,
                skills: skills,
                interests: interests
            });
            setMessage("Profile updated successfully.");
            setEditMode(false);
            fetchProfile(); // Refresh underlying profile data
        } catch (err) {
            setError(err.response?.data?.detail || "Update failed. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSaving(true);
        setMessage(null);
        setError(null);

        try {
            const res = await uploadResume(file);
            setMessage(`Protocol Success: ${res.characters_extracted} units extracted.`);
            await fetchProfile();
        } catch (err) {
            setError(err.response?.data?.detail || 'Resume injection failed.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="max-w-4xl mx-auto py-16 px-6 bg-white overflow-hidden">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-black pb-10">
                <div>
                    <h1 className="text-5xl font-display font-black text-black uppercase tracking-tighter">Profile Stream</h1>
                    <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                        <Activity size={12} /> Personal Intelligence Dashboard
                    </p>
                </div>
                <button
                    onClick={() => editMode ? handleSave() : setEditMode(true)}
                    disabled={saving}
                    className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-xl ${
                        editMode 
                        ? 'bg-black text-white hover:bg-gray-800' 
                        : 'bg-white border-4 border-black text-black hover:bg-gray-50'
                    }`}
                >
                    {saving ? <RefreshCw size={16} className="animate-spin" /> : (editMode ? <Save size={16} /> : <Edit2 size={16} />)}
                    {editMode ? 'Publish Changes' : 'Initialize Edit'}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-1 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border-4 border-black rounded-[40px] p-8 shadow-[12px_12px_0px_#000] relative overflow-hidden"
                    >
                        <div className="w-24 h-24 rounded-[30px] bg-black grid place-items-center text-4xl font-black text-white shadow-2xl mb-8">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[9px] font-black text-black/30 uppercase tracking-widest block mb-1 ml-1">Identity</label>
                                {editMode ? (
                                    <input 
                                        type="text" 
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-black rounded-xl px-4 py-3 font-bold text-sm"
                                        placeholder="Full Name"
                                    />
                                ) : (
                                    <h2 className="text-xl font-black text-black uppercase tracking-tight break-words">{profile?.full_name || 'ANONYMOUS_USER'}</h2>
                                )}
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-black/30 uppercase tracking-widest block mb-1 ml-1">Location</label>
                                {editMode ? (
                                    <input 
                                        type="text" 
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-black rounded-xl px-4 py-3 font-bold text-sm"
                                        placeholder="City, Country"
                                    />
                                ) : (
                                    <p className="font-bold flex items-center gap-2 text-sm">
                                        <MapPin size={14} className="text-black/30" /> {profile?.location || 'UNDEFINED'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-black/30 uppercase tracking-widest block mb-1 ml-1">Pulse</label>
                                <p className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-green-500">
                                    <Activity size={14} /> Active Network
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <div className="space-y-4">
                        <div className="p-6 bg-black text-white rounded-[30px] shadow-lg">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Email Hash</p>
                            <p className="text-xs font-bold break-all">{user?.email}</p>
                        </div>
                        <div className="p-6 bg-white border-2 border-black rounded-[30px] shadow-[6px_6px_0px_#000]">
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1">Phone Link</p>
                            {editMode ? (
                                <input 
                                    type="tel" 
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-transparent border-0 border-b-2 border-black focus:ring-0 p-0 font-bold"
                                />
                            ) : (
                                <p className="text-sm font-black">{profile?.phone || 'UNREGISTERED'}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Questionnaire (Skills & Interests) */}
                <div className="lg:col-span-2 space-y-10">
                    <AnimatePresence mode="wait">
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-black text-white p-5 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest shadow-2xl border-2 border-white"
                            >
                                <CheckCircle size={18} /> {message}
                            </motion.div>
                        )}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white text-black p-5 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest shadow-2xl border-4 border-black"
                            >
                                <AlertCircle size={18} /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Skills Questionnaire */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border-4 border-black rounded-[40px] p-10 shadow-[16px_16px_0px_rgba(0,0,0,0.05)]"
                    >
                        <header className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-black uppercase tracking-tighter">Skill Matrix</h3>
                                <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mt-1">Tech Stack & Competencies</p>
                            </div>
                            <label className="cursor-pointer">
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleScanResume}
                                    accept=".pdf,.docx"
                                    disabled={extracting}
                                />
                                <div className={`flex items-center gap-2 px-4 py-2 border-2 border-black rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black hover:text-white transition-all ${extracting ? 'bg-black text-white' : 'bg-gray-50'}`}>
                                    {extracting ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                    {extracting ? 'Synthesizing...' : 'AI Scan Skills'}
                                </div>
                            </label>
                        </header>

                        {editMode && (
                            <div className="flex gap-4 mb-8">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                    className="flex-1 bg-gray-50 border-2 border-black rounded-2xl px-6 py-4 font-bold text-sm focus:ring-8 focus:ring-black/5 transition-all"
                                    placeholder="Add skill (e.g. React, Python)"
                                />
                                <button
                                    onClick={handleAddSkill}
                                    className="w-16 bg-black text-white rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg"
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3">
                            {skills.length > 0 ? (
                                skills.map(skill => (
                                    <span 
                                        key={skill} 
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all group"
                                    >
                                        {skill}
                                        {editMode && (
                                            <button onClick={() => handleRemoveSkill(skill)} className="text-black/20 group-hover:text-white/50 hover:text-white transition-colors">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </span>
                                ))
                            ) : (
                                <p className="text-[10px] italic font-bold text-black/20 uppercase py-4">No skill units detected. Initialize via AI Scan or Manual Input.</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Interests / Questionnaire */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border-4 border-black rounded-[40px] p-10 shadow-[16px_16px_0px_rgba(0,0,0,0.05)]"
                    >
                        <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-1">Target Trajectory</h3>
                        <p className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] mb-8">Professional Interests & Ambitions</p>
                        
                        {editMode ? (
                            <textarea
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                className="w-full bg-gray-50 border-4 border-black rounded-3xl p-8 font-bold text-sm focus:ring-8 focus:ring-black/5 transition-all min-h-[200px] resize-none"
                                placeholder="Describe your ideal roles, industries, and professional targets..."
                            />
                        ) : (
                            <div className="bg-gray-50/50 rounded-3xl p-8 border-2 border-black border-dashed">
                                {interests ? (
                                    <p className="text-sm font-bold leading-relaxed text-black/80">{interests}</p>
                                ) : (
                                    <p className="text-[10px] italic font-bold text-black/20 uppercase text-center py-6">No trajectory defined. Enter edit mode to update.</p>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Resume / Payload (Existing Feature) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-black text-white rounded-[40px] p-10 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5">
                            <FileText size={160} />
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                                <FileText size={24} /> Data Payload
                            </h3>
                            
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                                    <CheckCircle size={32} className={profile?.resume_text ? "text-green-400" : "text-white/20"} />
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <p className="font-black text-lg uppercase tracking-tight mb-1">
                                        {profile?.resume_text ? "Resume Synchronized" : "Buffer Empty"}
                                    </p>
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                                        {profile?.resume_text ? `Last Updated: ${new Date(profile.created_at).toLocaleDateString()}` : "Upload a resume to enable AI tailored matches"}
                                    </p>
                                </div>
                                <label className="cursor-pointer bg-white text-black px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-all flex items-center gap-2 group shadow-xl">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleResumeUpload}
                                        accept=".pdf,.docx"
                                    />
                                    <Upload size={16} className="group-hover:-translate-y-1 transition-transform" /> 
                                    Update Payload
                                </label>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
