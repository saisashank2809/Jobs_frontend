import React, { useState, createContext, useContext } from 'react';
import clsx from 'clsx';

const TabsContext = createContext();

export const Tabs = ({ children, defaultValue }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className="flex flex-col gap-6">{children}</div>
        </TabsContext.Provider>
    );
};

export const TabsList = ({ children, className }) => {
    return (
        <div
            className={clsx('border-2 p-1.5 rounded-2xl flex gap-1 shadow-[4px_4px_0px_rgba(49,56,81,0.05)]', className)}
            style={{ backgroundColor: 'var(--bg-surface-solid)', borderColor: 'var(--color-accent)' }}
        >
            {children}
        </div>
    );
};

export const TabsTrigger = ({ children, value, className }) => {
    const { activeTab, setActiveTab } = useContext(TabsContext);
    const isActive = activeTab === value;

    return (
        <button
            onClick={() => setActiveTab(value)}
            className={clsx(
                'flex-1 py-3 px-6 rounded-xl font-display font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 active:scale-[0.98]',
                isActive
                    ? 'text-white shadow-lg'
                    : 'hover:opacity-80',
                className
            )}
            style={{
                backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                color: isActive ? 'var(--color-on-primary)' : 'var(--color-accent)'
            }}
        >
            {children}
        </button>
    );
};

export const TabsContent = ({ children, value }) => {
    const { activeTab } = useContext(TabsContext);
    if (activeTab !== value) return null;
    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
        </div>
    );
};
