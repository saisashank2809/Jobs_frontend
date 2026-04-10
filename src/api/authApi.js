import { supabase } from './client';
import api from './client';

/**
 * Sign up via the backend Admin API — bypasses Supabase email rate limits.
 * The backend creates the user, auto-confirms, stores password, and
 * returns tokens which we set on the Supabase client for session continuity.
 */
export const signUp = async (email, password, role, full_name, phone, location, skills = [], interests = "", dob = "", aspirations = [], avatar_url = "", work_preference = "Hybrid / Both") => {
    const { data } = await api.post('/auth/signup', { 
        email, password, role, full_name, phone, location, skills, interests, dob, aspirations, avatar_url, work_preference 
    });


    // Set the session on the Supabase client so AuthContext picks it up
    await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
    });

    return {
        user: { id: data.user_id, email: data.email },
        session: { access_token: data.access_token, refresh_token: data.refresh_token },
    };
};

/**
 * Sign in directly via Supabase — no rate limit issues for login.
 * (Rate limit was only on signup emails, not login.)
 */
export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw error;
    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
};

export const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
};
