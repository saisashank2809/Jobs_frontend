import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { uploadResume, getMyProfile, updateProfile, extractSkills, uploadAvatar } from '../../api/usersApi';
import { supabase } from '../../api/client';
import { LIMITS, isValidText, isValidPhone, validateSkills, validateAspirations, validateFile, MAX_AVATAR_SIZE, MAX_RESUME_SIZE, ALLOWED_AVATAR_TYPES, ALLOWED_RESUME_TYPES } from '../../utils/validators';
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
    ChevronRight,
    Calendar,
    Target
} from 'lucide-react';
import { DESIRED_JOB_ROLES, WORK_PREFERENCES, EXPERIENCE_LEVELS, JOB_TITLES } from '../../utils/constants';
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
    const [dob, setDob] = useState('');
    const [skills, setSkills] = useState([]);
    const [interests, setInterests] = useState('');
    const [aspirations, setAspirations] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [newAspiration, setNewAspiration] = useState('');
    const [workPreference, setWorkPreference] = useState(WORK_PREFERENCES.HYBRID);
    const [experience, setExperience] = useState('');
    const [workExperiencePosition, setWorkExperiencePosition] = useState('');
    const [customPosition, setCustomPosition] = useState('');
    const [workExperienceDescription, setWorkExperienceDescription] = useState('');
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

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
            setDob(data.dob || '');
            setSkills(data.skills || []);
            setInterests(data.interests || '');
            setAspirations(data.aspirations || []);
            setWorkPreference(data.work_preference || WORK_PREFERENCES.HYBRID);
            setExperience(data.experience || '');
            
            const loadedPosition = data.work_experience_position || '';
            if (loadedPosition && !JOB_TITLES.includes(loadedPosition)) {
                setWorkExperiencePosition('Other');
                setCustomPosition(loadedPosition);
            } else {
                setWorkExperiencePosition(loadedPosition);
                setCustomPosition('');
            }

            setWorkExperienceDescription(data.work_experience_description || '');
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

    const handleAddAspiration = (e) => {
        if (e) e.preventDefault();
        const trimmed = newAspiration.trim();
        if (trimmed && !aspirations.includes(trimmed)) {
            if (aspirations.length < 5) {
                setAspirations([...aspirations, trimmed]);
                setNewAspiration('');
            } else {
                setError("Protocol Limit: Maximum 5 aspirations allowed.");
            }
        }
    };

    const handleScanResume = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // SECURITY: Validate file before upload
        const fileError = validateFile(file, { maxSize: MAX_RESUME_SIZE, allowedTypes: ALLOWED_RESUME_TYPES });
        if (fileError) { setError(fileError); return; }

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

        // SECURITY: Validate all fields before submission (OWASP A03)
        if (fullName && !isValidText(fullName, LIMITS.FULL_NAME_MAX)) { setError('Name is too long or contains invalid characters.'); setSaving(false); return; }
        if (phone && !isValidPhone(phone)) { setError('Invalid phone number format.'); setSaving(false); return; }
        if (location && !isValidText(location, LIMITS.LOCATION_MAX)) { setError('Location is too long.'); setSaving(false); return; }
        if (interests && !isValidText(interests, LIMITS.INTERESTS_MAX)) { setError('Interests text is too long.'); setSaving(false); return; }
        if (!validateSkills(skills)) { setError(`Too many skills (max ${LIMITS.SKILLS_MAX_COUNT}) or a skill is too long.`); setSaving(false); return; }
        if (!validateAspirations(aspirations)) { setError(`Too many aspirations (max ${LIMITS.ASPIRATIONS_MAX}) or an aspiration is too long.`); setSaving(false); return; }

        try {
            await updateProfile({
                full_name: fullName,
                phone: phone,
                location: location,
                dob: dob,
                skills: skills,
                interests: interests,
                aspirations: aspirations,
                work_preference: workPreference,
                experience: experience,
                work_experience_position: workExperiencePosition === 'Other' ? customPosition : workExperiencePosition,
                work_experience_description: workExperienceDescription
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

        // SECURITY: Validate file before upload
        const fileError = validateFile(file, { maxSize: MAX_RESUME_SIZE, allowedTypes: ALLOWED_RESUME_TYPES });
        if (fileError) { setError(fileError); return; }

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

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // SECURITY: Validate file type, size, and extension (OWASP A04)
        const fileError = validateFile(file, { maxSize: MAX_AVATAR_SIZE, allowedTypes: ALLOWED_AVATAR_TYPES });
        if (fileError) {
            setError(fileError);
            return;
        }

        setUploadingAvatar(true);
        setError(null);
        setMessage("Uploading identity payload...");

        try {
            // 1. Upload to Supabase Storage
            const publicUrl = await uploadAvatar(user.id, file);

            // 2. Update Profile in DB (if backend eventually supports it)
            await updateProfile({ avatar_url: publicUrl });

            // 3. Update Supabase Auth user_metadata since backend drops avatar_url
            const { error: authError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });
            
            if (authError) {
                console.warn('Failed to update Supabase Auth metadata', authError);
            }

            setMessage("Identity visualized. Refreshing profile...");
            await fetchProfile();
        } catch (err) {
            console.error('Avatar Sync Error:', err);
            setError(`Avatar sync failed: ${err.message || 'Unknown error'}`);
            // Error is already shown via the setError() state above
        } finally {
            setUploadingAvatar(false);
        }
    };

    if (loading) return <Loader fullScreen variant="logo" />;

    return (
        <div className="max-w-6xl mx-auto py-20 px-6 min-h-screen">
            <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div>
                        <h1 className="text-6xl font-bold text-black tracking-tight leading-none">Identity</h1>
                        <p className="text-[10px] font-black text-zinc-400 mt-4 uppercase tracking-[0.4em] flex items-center gap-3">
                            <div className="w-10 h-[1px] bg-zinc-200" /> Your Professional Dashboard
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => editMode ? handleSave() : setEditMode(true)}
                        disabled={saving}
                        className={`px-8 py-4 rounded-full font-bold text-xs transition-all flex items-center gap-3 shadow-xl shadow-zinc-900/10 ${editMode
                                ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                                : 'bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50'
                            }`}
                    >
                        {saving ? <RefreshCw size={16} className="animate-spin" /> : (editMode ? <Save size={16} /> : <Edit2 size={16} />)}
                        {editMode ? 'Save Changes' : 'Edit Profile'}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-1 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-zinc-100 rounded-[40px] p-10 shadow-xl shadow-zinc-900/5 relative overflow-hidden"
                    >
                        <div className="relative group/avatar mb-12">
                            <div className="w-32 h-32 rounded-full bg-black overflow-hidden shadow-2xl shadow-black/20 ring-8 ring-zinc-50 border-4 border-white relative">
                                {profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                                    <img
                                        src={profile?.avatar_url || user?.user_metadata?.avatar_url}
                                        alt={profile?.full_name || 'User Avatar'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full grid place-items-center text-5xl font-bold text-white">
                                        {user?.email?.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {/* Overlay for Edit Mode */}
                                {editMode && (
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center gap-2">
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                            accept="image/*"
                                            disabled={uploadingAvatar}
                                        />
                                        {uploadingAvatar ? (
                                            <RefreshCw size={24} className="text-white animate-spin" />
                                        ) : (
                                            <>
                                                <Upload size={24} className="text-white" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest text-center px-4">Change Visual</span>
                                            </>
                                        )}
                                    </label>
                                )}
                            </div>

                            {uploadingAvatar && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full shadow-lg">
                                    Syncing...
                                </div>
                            )}
                        </div>

                        <div className="space-y-10">
                            <div>
                                <label className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em] block mb-3 ml-1">Full Name</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        maxLength={LIMITS.FULL_NAME_MAX}
                                        className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-5 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-black/5 transition-all outline-none"
                                        placeholder="Full Name"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-bold text-black tracking-tight break-words">{profile?.full_name || 'Anonymous User'}</h2>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em] block mb-3 ml-1">Current Location</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            maxLength={LIMITS.LOCATION_MAX}
                                            className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-5 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-black/5 transition-all outline-none"
                                            placeholder="City, Country"
                                        />
                                    ) : (
                                        <p className="font-bold flex items-center gap-3 text-zinc-600 text-sm">
                                            <MapPin size={16} className="text-zinc-200" /> {profile?.location || 'Not Specified'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em] block mb-3 ml-1">Date of Birth</label>
                                    {editMode ? (
                                        <input
                                            type="date"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-5 font-bold text-sm text-zinc-900 focus:bg-white focus:ring-4 focus:ring-black/5 transition-all outline-none"
                                        />
                                    ) : (
                                        <p className="font-bold flex items-center gap-3 text-zinc-600 text-sm">
                                            <Calendar size={16} className="text-zinc-200" /> {profile?.dob ? new Date(profile.dob).toLocaleDateString() : 'Not set'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Stats - Low Contrast Tiles */}
                    <div className="space-y-4">
                        <div className="p-10 bg-black text-white rounded-[48px] shadow-2xl shadow-black/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform duration-1000 group-hover:scale-150" />
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-4">Email Address</p>
                            <p className="text-sm font-bold break-all">{user?.email}</p>
                        </div>
                        <div className="p-10 bg-white border border-zinc-50 rounded-[48px] shadow-sm">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-4">Secure Contact</p>
                            {editMode ? (
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    maxLength={LIMITS.PHONE_MAX}
                                    className="w-full bg-transparent border-0 border-b border-zinc-100 focus:border-black focus:ring-0 p-0 font-bold text-zinc-900 placeholder:text-zinc-200"
                                    placeholder="+1 (555) 000-0000"
                                />
                            ) : (
                                <p className="text-xl font-bold text-black">{profile?.phone || 'No Phone Linked'}</p>
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

                    {/* Skills Selection */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-zinc-100 rounded-[40px] p-10 shadow-sm"
                    >
                        <header className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-bold text-black tracking-tight">Skills</h3>
                                <p className="text-[10px] font-black text-zinc-300 mt-2 uppercase tracking-[0.4em]">Refine your skills</p>
                            </div>
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleScanResume}
                                    accept=".pdf,.docx"
                                    disabled={extracting}
                                />
                                <div className={`flex items-center gap-3 px-6 py-3 bg-zinc-50 border-none rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-black hover:text-white transition-all shadow-sm ${extracting ? 'bg-black text-white' : ''}`}>
                                    {extracting ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                    {extracting ? 'Scanning...' : 'upload your resume to scan for skills'}
                                </div>
                            </label>
                        </header>

                        {editMode && (
                            <div className="flex gap-3 mb-10">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                    maxLength={LIMITS.SKILL_MAX}
                                    className="flex-1 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 font-semibold text-sm focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none"
                                    placeholder="Add a new competency (e.g. React, Docker)"
                                />
                                <button
                                    onClick={handleAddSkill}
                                    className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/10 hover:bg-zinc-800 transition-all active:scale-95"
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2.5">
                            {skills.length > 0 ? (
                                skills.map(skill => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-full text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                                    >
                                        {skill}
                                        {editMode && (
                                            <button onClick={() => handleRemoveSkill(skill)} className="text-zinc-300 hover:text-rose-500 transition-colors">
                                                <X size={14} />
                                            </button>
                                        )}
                                    </span>
                                ))
                            ) : (
                                <div className="w-full py-8 border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center bg-zinc-50/50">
                                    <p className="text-xs font-medium text-zinc-400">No competency data detected.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                    
                    {/* Work Preference Selector */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white border border-zinc-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden group"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-bold text-zinc-900 tracking-tight">Work Preference</h3>
                                <p className="text-[10px] font-black text-zinc-300 mt-2 uppercase tracking-[0.4em]">How do you prefer to work?</p>
                            </div>
                            <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                workPreference === WORK_PREFERENCES.REMOTE ? 'bg-emerald-50 text-emerald-600' :
                                workPreference === WORK_PREFERENCES.ONSITE ? 'bg-blue-50 text-blue-600' :
                                'bg-indigo-50 text-indigo-600'
                            }`}>
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
                                    disabled={!editMode}
                                    onClick={() => setWorkPreference(pref.id)}
                                    className={`flex items-center gap-3 px-6 py-4 rounded-[20px] transition-all duration-500 border font-bold text-[11px] uppercase tracking-widest ${
                                        workPreference === pref.id
                                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl shadow-zinc-900/10'
                                            : 'bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300'
                                    } ${!editMode ? 'cursor-default opacity-80' : 'hover:text-zinc-900'}`}
                                >
                                    <div className={`w-2.5 h-2.5 rounded-full ${pref.color}`} />
                                    {pref.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Professional Experience Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18 }}
                        className="bg-white border border-zinc-100 rounded-[40px] p-10 shadow-sm"
                    >
                        <header className="flex items-center justify-between mb-12">
                            <div>
                                <h3 className="text-2xl font-bold text-black tracking-tight">Professional History</h3>
                                <p className="text-[10px] font-black text-zinc-300 mt-2 uppercase tracking-[0.4em]">Your past and current experience</p>
                            </div>
                        </header>

                        <div className="space-y-10">
                            <div>
                                <label className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em] block mb-4 ml-1">Total Tenure</label>
                                {editMode ? (
                                    <select
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-5 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-black/5 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Tenure</option>
                                        {EXPERIENCE_LEVELS.map(exp => (
                                            <option key={exp} value={exp}>{exp}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white">
                                            <Activity size={18} />
                                        </div>
                                        <p className="text-xl font-bold text-black">{experience || 'Not Specified'}</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-zinc-50/50 rounded-[32px] border border-zinc-100 space-y-8">
                                <div>
                                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em] block mb-4 ml-1">Last / Current Position</label>
                                    {editMode ? (
                                        <select
                                            value={workExperiencePosition}
                                            onChange={(e) => setWorkExperiencePosition(e.target.value)}
                                            className="w-full bg-white border border-zinc-100 rounded-2xl px-6 py-5 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select Role</option>
                                            {JOB_TITLES.map(title => (
                                                <option key={title} value={title}>{title}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <p className="text-base font-bold text-zinc-600">{profile?.work_experience_position || 'No Position Logged'}</p>
                                    )}
                                </div>

                                {editMode && workExperiencePosition === 'Other' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        <label className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em] block ml-1">Specify Your Role</label>
                                        <input
                                            type="text"
                                            value={customPosition}
                                            onChange={(e) => setCustomPosition(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-5 font-bold text-sm focus:bg-white focus:ring-4 focus:ring-black/5 transition-all outline-none"
                                            placeholder="Enter your specific job title..."
                                        />
                                    </motion.div>
                                )}

                                <div>
                                    <label className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.4em] block mb-4 ml-1">Experience Description</label>
                                    {editMode ? (
                                        <textarea
                                            value={workExperienceDescription}
                                            onChange={(e) => setWorkExperienceDescription(e.target.value)}
                                            className="w-full bg-white border border-zinc-100 rounded-2xl px-6 py-5 font-semibold text-xs focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none min-h-[120px] resize-none"
                                            placeholder="Outline your impact and achievements..."
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-zinc-500 leading-relaxed italic">
                                            {workExperienceDescription || 'Briefly describe your experience here...'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Trajectory / Ambitions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border border-zinc-100 rounded-[40px] p-10 shadow-sm"
                    >
                        <h3 className="text-2xl font-bold text-black tracking-tight mb-2">Career Goals</h3>
                        <p className="text-[10px] font-black text-zinc-300 mb-12 uppercase tracking-[0.4em]">Define your ideal professional journey</p>

                        {editMode ? (
                            <textarea
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-[32px] p-8 font-semibold text-sm focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none min-h-[180px] resize-none"
                                placeholder="Where do you see your career heading?"
                            />
                        ) : (
                            <div className="bg-zinc-50/30 rounded-[32px] p-10 border border-dashed border-zinc-200">
                                {interests ? (
                                    <p className="text-slate-600 text-base leading-relaxed font-medium">{interests}</p>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-4">
                                        <p className="text-xs font-medium text-zinc-300">Null Trajectory Defined.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Aspirations Questionnaire */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white border border-zinc-100 rounded-[40px] p-10 shadow-sm"
                    >
                        <h3 className="text-2xl font-bold text-black tracking-tight mb-2">Future Roles</h3>
                        <p className="text-[10px] font-black text-zinc-300 mb-12 uppercase tracking-[0.4em]">Select the roles you are aiming for</p>

                        {editMode ? (
                            <div className="space-y-10">
                                {/* Custom Job Role Input */}
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newAspiration}
                                        onChange={(e) => setNewAspiration(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddAspiration()}
                                        className="flex-1 bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 font-semibold text-sm focus:bg-white focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none"
                                        placeholder="Type custom role (e.g. Lead Quant, Prompt Engineer)"
                                    />
                                    <button
                                        onClick={handleAddAspiration}
                                        disabled={aspirations.length >= 5}
                                        className="w-14 h-14 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/10 hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2.5">
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
                                                className={`px-5 py-3 border rounded-full text-[11px] font-bold transition-all ${isSelected
                                                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg shadow-zinc-900/10'
                                                        : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-200'
                                                    } ${(aspirations.length >= 5 && !isSelected) ? 'opacity-20 cursor-not-allowed' : ''}`}
                                                disabled={aspirations.length >= 5 && !isSelected}
                                            >
                                                {roleName}
                                            </button>
                                        );
                                    })}

                                    {/* Handle Custom Aspirations that are NOT in the predefined list */}
                                    {aspirations.filter(a => !DESIRED_JOB_ROLES.includes(a)).map(customRole => (
                                        <button
                                            key={customRole}
                                            type="button"
                                            onClick={() => setAspirations(aspirations.filter(a => a !== customRole))}
                                            className="px-5 py-3 bg-zinc-900 border-zinc-900 text-white rounded-full text-[11px] font-bold shadow-lg shadow-zinc-900/10 flex items-center gap-2 group"
                                        >
                                            {customRole}
                                            <X size={14} className="opacity-50 group-hover:opacity-100" />
                                        </button>
                                    ))}
                                </div>

                                {aspirations.length >= 5 && (
                                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-6 bg-rose-50 px-4 py-2 rounded-full inline-block">Security Protocol: Capacity Reached (5/5)</p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2.5">
                                {aspirations.length > 0 ? (
                                    aspirations.map(aspiration => (
                                        <span
                                            key={aspiration}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white rounded-full text-xs font-bold shadow-lg shadow-zinc-900/10"
                                        >
                                            <Target size={14} className="opacity-50" />
                                            {aspiration}
                                        </span>
                                    ))
                                ) : (
                                    <div className="w-full py-6 border border-dashed border-zinc-200 rounded-2xl flex items-center justify-center bg-zinc-50/50">
                                        <p className="text-xs font-medium text-zinc-300">No Aspirations Selected.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Data Payload (Resume) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-12 overflow-hidden relative"
                    >
                        {/* Subtle background decoration */}
                        <div className="absolute -right-10 -bottom-10 opacity-[0.03]">
                            <FileText size={320} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold tracking-tight mb-10 flex items-center gap-3">
                                <FileText size={24} className="text-zinc-500" /> Your Resume
                            </h3>

                            <div className="flex flex-col md:flex-row items-center gap-10">
                                <div className={`w-28 h-28 rounded-full flex items-center justify-center border-4 transition-all duration-700 ${profile?.resume_text ? 'bg-emerald-50 border-white shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'bg-zinc-50 border-white'}`}>
                                    <CheckCircle size={40} className={profile?.resume_text ? "text-emerald-500" : "text-zinc-200"} />
                                </div>
                                <div className="text-center md:text-left flex-1">
                                    <p className="font-bold text-2xl text-black tracking-tight mb-3">
                                        {profile?.resume_text ? "Resume Uploaded" : "No Resume Found"}
                                    </p>
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-relaxed max-w-sm">
                                        {profile?.resume_text
                                            ? `Last sync: ${new Date(profile.created_at).toLocaleDateString()}. Your data is used for job matching.`
                                            : "Upload your resume to start matching with relevant jobs."}
                                    </p>
                                </div>
                                <label className="cursor-pointer bg-black text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 group shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 breathing-pulse">
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleResumeUpload}
                                        accept=".pdf,.docx"
                                    />
                                    <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
                                    Update Resume
                                </label>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom Save Button - Exclusive to Edit Mode */}
                    <AnimatePresence>
                        {editMode && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="mt-12 flex justify-center pb-20"
                            >
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full md:w-auto px-16 py-6 bg-zinc-900 text-white rounded-[32px] font-bold text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-zinc-900/20 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                                    {saving ? 'Synchronizing...' : 'Save Profile Changes'}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
