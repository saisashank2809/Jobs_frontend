import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppShell = () => {
    const { role } = useAuth();

    return (
        <div className="h-screen overflow-hidden flex bg-zinc-50/50 relative">
            <Sidebar />

            <div className="header-and-content flex-1 h-screen overflow-hidden flex flex-col">
                <Navbar />

                {/* Main Content Area - Locked Viewport Layout */}
                <main className="flex-1 w-full min-w-0 h-full overflow-y-auto custom-scrollbar">
                    <div className="p-4 md:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppShell;
