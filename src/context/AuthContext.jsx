import { createContext, useState, useEffect, useRef, useMemo, useContext } from 'react';
import { supabase } from '../api/client';
import { getMyProfile } from '../api/usersApi';

export const AuthContext = createContext();

/**
 * AuthProvider — wraps the app to provide auth state.
 *
 * Performance optimization:
 *   - Context value is memoized with useMemo to prevent unnecessary
 *     re-renders of every consumer when unrelated state changes.
 *   - Only session/user/role/loading changes trigger re-renders.
 *
 * Architectural note:
 *   - High-frequency UI state (e.g., chat typing indicators, real-time
 *     presence) should NEVER be placed in this context. Those belong
 *     in a separate ChatContext/PresenceContext scoped to the chat
 *     subtree, avoiding full AppShell re-renders on every keystroke.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const initialised = useRef(false);

    useEffect(() => {
        // 1. Check active session first, then register the listener
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                setUser(session.user);
                fetchProfile();
            } else {
                setLoading(false);
            }
            initialised.current = true;
        }).catch(err => {
            console.error("Auth session check failed:", err);
            setLoading(false);
            initialised.current = true;
        });

        // 2. Listen for auth changes (login/logout after initial load)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            // Skip the initial event — already handled by getSession above
            if (!initialised.current) return;

            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile();
            } else {
                // User logged out — clear chat sessions from localStorage
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('ottobon_chat_session_')) {
                        localStorage.removeItem(key);
                    }
                });
                setRole(null);
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (retries = 3) => {
        try {
            const data = await getMyProfile();
            setProfile(data);
            setRole(data.role);
        } catch (error) {
            const status = error?.response?.status;

            // Retry on 503 (server overloaded) or 404 (user row not yet created by trigger)
            if (retries > 0 && (status === 503 || status === 404)) {
                const delay = status === 404 ? 1500 : 1000;
                console.warn(`fetchProfile: ${status} error, retrying in ${delay}ms (${retries} retries left)`);
                await new Promise(r => setTimeout(r, delay));
                return fetchProfile(retries - 1);
            }

            console.error('Failed to fetch user profile:', error);

            // Fallback: Supabase metadata
            try {
                const { data } = await supabase.auth.getUser();
                const metaRole = data?.user?.user_metadata?.role;
                if (metaRole) {
                    setRole(metaRole);
                    setProfile({ role: metaRole });
                }
            } catch (fallbackErr) {
                console.error('Fallback profile fetch also failed:', fallbackErr);
            }
        } finally {
            setLoading(false);
        }
    };

    // ── Memoized context value ────────────────────────────────
    // Without useMemo, every state setter call creates a new `value`
    // object reference → every useAuth() consumer re-renders, even
    // if the values they depend on haven't changed.
    //
    // With useMemo, the object reference stays stable unless one of
    // the dependency values actually changes.
    const value = useMemo(() => ({
        session,
        user,
        profile,
        role,
        loading,
        isAuthenticated: !!session?.user,
    }), [session, user, profile, role, loading]);

    return (
        <AuthContext.Provider value={value}>
            {loading && (
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '100vh', fontSize: '1.2rem', color: '#86868b'
                }}>
                    Loading...
                </div>
            )}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
