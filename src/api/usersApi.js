import api, { supabase } from './client';

export const getMyProfile = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.patch('/users/me', data);
    return response.data;
};

export const uploadAvatar = async (userId, file) => {
    // 1. Define file path: avatars/userId/timestamp_name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    // const filePath = `avatars/${fileName}`; // Not strictly needed

    // 2. Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    // 3. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    return publicUrl;
};

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/users/resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const reuploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.put('/users/resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getResumeDownloadUrl = async () => {
    const response = await api.get('/users/me/resume');
    return response.data;
};

export const extractSkills = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/users/extract-skills', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
