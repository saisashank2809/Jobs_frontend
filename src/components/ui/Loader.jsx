import React from 'react';
import SendingLoader from './sending-loader';
import LoadingLogo from './LoadingLogo';

/**
 * Loader - A global wrapper component that displays either the Terminal Loader or Brand Logo.
 * Supports switching between "terminal" and "logo" variants.
 */
const Loader = ({ fullScreen = false, text = "Initializing...", variant = "terminal" }) => {
    const renderContent = () => {
        if (variant === "logo") {
            return <LoadingLogo />;
        }
        return <SendingLoader text={text} className={fullScreen ? "scale-110 shadow-2xl" : "scale-90 opacity-80"} />;
    };

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white grid place-items-center z-50 animate-in fade-in duration-500">
                {renderContent()}
            </div>
        );
    }

    return (
        <div className="flex justify-center p-8">
            {renderContent()}
        </div>
    );
};

export default Loader;
