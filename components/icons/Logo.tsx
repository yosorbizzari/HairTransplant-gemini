import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`flex items-center ${className}`}>
        <span className="text-2xl font-bold text-emerald-700">Transplantify</span>
    </div>
);

export default Logo;