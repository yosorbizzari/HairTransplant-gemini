
import React from 'react';

interface IconProps extends React.SVGAttributes<SVGSVGElement> {
    className?: string;
}

const Norwood1Icon: React.FC<IconProps> = ({ className, ...props }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M50 8C30 8 18 30 18 50C18 70 30 92 50 92C70 92 82 70 82 50C82 30 70 8 50 8Z" stroke="currentColor" strokeWidth="4"/>
        <path d="M30 40C30 35 35 30 40 30C50 30 60 30 70 30C75 30 80 35 80 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
        <path d="M40 50C40 55 45 60 50 60C55 60 60 55 60 50C60 45 55 40 50 40C45 40 40 45 40 50Z" stroke="currentColor" strokeWidth="4"/>
        <line x1="35" y1="70" x2="65" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
);

export default Norwood1Icon;