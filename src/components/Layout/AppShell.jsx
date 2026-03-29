import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const AppShell = () => {
    const { role } = useAuth();
    const location = useLocation();
    const hideFooter = location.pathname.startsWith('/chat');

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
            <Navbar />

            <div className="flex flex-1 pt-16"> {/* Offset for fixed header */}
                <Sidebar />

                {/* Main Content Area - Push right IF sidebar is rendered (role exists) */}
                <main className={`flex-1 w-full ${role ? 'md:pl-64' : ''} min-w-0 transition-all duration-300 flex flex-col`}>
                    <div className="flex-1 p-6 md:p-8">
                        <Outlet />
                    </div>
                    {!hideFooter && <Footer />}
                </main>
            </div>
        </div>
    );
};

export default AppShell;

