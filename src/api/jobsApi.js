import api from './client';

export const createJob = async (jobData) => {
    // jobData: { title, description_raw, skills_required }
    const response = await api.post('/jobs', jobData);
    return response.data;
};

export const getProviderJobs = async () => {
    const response = await api.get('/jobs/provider');
    return response.data;
};

export const getJobFeed = async (skip = 0, limit = 20) => {
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
    const response = await api.post(`/jobs/${jobId}/match`, null, { timeout: 60000 });
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
