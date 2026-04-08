import api, { supabase } from './client';

export const createJob = async (jobData) => {
    // jobData: { title, description_raw, skills_required }
    const response = await api.post('/jobs', jobData);
    return response.data;
};

export const getProviderJobs = async () => {
    const response = await api.get('/jobs/provider');
    return response.data;
};

export const getJobFeed = async (skip = 0, limit = 500) => {
    const response = await api.get('/jobs/feed', {
        params: { skip, limit },
    });
    return response.data;
};

export const getJobDetails = async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/details`);
    return response.data;
};

export const getJobMatchScore = async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/match`, { timeout: 60000 });
    return response.data;
};

export const tailorResume = async (jobId) => {
    // Tailoring can take a long time via AI, give it 60s
    const response = await api.post(`/resume-builder/${jobId}/tailor`, null, { timeout: 60000 });
    return response.data;
};

export const downloadTailoredResume = async (jobTitle, tailoredResume) => {
    const response = await api.post('/resume-builder/download', {
        job_title: jobTitle,
        tailored_resume: tailoredResume
    }, {
        responseType: 'blob'
    });
    return response.data;
};

export const matchAllJobs = async () => {
    const response = await api.post('/jobs/match', {}, { timeout: 60000 });
    return response.data;
};

// --- Saved Jobs (Supabase Persistent) ---

export const getSavedJobs = async () => {
    const { data: saved, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .order('created_at', { ascending: false });

    if (error) throw error;
    if (!saved || saved.length === 0) return [];

    // Fetch details for each saved job from the backend
    // Note: This could be optimized if the backend supports batch fetching
    const detailPromises = saved.map(s => getJobDetails(s.job_id).catch(() => null));
    const details = await Promise.all(detailPromises);
    
    return details.filter(d => d !== null);
};

export const saveJob = async (jobId) => {
    const { error } = await supabase
        .from('saved_jobs')
        .insert([{ job_id: jobId }]);
    
    if (error && error.code !== '23505') throw error; // Ignore if already saved
    return true;
};

export const unsaveJob = async (jobId) => {
    const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_id', jobId);
    
    if (error) throw error;
    return true;
};

export const isJobSaved = async (jobId) => {
    const { data, error } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('job_id', jobId)
        .maybeSingle();
    
    if (error) return false;
    return !!data;
};
