
import React from 'react';
import { Clinic, View } from '../types';
import ClinicCard from './ClinicCard';

interface FeaturedCarouselProps {
    clinics: Clinic[];
    setView: (view: View) => void;
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ clinics, setView }) => {
    if (!clinics || clinics.length === 0) {
        return null;
    }

    const extendedClinics = [...clinics, ...clinics];
    const animationDuration = clinics.length * 15; // 15 seconds per clinic for a slower, more comfortable scroll speed

    return (
        <div 
            className="w-full overflow-x-hidden"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
        >
            <div
                className="flex w-max pause-on-hover animate-scroll"
                style={{ animationDuration: `${animationDuration}s` }}
            >
                {extendedClinics.map((clinic, index) => (
                    <div key={`${clinic.id}-${index}`} className="w-96 flex-shrink-0 px-4">
                        <ClinicCard clinic={clinic} setView={setView} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedCarousel;
