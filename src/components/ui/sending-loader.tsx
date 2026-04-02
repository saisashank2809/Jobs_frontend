import React from 'react';
import { cn } from "@/utils/cn";

interface TerminalLoaderProps {
  text?: string;
  className?: string;
}

/**
 * SendingLoader - A terminal-style status loader.
 * Features a typing effect and a blinking cursor.
 */
export const SendingLoader: React.FC<TerminalLoaderProps> = ({ 
  text = "Loading...", 
  className = "" 
}) => {
  return (
    <div className={cn(
      "relative bg-gray-900 border border-gray-600 font-mono text-base p-6 pt-10 w-64 shadow-2xl rounded-lg border-opacity-80 overflow-hidden",
      className
    )}>
      {/* Terminal Header */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800 border-b border-gray-700 px-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          Status
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-green-500 font-bold">$</span>
        <div className="relative inline-block">
          <div className="text-green-400 inline-block whitespace-nowrap overflow-hidden animate-terminal-type border-r-2 border-green-400 pr-1">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendingLoader;
