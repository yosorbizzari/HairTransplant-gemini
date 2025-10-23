
import React, { useState } from 'react';
import { View } from '../types';
import CheckIcon from '../components/icons/CheckIcon';

interface AiConciergeCheckoutPageProps {
    setView: (view: View) => void;
}

const AiConciergeCheckoutPage: React.FC<AiConciergeCheckoutPageProps> = ({ setView }) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const selectedPlan = {
        name: '24/7 AI Receptionist',
        price: '$499',
        per: '/mo',
        features: [
            'Up to 500 patient conversations',
            'Trained on your clinic\'s data',
            'Daily lead summary emails',
            'Full setup & integration'
        ]
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
    };

    if (status === 'success') {
        return (
            <div className="bg-gray-50 py-20">
                <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                         <CheckIcon className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Subscription Activated!</h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Thank you for purchasing the <span className="font-bold">{selectedPlan.name}</span>.
                    </p>
                    <p className="mt-2 text-gray-600">Our team will be in touch within 24 hours to begin the onboarding and integration process.</p>
                    <button 
                        onClick={() => setView({ page: 'home' })}
                        className="mt-8 w-full py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                 <button
                    onClick={() => setView({ page: 'aiConcierge' })}
                    className="mb-8 text-teal-600 hover:text-teal-800 font-semibold flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to AI Concierge Page
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-xl shadow-lg">
                    {/* Order Summary */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                        <div className="bg-gray-100 p-6 rounded-lg border">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
                                <p className="text-lg font-bold">{selectedPlan.price}{selectedPlan.per}</p>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {selectedPlan.features.map(f => (
                                    <li key={f} className="flex items-start">
                                        <CheckIcon className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t mt-6 pt-4 flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span>{selectedPlan.price}{selectedPlan.per}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                                <input type="text" placeholder="John Doe" disabled className="mt-1 block w-full bg-gray-100 p-3 border border-gray-300 rounded-md cursor-not-allowed"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                 <input type="text" placeholder="**** **** **** 1234" disabled className="mt-1 block w-full bg-gray-100 p-3 border border-gray-300 rounded-md cursor-not-allowed"/>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                    <input type="text" placeholder="MM / YY" disabled className="mt-1 block w-full bg-gray-100 p-3 border border-gray-300 rounded-md cursor-not-allowed"/>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">CVC</label>
                                    <input type="text" placeholder="123" disabled className="mt-1 block w-full bg-gray-100 p-3 border border-gray-300 rounded-md cursor-not-allowed"/>
                                </div>
                            </div>
                             <p className="text-xs text-gray-500 pt-4">This is a simulation. No real payment will be processed. Clicking confirm will simulate the subscription purchase.</p>
                             <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full mt-4 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400"
                            >
                                {status === 'loading' ? 'Processing...' : `Confirm Purchase for ${selectedPlan.price}`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiConciergeCheckoutPage;
