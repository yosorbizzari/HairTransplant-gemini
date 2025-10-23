import React, { useState } from 'react';
import { Clinic, User, View, Tier } from '../types';
import ClinicEditor from '../components/ClinicEditor';

interface ClinicDashboardProps {
    currentUser: User;
    clinics: Clinic[];
    setView: (view: View) => void;
    onSaveClinic: (clinic: Clinic) => void;
    onCancelSubscription: (clinicId: number) => void;
    isSaving: boolean;
}

const AnalyticsCard: React.FC<{ title: string, value: string, change: string }> = ({ title, value, change }) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change} vs. last month</p>
    </div>
);

const ClinicDashboard: React.FC<ClinicDashboardProps> = ({ currentUser, clinics, setView, onSaveClinic, onCancelSubscription, isSaving }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);
    const ownedClinic = clinics.find(c => c.ownerId === currentUser.uid);

    if (!ownedClinic) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h2 className="text-2xl font-bold">Error</h2>
                <p className="text-gray-600 mt-2">No clinic is associated with your account.</p>
            </div>
        );
    }
    
    const handleSave = (clinic: Clinic) => {
        onSaveClinic(clinic);
        setIsEditing(false);
    };

    const handleCancelSub = async () => {
        if (window.confirm('Are you sure you want to cancel your subscription? Your clinic will be downgraded to the Basic tier at the end of the current period.')) {
            setIsCanceling(true);
            await onCancelSubscription(ownedClinic.id);
            setIsCanceling(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold">Your Dashboard</h1>
                        <p className="text-xl text-gray-600 mt-1">Manage your listing for <span className="font-bold text-teal-600">{ownedClinic.name}</span></p>
                    </div>
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="mt-4 md:mt-0 px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-semibold"
                        >
                            Edit Your Profile
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <ClinicEditor 
                        clinic={ownedClinic}
                        onSave={handleSave}
                        onCancel={() => setIsEditing(false)}
                        mode="owner"
                        isSaving={isSaving}
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                             {/* Analytics Section for Gold Partners */}
                            {ownedClinic.tier === Tier.GOLD && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold mb-4">Profile Analytics</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <AnalyticsCard title="Profile Views" value="1,843" change="+12.5%"/>
                                        <AnalyticsCard title="Website Clicks" value="212" change="+8.1%"/>
                                        <AnalyticsCard title="Quote Requests" value="48" change="+20.0%"/>
                                    </div>
                                </div>
                            )}

                             <div className="bg-white p-8 rounded-lg shadow-lg">
                               <h2 className="text-2xl font-bold mb-6">Current Profile Information</h2>
                               <div className="space-y-4 text-gray-700">
                                   <p><strong>Short Description:</strong> {ownedClinic.shortDescription}</p>
                                   <p><strong>Long Description:</strong> {ownedClinic.longDescription}</p>
                                   <p><strong>Contact Phone:</strong> {ownedClinic.contact.phone}</p>
                                   <p><strong>Website:</strong> {ownedClinic.contact.website}</p>
                               </div>
                               <button 
                                    onClick={() => setView({ page: 'clinic', params: { id: ownedClinic.id }})}
                                    className="mt-8 inline-block px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    View Your Public Profile
                                </button>
                            </div>
                        </div>

                        {/* Right Column (Subscription) */}
                        <div className="sticky top-28">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold mb-4">Subscription Management</h3>
                                <div className="space-y-3">
                                    <p><strong>Current Plan:</strong> <span className={`font-bold ${ownedClinic.tier === Tier.GOLD ? 'text-amber-600' : 'text-blue-600'}`}>{ownedClinic.tier}</span></p>
                                    <p><strong>Status:</strong> <span className={`font-bold ${ownedClinic.subscriptionStatus === 'active' ? 'text-green-600' : 'text-red-600'}`}>{ownedClinic.subscriptionStatus === 'active' ? 'Active' : 'Canceled'}</span></p>
                                </div>

                                {ownedClinic.subscriptionStatus === 'active' && ownedClinic.tier !== Tier.BASIC && (
                                    <div className="mt-6 space-y-3">
                                        <button 
                                            onClick={() => setView({ page: 'pricing' })}
                                            className="w-full text-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-semibold transition-colors"
                                        >
                                            Change Plan
                                        </button>
                                         <button 
                                            onClick={handleCancelSub}
                                            disabled={isCanceling}
                                            className="w-full text-center px-4 py-2 bg-transparent text-red-600 rounded-md hover:bg-red-50 font-semibold transition-colors disabled:opacity-50"
                                        >
                                            {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                                        </button>
                                    </div>
                                )}

                                {ownedClinic.tier === Tier.BASIC && (
                                    <button 
                                        onClick={() => setView({ page: 'pricing' })}
                                        className="w-full mt-6 text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition-colors"
                                    >
                                        Upgrade Your Plan
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClinicDashboard;