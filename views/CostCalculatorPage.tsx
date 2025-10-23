
import React, { useState } from 'react';
import { View } from '../types';
import Norwood1Icon from '../components/icons/Norwood_1_Icon';
import Norwood2Icon from '../components/icons/Norwood_2_Icon';
import Norwood3Icon from '../components/icons/Norwood_3_Icon';
import Norwood4Icon from '../components/icons/Norwood_4_Icon';
import Norwood5Icon from '../components/icons/Norwood_5_Icon';
import Norwood6Icon from '../components/icons/Norwood_6_Icon';
import Norwood7Icon from '../components/icons/Norwood_7_Icon';

interface CostCalculatorPageProps {
    setView: (view: View) => void;
}

const NORWOOD_STAGES = [
    { id: 1, label: 'Stage 1', icon: Norwood1Icon, grafts: [0, 0] },
    { id: 2, label: 'Stage 2', icon: Norwood2Icon, grafts: [500, 800] },
    { id: 3, label: 'Stage 3', icon: Norwood3Icon, grafts: [1000, 2000] },
    { id: 4, label: 'Stage 4', icon: Norwood4Icon, grafts: [2000, 3000] },
    { id: 5, label: 'Stage 5', icon: Norwood5Icon, grafts: [3000, 4500] },
    { id: 6, label: 'Stage 6', icon: Norwood6Icon, grafts: [4500, 6000] },
    { id: 7, label: 'Stage 7', icon: Norwood7Icon, grafts: [6000, 7500] },
];

const DENSITY_OPTIONS = [
    { id: 'standard', label: 'Standard Coverage', multiplier: 1.0 },
    { id: 'high', label: 'High Density', multiplier: 1.2 },
    { id: 'max', label: 'Maximum Density', multiplier: 1.4 },
];

const COST_PER_GRAFT = {
    'Turkey': 2,
    'Mexico': 3.5,
    'USA': 7,
};

type Results = {
    graftRange: [number, number];
    costRanges: { region: string; range: [number, number] }[];
} | null;

const CostCalculatorPage: React.FC<CostCalculatorPageProps> = ({ setView }) => {
    const [step, setStep] = useState(1);
    const [selectedStage, setSelectedStage] = useState<number | null>(null);
    const [selectedDensity, setSelectedDensity] = useState<string | null>(null);
    const [results, setResults] = useState<Results>(null);

    const handleStageSelect = (stageId: number) => {
        setSelectedStage(stageId);
        setStep(2);
    };

    const handleDensitySelect = (densityId: string) => {
        setSelectedDensity(densityId);
        setStep(3);
    };

    const calculateEstimate = () => {
        if (!selectedStage || !selectedDensity) return;

        const stageData = NORWOOD_STAGES.find(s => s.id === selectedStage);
        const densityData = DENSITY_OPTIONS.find(d => d.id === selectedDensity);
        if (!stageData || !densityData) return;

        const [minGrafts, maxGrafts] = stageData.grafts;
        const multiplier = densityData.multiplier;

        const estimatedMinGrafts = Math.round((minGrafts * multiplier) / 100) * 100;
        const estimatedMaxGrafts = Math.round((maxGrafts * multiplier) / 100) * 100;

        const costRanges = Object.entries(COST_PER_GRAFT).map(([region, cost]) => ({
            region,
            range: [estimatedMinGrafts * cost, estimatedMaxGrafts * cost] as [number, number],
        }));

        setResults({
            graftRange: [estimatedMinGrafts, estimatedMaxGrafts],
            costRanges,
        });
        setStep(4);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    }

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Hair Transplant Calculator</h1>
                    <p className="mt-4 text-lg text-gray-600">Get a free, instant estimate for your graft and cost requirements.</p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg space-y-10">
                    {/* Step 1: Norwood Scale */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Step 1: Select Your Hair Loss Stage</h2>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            {NORWOOD_STAGES.map(stage => {
                                const Icon = stage.icon;
                                const isSelected = selectedStage === stage.id;
                                return (
                                    <button 
                                        key={stage.id} 
                                        onClick={() => handleStageSelect(stage.id)}
                                        className={`p-3 border-2 rounded-lg text-center transition-all duration-200 ${isSelected ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-200 hover:border-teal-400 hover:bg-gray-50'}`}
                                    >
                                        <Icon className={`w-full h-auto mx-auto ${isSelected ? 'text-teal-600' : 'text-gray-400'}`} />
                                        <p className={`mt-2 text-sm font-semibold ${isSelected ? 'text-teal-700' : 'text-gray-600'}`}>{stage.label}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Density */}
                    {step >= 2 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Step 2: Choose Your Desired Density</h2>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {DENSITY_OPTIONS.map(density => {
                                    const isSelected = selectedDensity === density.id;
                                    return (
                                         <button 
                                            key={density.id} 
                                            onClick={() => handleDensitySelect(density.id)}
                                            className={`p-6 border-2 rounded-lg text-center transition-all duration-200 ${isSelected ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-200 hover:border-teal-400 hover:bg-gray-50'}`}
                                        >
                                            <p className={`text-lg font-semibold ${isSelected ? 'text-teal-700' : 'text-gray-800'}`}>{density.label}</p>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    
                    {/* Step 3: Calculate Button */}
                    {step === 3 && (
                         <div className="text-center">
                            <button onClick={calculateEstimate} className="px-10 py-4 bg-teal-600 text-white font-bold text-lg rounded-lg hover:bg-teal-700 transition-colors shadow-md">
                                Calculate My Estimate
                            </button>
                        </div>
                    )}

                    {/* Step 4: Results */}
                    {step === 4 && results && (
                        <div className="border-t-2 pt-8">
                            <h2 className="text-3xl font-bold text-center mb-8">Your Estimate</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="text-center bg-teal-50 p-8 rounded-lg">
                                    <p className="text-lg text-teal-800 font-semibold">Estimated Grafts Required</p>
                                    <p className="text-5xl font-extrabold text-teal-600 my-2">
                                        {results.graftRange[0]} - {results.graftRange[1]}
                                    </p>
                                    <p className="text-sm text-gray-500">Based on Norwood Stage {selectedStage} and {selectedDensity} density.</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-4">Estimated Cost by Region</h3>
                                    <div className="space-y-3">
                                        {results.costRanges.map(cost => (
                                            <div key={cost.region} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
                                                <span className="font-semibold">{cost.region}</span>
                                                <span className="font-medium">{formatCurrency(cost.range[0])} - {formatCurrency(cost.range[1])}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-8">
                                <strong>Disclaimer:</strong> This is an estimate only. Actual graft numbers and costs can vary based on your individual needs, scalp characteristics, and clinic pricing. A consultation with a qualified surgeon is required for an accurate assessment.
                            </p>
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => setView({ page: 'directory' })} 
                                    className="px-10 py-4 bg-amber-500 text-white font-bold text-lg rounded-lg hover:bg-amber-600 transition-colors shadow-md"
                                >
                                    Find Clinics For Your Procedure
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CostCalculatorPage;