
import React, { useState, useMemo } from 'react';
import { Clinic, User, View, Review, ListingSubmission, JournalEntry } from '../types';
import ClinicCard from '../components/ClinicCard';
import StarIcon from '../components/icons/StarIcon';
import PatientJourney from '../components/PatientJourney';

interface PatientDashboardProps {
    currentUser: User;
    clinics: Clinic[];
    pendingReviews: Review[];
    pendingSubmissions: ListingSubmission[];
    setView: (view: View) => void;
    onToggleFavorite: (clinicId: number) => void;
    requestLogin: (redirectView: View) => void;
    onSaveJournalEntry: (milestone: string, entryData: Omit<JournalEntry, 'date'>) => void;
    isSaving: boolean;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ currentUser, clinics, pendingReviews, pendingSubmissions, setView, onToggleFavorite, requestLogin, onSaveJournalEntry, isSaving }) => {
    const [activeTab, setActiveTab] = useState('journey');

    const savedClinics = useMemo(() => {
        return clinics.filter(clinic => currentUser.favoriteClinics?.includes(clinic.id));
    }, [clinics, currentUser.favoriteClinics]);

    const userReviews = useMemo(() => {
        const allReviews = clinics.flatMap(c => c.reviews);
        const combined = [...pendingReviews, ...allReviews];
        return combined.filter(review => review.userId === currentUser.uid);
    }, [clinics, pendingReviews, currentUser.uid]);

    const userSubmissions = useMemo(() => {
        return pendingSubmissions.filter(sub => sub.submitterId === currentUser.uid);
    }, [pendingSubmissions, currentUser.uid]);


    const renderContent = () => {
        switch (activeTab) {
            case 'journey':
                return (
                    <PatientJourney 
                        currentUser={currentUser}
                        onSaveJournalEntry={onSaveJournalEntry}
                        isSaving={isSaving}
                    />
                );
            case 'saved':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">My Saved Clinics</h2>
                        {savedClinics.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {savedClinics.map(clinic => (
                                    <ClinicCard 
                                        key={clinic.id} 
                                        clinic={clinic} 
                                        setView={setView}
                                        currentUser={currentUser}
                                        onToggleFavorite={onToggleFavorite}
                                        requestLogin={requestLogin}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700">You haven't saved any clinics yet.</h3>
                                <p className="text-gray-500 mt-2">Click the heart icon on any clinic to add it to your list.</p>
                                <button
                                    onClick={() => setView({ page: 'directory' })}
                                    className="mt-6 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                                >
                                    Browse Clinics
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'reviews':
                 return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
                        {userReviews.length > 0 ? (
                            <div className="space-y-6">
                                {userReviews.map(review => {
                                    const clinic = clinics.find(c => c.id === review.clinicId);
                                    return (
                                        <div key={review.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-teal-500">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm text-gray-500">Review for:</p>
                                                    <h3 className="text-xl font-bold text-gray-800">{clinic?.name || 'Unknown Clinic'}</h3>
                                                </div>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                    review.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="flex items-center my-3">
                                                <div className="flex text-amber-500">
                                                    {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-500' : 'text-gray-300'}`} />)}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 italic">"{review.comment}"</p>
                                            <p className="text-right text-sm text-gray-500 mt-2">{review.date}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                             <div className="text-center py-16 bg-white rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700">You haven't written any reviews yet.</h3>
                                <p className="text-gray-500 mt-2">Share your experience to help others in the community.</p>
                                <button
                                    onClick={() => setView({ page: 'directory' })}
                                    className="mt-6 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                                >
                                    Find a Clinic to Review
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'submissions':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">My Submissions</h2>
                        {userSubmissions.length > 0 ? (
                            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {userSubmissions.map(sub => (
                                            <tr key={sub.id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium">{sub.clinicName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{sub.clinicCity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                     <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">
                                                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-gray-700">You haven't submitted any clinics yet.</h3>
                                <p className="text-gray-500 mt-2">Help our directory grow by adding clinics you know.</p>
                                <button
                                    onClick={() => setView({ page: 'submitListing' })}
                                    className="mt-6 px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
                                >
                                    Submit a New Clinic
                                </button>
                            </div>
                        )}
                    </div>
                );
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold mb-2">My Dashboard</h1>
                <p className="text-lg text-gray-600 mb-8">Welcome back, {currentUser.name.split(' ')[0]}!</p>
                <div className="flex flex-wrap gap-2 border-b mb-8 pb-2">
                    <button
                        onClick={() => setActiveTab('journey')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'journey' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        My Journey
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'saved' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        My Saved Clinics
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'reviews' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        My Reviews
                    </button>
                     <button
                        onClick={() => setActiveTab('submissions')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            activeTab === 'submissions' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        My Submissions
                    </button>
                </div>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default PatientDashboard;