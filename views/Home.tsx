
import React from 'react';
import { CITIES, TREATMENTS } from '../constants';
import { View, Clinic, User } from '../types';
import FeaturedCarousel from '../components/FeaturedCarousel';
import CheckIcon from '../components/icons/CheckIcon';

interface HomeProps {
    setView: (view: View) => void;
    clinics: Clinic[];
    currentUser: User | null;
    onToggleFavorite: (clinicId: number) => void;
    requestLogin: (redirectView: View) => void;
}

const Home: React.FC<HomeProps> = ({ setView, clinics, currentUser, onToggleFavorite, requestLogin }) => {
    // Get all gold partners and shuffle them for fairness.
    // useMemo ensures the list doesn't re-shuffle on every render, only when the clinics data changes.
    const shuffledGoldClinics = React.useMemo(() => 
        [...clinics]
            .filter(c => c.tier === 'Gold')
            .sort(() => 0.5 - Math.random()), 
        [clinics]
    );

    const handleStartJourneyClick = () => {
        if (currentUser) {
            setView({ page: 'patientDashboard' });
        } else {
            setView({ page: 'login' });
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-gray-800 text-white py-20 md:py-32">
                <div className="absolute inset-0">
                    <img src="https://picsum.photos/1600/800?random=hero" alt="background" className="w-full h-full object-cover opacity-30" />
                </div>
                <div className="relative container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">Find Your Perfect Hair Transplant Clinic</h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">Discover top-rated, verified clinics in leading destinations worldwide.</p>
                    
                    {/* Search and Filters */}
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                                <option>All Countries</option>
                                {[...new Set(CITIES.map(c => c.country))].map(country => <option key={country}>{country}</option>)}
                            </select>
                            <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500">
                                <option>All Cities</option>
                                {CITIES.map(city => <option key={city.name}>{city.name}</option>)}
                            </select>
                            <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 md:col-span-1 lg:col-span-1 focus:outline-none focus:ring-2 focus:ring-teal-500">
                                <option>Any Treatment</option>
                                {TREATMENTS.map(t => <option key={t.id}>{t.name}</option>)}
                            </select>
                            <button 
                                onClick={() => setView({ page: 'directory' })}
                                className="w-full p-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors md:col-span-3 lg:col-span-1"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Clinics Section */}
            <div className="py-16 bg-white">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-2 px-6">Featured Gold Partners</h2>
                    <p className="text-center text-gray-600 mb-10 px-6">Top-tier clinics with exceptional reviews and services.</p>
                    <FeaturedCarousel clinics={shuffledGoldClinics} setView={setView} currentUser={currentUser} onToggleFavorite={onToggleFavorite} requestLogin={requestLogin} />
                </div>
            </div>

            {/* Popular Cities Section */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-10">Explore Top Destinations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {CITIES.map(city => (
                            <div key={city.name} className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer group" onClick={() => setView({ page: 'city', params: { cityName: city.name } })}>
                                <img src={city.imageUrl} alt={city.name} className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                                    <h3 className="text-white text-xl font-bold">{city.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Patient Journey Feature Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Your Personal Hair Restoration Timeline</h2>
                            <p className="mt-4 text-lg text-gray-600">
                                The journey to your final result takes time. With the Transplantify Patient Journal, you can document every step of the way in a secure, private space.
                            </p>
                            <ul className="mt-6 space-y-3">
                                <li className="flex items-start">
                                    <CheckIcon className="w-6 h-6 text-teal-500 mr-3 flex-shrink-0 mt-1" />
                                    <span><strong>Upload Progress Photos:</strong> Visually track your growth from pre-op to 12 months and beyond.</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckIcon className="w-6 h-6 text-teal-500 mr-3 flex-shrink-0 mt-1" />
                                    <span><strong>Keep Private Notes:</strong> Jot down observations, reminders, and feelings at each milestone.</span>
                                </li>
                                 <li className="flex items-start">
                                    <CheckIcon className="w-6 h-6 text-teal-500 mr-3 flex-shrink-0 mt-1" />
                                    <span><strong>Stay Motivated:</strong> See how far you've come and stay excited for the final result.</span>
                                </li>
                            </ul>
                             <button
                                onClick={handleStartJourneyClick}
                                className="mt-8 px-8 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors text-lg shadow-md"
                            >
                                Start Your Journey for Free
                            </button>
                        </div>
                        <div className="relative h-96 w-full flex items-center justify-center">
                            {/* Mockup */}
                            <div className="bg-gray-800 rounded-2xl p-4 shadow-2xl w-full max-w-sm transform rotate-3">
                                <div className="bg-white rounded-lg p-4">
                                    <h3 className="font-bold text-center text-gray-800">My Journey</h3>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <img src="https://picsum.photos/100/100?random=j1" className="w-16 h-16 rounded-md object-cover" alt="pre-op" />
                                            <div>
                                                <p className="font-semibold">Pre-Op</p>
                                                <p className="text-xs text-gray-500">Notes added...</p>
                                            </div>
                                        </div>
                                         <div className="flex items-center gap-3">
                                            <img src="https://picsum.photos/100/100?random=j2" className="w-16 h-16 rounded-md object-cover" alt="month 3" />
                                            <div>
                                                <p className="font-semibold">3 Months</p>
                                                <p className="text-xs text-gray-500">Noticing new growth...</p>
                                            </div>
                                        </div>
                                         <div className="flex items-center gap-3 opacity-50">
                                             <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                             </div>
                                            <div>
                                                <p className="font-semibold">6 Months</p>
                                                <p className="text-xs text-gray-500">Add entry...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* For Clinics CTA Section */}
            <div className="bg-teal-700">
                <div className="container mx-auto px-6 py-20 text-center text-white">
                    <h2 className="text-4xl font-extrabold">Are You a Clinic Owner?</h2>
                    <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
                        Join our directory to reach thousands of patients actively seeking hair restoration solutions. 
                        Showcase your clinic, manage your reputation, and grow your practice.
                    </p>
                    <div className="mt-8 flex justify-center gap-4 flex-wrap">
                        <button
                            onClick={() => setView({ page: 'submitListing' })}
                            className="px-8 py-3 bg-white text-teal-800 font-bold rounded-lg hover:bg-gray-200 transition-colors text-lg shadow-md"
                        >
                            Add Your Clinic
                        </button>
                        <button
                            onClick={() => setView({ page: 'pricing' })}
                            className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-teal-800 transition-colors text-lg"
                        >
                            View Plans & Benefits
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;