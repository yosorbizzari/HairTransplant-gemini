import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`flex items-center ${className}`}>
        {/* New, custom-designed abstract logo for Transplantify */}
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-700">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 7V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8.5 7H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="17" r="1.5" fill="currentColor"/>
        </svg>
        <span className="ml-2 text-2xl font-bold text-emerald-700">Transplantify</span>
    </div>
);

export default Logo;