
import React, { useState } from 'react';
import { CITIES, TREATMENTS } from '../constants';
import { View, Clinic } from '../types';
import ClinicCard from '../components/ClinicCard';

interface DirectoryProps {
    setView: (view: View) => void;
    clinics: Clinic[];
    initialFilters?: {
        searchTerm?: string;
        city?: string;
        treatment?: string;
    };
}

const Directory: React.FC<DirectoryProps> = ({ setView, clinics, initialFilters = {} }) => {
    const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
    const [city, setCity] = useState(initialFilters.city || 'All Cities');
    const [treatment, setTreatment] = useState(initialFilters.treatment || 'Any Treatment');

    const filteredClinics = clinics.filter(clinic => {
        const matchesSearch = clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) || clinic.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCity = city === 'All Cities' || clinic.city === city;
        const matchesTreatment = treatment === 'Any Treatment' || clinic.treatments.includes(TREATMENTS.find(t => t.name === treatment)?.id ?? -1);
        return matchesSearch && matchesCity && matchesTreatment;
    });

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold text-center mb-4">Find a Clinic</h1>
                <p className="text-center text-gray-600 mb-8">Search our directory of verified hair transplant clinics.</p>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 sticky top-20 z-40">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Search by clinic name..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <select
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option>All Cities</option>
                            {CITIES.map(c => <option key={c.name}>{c.name}</option>)}
                        </select>
                        <select
                            value={treatment}
                            onChange={e => setTreatment(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option>Any Treatment</option>
                            {TREATMENTS.map(t => <option key={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Clinic List */}
                {filteredClinics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredClinics.map(clinic => (
                            <ClinicCard key={clinic.id} clinic={clinic} setView={setView} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-gray-700">No Clinics Found</h2>
                        <p className="text-gray-500 mt-2">Try adjusting your search filters to find more results.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Directory;
