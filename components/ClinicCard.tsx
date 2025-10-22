

import React from 'react';
import { Clinic, Tier, View, User } from '../types';
import StarIcon from './icons/StarIcon';
import MapPinIcon from './icons/MapPinIcon';
import CheckIcon from './icons/CheckIcon';
import HeartIcon from './icons/HeartIcon';

interface ClinicCardProps {
    clinic: Clinic;
    setView: (view: View) => void;
    currentUser: User | null;
    onToggleFavorite: (clinicId: number) => void;
    requestLogin: (redirectView: View) => void;
}

const TierBadge: React.FC<{ tier: Tier }> = ({ tier }) => {
    const tierColors = {
        [Tier.GOLD]: 'bg-amber-400 text-amber-900',
        [Tier.PREMIUM]: 'bg-blue-400 text-blue-900',
        [Tier.BASIC]: 'bg-gray-300 text-gray-800',
    };
    const tierText = {
        [Tier.GOLD]: 'Gold Partner',
        [Tier.PREMIUM]: 'Premium Listing',
        [Tier.BASIC]: '',
    };
    
    if (tier === Tier.BASIC) return null;

    return (
        <span className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full ${tierColors[tier]}`}>
            {tierText[tier]}
        </span>
    );
};

const VerifiedBadge: React.FC = () => (
    <div className="absolute top-4 left-4 bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center">
        <CheckIcon className="w-4 h-4 mr-1" />
        Verified
    </div>
);


const ClinicCard: React.FC<ClinicCardProps> = ({ clinic, setView, currentUser, onToggleFavorite, requestLogin }) => {
    
    const isFavorite = currentUser?.favoriteClinics?.includes(clinic.id) ?? false;
    
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click from firing
        if (!currentUser) {
            requestLogin({ page: 'directory' });
        } else {
            onToggleFavorite(clinic.id);
        }
    };
    
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-in-out">
            <div className="relative">
                <div className="cursor-pointer" onClick={() => setView({ page: 'clinic', params: { id: clinic.id } })}>
                    <img className="w-full h-56 object-cover" src={clinic.imageUrl} alt={clinic.name} />
                </div>
                <TierBadge tier={clinic.tier} />
                {clinic.verified && <VerifiedBadge />}
                <button 
                    onClick={handleFavoriteClick}
                    className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 text-red-500 hover:bg-white transition-colors"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <HeartIcon filled={isFavorite} />
                </button>
            </div>
            <div className="p-6 cursor-pointer" onClick={() => setView({ page: 'clinic', params: { id: clinic.id } })}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{clinic.name}</h3>
                <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{clinic.city}, {clinic.country}</span>
                </div>
                <div className="flex items-center mb-4 flex-wrap">
                    <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(clinic.rating) ? 'text-amber-500' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    <span className="ml-2 text-gray-600 font-semibold">{clinic.rating.toFixed(1)}</span>
                    <span className="ml-2 text-gray-500">({clinic.reviewCount} reviews)</span>
                    {clinic.reviewSource && clinic.reviews.length === 0 && (
                        <span className="ml-2 mt-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            on {clinic.reviewSource}
                        </span>
                    )}
                </div>
                <p className="text-gray-700 mb-6">{clinic.shortDescription}</p>
                <button className="w-full py-2 px-4 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ClinicCard;