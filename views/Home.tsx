
import React from 'react';
import { CITIES, TREATMENTS } from '../constants';
import { View, Clinic, User } from '../types';
import FeaturedCarousel from '../components/FeaturedCarousel';

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
