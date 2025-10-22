
import React from 'react';
import { CITIES } from '../constants';
import { View, Clinic, Tier } from '../types';
import ClinicCard from '../components/ClinicCard';
import FeaturedCarousel from '../components/FeaturedCarousel';

interface CityPageProps {
    cityName: string;
    setView: (view: View) => void;
    clinics: Clinic[];
}

const CityPage: React.FC<CityPageProps> = ({ cityName, setView, clinics }) => {
    const city = CITIES.find(c => c.name === cityName);
    const clinicsInCity = clinics.filter(c => c.city === cityName);
    
    const featuredClinicsInCity = clinicsInCity.filter(c => c.tier === Tier.GOLD);

    const mapMarkers = clinicsInCity
        .filter(clinic => clinic.latitude && clinic.longitude)
        .map(clinic => `markers=color:teal%7C${clinic.latitude},${clinic.longitude}`)
        .join('&');
        
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(cityName)}&zoom=12&size=640x350&scale=2&maptype=roadmap&${mapMarkers}&key=${process.env.API_KEY}`;


    if (!city) {
        return <div className="text-center py-20">City not found.</div>;
    }

    return (
        <div>
            {/* City Hero Section */}
            <div className="relative h-96 bg-gray-700">
                <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
                    <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg">Hair Transplants in {city.name}</h1>
                    <p className="mt-4 text-xl max-w-2xl drop-shadow-md">Your expert guide to getting a hair transplant in {city.name}, {city.country}.</p>
                </div>
            </div>

            <div className="container mx-auto py-12">
                {/* Map Section */}
                <div className="px-6">
                    <h2 className="text-3xl font-bold mb-6">Clinic Locations in {city.name}</h2>
                    <div className="bg-gray-200 rounded-xl shadow-lg overflow-hidden mb-12 border">
                         <img src={mapUrl} alt={`Map of clinics in ${city.name}`} className="w-full" />
                    </div>
                </div>
                
                {/* Featured Clinics in this City */}
                {featuredClinicsInCity.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center mb-10 px-6">Featured Clinics in {city.name}</h2>
                        <FeaturedCarousel clinics={featuredClinicsInCity} setView={setView} />
                    </div>
                )}

                {/* All Clinics Section */}
                <div className="px-6">
                    <h2 className="text-3xl font-bold text-center mb-10">All Clinics in {city.name}</h2>
                     {clinicsInCity.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {clinicsInCity.map(clinic => (
                                <ClinicCard key={clinic.id} clinic={clinic} setView={setView} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">We don't have any clinics listed in {city.name} yet. Check back soon!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CityPage;