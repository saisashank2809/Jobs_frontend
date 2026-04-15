export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

// WebSocket URL: replace http -> ws, https -> wss
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

export const ROLES = {
    SEEKER: 'seeker',
    PROVIDER: 'provider',
    ADMIN: 'admin',
};

export const DESIRED_JOB_ROLES = [
    "Software Engineer",
    "Product Manager",
    "Data Scientist",
    "UX/UI Designer",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "Machine Learning Engineer",
    "Marketing Specialist",
    "Sales Executive",
    "Business Analyst",
    "Graphic Designer"
];

export const WORK_PREFERENCES = {
    ONSITE: 'Onsite',
    REMOTE: 'Remote',
    HYBRID: 'Hybrid / Both'
};

export const EXPERIENCE_LEVELS = [
    "Fresher",
    "0-1 Year",
    "1-3 Years",
    "3-5 Years",
    "5-10 Years",
    "10+ Years"
];

export const JOB_TITLES = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Product Manager",
    "Data Scientist",
    "UX/UI Designer",
    "DevOps Engineer",
    "QA Engineer",
    "Project Manager",
    "Marketing Specialist",
    "Other"
];

