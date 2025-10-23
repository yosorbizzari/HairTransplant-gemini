
import React, { useState } from 'react';
import { PRICING_TIERS, CUSTOM_SERVICE } from '../constants';
import CheckIcon from '../components/icons/CheckIcon';
import { View, User, Tier, Clinic } from '../types';

interface PricingPageProps {
    setView: (view: View) => void;
    currentUser: User | null;
    clinics: Clinic[];
    onCancelSubscription: (clinicId: number) => Promise<void>;
}

const PricingPage: React.FC<PricingPageProps> = ({ setView, currentUser, clinics, onCancelSubscription }) => {
    const [isDowngrading, setIsDowngrading] = useState(false);
    
    const ownedClinic = currentUser?.role === 'clinic-owner' 
        ? clinics.find(c => c.ownerId === currentUser.uid) 
        : null;

    const tierHierarchy = [Tier.BASIC, Tier.PREMIUM, Tier.GOLD];

    const handleDowngrade = async () => {
        if (!ownedClinic) return;
        if (window.confirm('Are you sure you want to downgrade? This will cancel your current subscription and revert your clinic to the Basic tier.')) {
            setIsDowngrading(true);
            await onCancelSubscription(ownedClinic.id);
            setIsDowngrading(false);
        }
    };

    const getButtonState = (tierName: string) => {
        const targetTier = tierName.startsWith('Gold') ? Tier.GOLD : tierName.startsWith('Premium') ? Tier.PREMIUM : Tier.BASIC;

        if (!ownedClinic) {
            if (targetTier === Tier.BASIC) {
                return { text: 'Get Listed Free', action: () => alert("To get a Basic listing, find your clinic and click 'Claim Listing'. If you're not listed, contact our admin."), disabled: false, style: 'bg-gray-600 text-white hover:bg-gray-700' };
            }
            return { text: `Go ${targetTier}`, action: () => alert("Please log in or sign up as a clinic owner to choose a plan."), disabled: false, style: targetTier === Tier.GOLD ? 'bg-amber-400 text-amber-900 hover:bg-amber-500' : 'bg-teal-600 text-white hover:bg-teal-700' };
        }
        
        const currentTierIndex = tierHierarchy.indexOf(ownedClinic.tier);
        const targetTierIndex = tierHierarchy.indexOf(targetTier);

        if (targetTierIndex === currentTierIndex) {
            return { text: 'Current Plan', disabled: true, style: 'bg-gray-300 text-gray-500 cursor-not-allowed' };
        }
        
        if (targetTierIndex > currentTierIndex) {
            const action = () => setView({ page: 'checkout', params: { tier: targetTier } });
            return { text: 'Upgrade', action, disabled: false, style: targetTier === Tier.GOLD ? 'bg-amber-400 text-amber-900 hover:bg-amber-500' : 'bg-teal-600 text-white hover:bg-teal-700' };
        }
        
        if (targetTierIndex < currentTierIndex) {
            return { text: isDowngrading ? 'Processing...' : 'Downgrade', action: handleDowngrade, disabled: isDowngrading, style: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400' };
        }

        return { text: 'Select Plan', disabled: true, style: 'bg-gray-300' };
    };


    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Grow Your Clinic with Transplantify</h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Choose a plan that fits your needs and start connecting with patients actively seeking treatment.</p>
            </div>

            <div className="container mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {PRICING_TIERS.map((tier) => {
                    const { text, action, disabled, style } = getButtonState(tier.name);
                    return (
                        <div
                            key={tier.name}
                            className={`bg-white rounded-xl shadow-lg p-8 flex flex-col ${tier.name === 'Gold Partner' ? 'border-4 border-amber-400 relative' : 'border'}`}
                        >
                            {tier.name === 'Gold Partner' && (
                                <span className="bg-amber-400 text-amber-900 text-sm font-bold px-4 py-1 rounded-full self-center absolute -top-4">Most Popular</span>
                            )}
                            <h2 className="text-3xl font-bold text-gray-900 text-center">{tier.name}</h2>
                            <div className="text-center my-4">
                                <span className="text-5xl font-extrabold">{tier.price}</span>
                                {tier.per && <span className="text-gray-500">{tier.per}</span>}
                            </div>
                            <p className="text-gray-600 text-center h-16">{tier.description}</p>
                            
                            <div className="flex-grow my-8">
                                <ul className="space-y-4">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <CheckIcon className="w-6 h-6 text-teal-500 mr-3 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={action}
                                disabled={disabled}
                                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${style}`}
                            >
                                {text}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Custom Service Section */}
            <div className="container mx-auto px-6 mt-20">
                <div className="bg-gradient-to-r from-gray-800 to-teal-900 text-white rounded-xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between">
                    <div className="md:w-2/3">
                        <h2 className="text-3xl font-extrabold">{CUSTOM_SERVICE.title}</h2>
                        <p className="mt-4 text-gray-300 max-w-xl">{CUSTOM_SERVICE.description}</p>
                    </div>
                    <div className="mt-8 md:mt-0 md:w-1/3 text-center md:text-right">
                        <button 
                            onClick={() => setView({ page: 'aiConcierge' })}
                            className="px-8 py-4 bg-white text-teal-800 font-bold rounded-lg hover:bg-gray-200 transition-colors text-lg shadow-md"
                        >
                            {CUSTOM_SERVICE.cta}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PricingPage;
