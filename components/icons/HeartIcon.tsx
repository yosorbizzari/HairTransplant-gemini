
import React from 'react';

interface HeartIconProps {
    filled: boolean;
    className?: string;
}

const HeartIcon: React.FC<HeartIconProps> = ({ filled, className }) => {
    if (filled) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || 'w-6 h-6'}>
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 18.61 18.61 0 01-4.4-3.75c-1.6-1.8-2.55-4.14-2.55-6.675 0-3.9 3.25-7 7.25-7s7.25 3.1 7.25 7c0 2.535-.95 4.875-2.55 6.675a18.603 18.603 0 01-4.4 3.75 15.247 15.247 0 01-1.344.688l-.022.012-.007.003z" />
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    );
};

export default HeartIcon;