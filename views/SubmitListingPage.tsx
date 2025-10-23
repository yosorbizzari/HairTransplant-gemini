
import React, { useState } from 'react';
import { View, ListingSubmission, User } from '../types';
import { CITIES } from '../constants';

interface SubmitListingPageProps {
    setView: (view: View) => void;
    onSubmit: (submission: Omit<ListingSubmission, 'id' | 'status'>) => void;
    currentUser: User | null;
    requestLogin: (redirectView: View) => void;
}

const SubmitListingPage: React.FC<SubmitListingPageProps> = ({ setView, onSubmit, currentUser, requestLogin }) => {
    const [formData, setFormData] = useState({
        clinicName: '',
        clinicCity: '',
        clinicAddress: '',
        clinicPhone: '',
        clinicWebsite: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            setError('You must be logged in to submit a clinic.');
            return;
        }
        // Simple validation
        for (const key in formData) {
            if (!formData[key as keyof typeof formData]) {
                setError('Please fill out all fields.');
                return;
            }
        }
        setError('');
        onSubmit({
            ...formData,
            submitterName: currentUser.name,
            submitterId: currentUser.uid,
        });
    };

    if (!currentUser) {
        return (
            <div className="bg-gray-50 py-20">
                <div className="container mx-auto px-6 max-w-lg text-center">
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h1 className="text-3xl font-extrabold text-gray-900">Login Required</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Please log in or create an account to submit a new clinic to our directory.
                        </p>
                        <button 
                            onClick={() => requestLogin({ page: 'submitListing' })}
                            className="mt-8 w-full py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors"
                        >
                            Login / Sign Up
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-6 max-w-3xl">
                <button
                    onClick={() => setView({ page: 'directory' })}
                    className="mb-8 text-teal-600 hover:text-teal-800 font-semibold flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Directory
                </button>

                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-900">Submit a Clinic</h1>
                    <p className="mt-2 text-gray-600">Help us grow our directory by adding a new clinic. Our team will review your submission before it goes live.</p>
                    <p className="mt-2 text-sm text-gray-500">You are submitting as: <span className="font-semibold">{currentUser.name}</span></p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="border-b pb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Clinic Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700">Clinic Name</label>
                                    <input type="text" name="clinicName" id="clinicName" value={formData.clinicName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="clinicCity" className="block text-sm font-medium text-gray-700">City</label>
                                        <select name="clinicCity" id="clinicCity" value={formData.clinicCity} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required>
                                            <option value="" disabled>Select a city</option>
                                            {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700">Street Address</label>
                                        <input type="text" name="clinicAddress" id="clinicAddress" value={formData.clinicAddress} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                                    </div>
                                </div>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="clinicPhone" className="block text-sm font-medium text-gray-700">Public Phone Number</label>
                                        <input type="tel" name="clinicPhone" id="clinicPhone" value={formData.clinicPhone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                                    </div>
                                    <div>
                                        <label htmlFor="clinicWebsite" className="block text-sm font-medium text-gray-700">Website (e.g., domain.com)</label>
                                        <input type="text" name="clinicWebsite" id="clinicWebsite" value={formData.clinicWebsite} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                            Submit for Review
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubmitListingPage;