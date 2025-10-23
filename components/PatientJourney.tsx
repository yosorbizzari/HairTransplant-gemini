
import React, { useState } from 'react';
import { User, JournalEntry } from '../types';
import ImageInput from './ImageInput';

interface PatientJourneyProps {
    currentUser: User;
    onSaveJournalEntry: (milestone: string, entryData: Omit<JournalEntry, 'date'>) => void;
    isSaving: boolean;
}

const MILESTONES = [
    { key: 'preOp', label: 'Pre-Op' },
    { key: 'month1', label: '1 Month' },
    { key: 'month3', label: '3 Months' },
    { key: 'month6', label: '6 Months' },
    { key: 'month9', label: '9 Months' },
    { key: 'month12', label: '12 Months' },
];

const PatientJourney: React.FC<PatientJourneyProps> = ({ currentUser, onSaveJournalEntry, isSaving }) => {
    const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<JournalEntry, 'date'>>({ notes: '', imageUrl: '' });

    const journeyData = currentUser.journey || {};

    const handleEditClick = (milestoneKey: string) => {
        const existingEntry = journeyData[milestoneKey];
        setFormData({
            notes: existingEntry?.notes || '',
            imageUrl: existingEntry?.imageUrl || '',
        });
        setEditingMilestone(milestoneKey);
    };

    const handleCancel = () => {
        setEditingMilestone(null);
        setFormData({ notes: '', imageUrl: '' });
    };

    const handleSave = async (milestoneKey: string) => {
        if (!formData.imageUrl) {
            alert('Please upload an image.');
            return;
        }
        await onSaveJournalEntry(milestoneKey, formData);
        handleCancel();
    };

    const renderMilestoneCard = (milestone: { key: string; label: string }) => {
        const { key, label } = milestone;
        const entry = journeyData[key];

        if (editingMilestone === key) {
            return (
                <div className="bg-white p-6 rounded-lg shadow-lg border border-teal-500">
                    <h3 className="text-xl font-bold mb-4">{label} - Editing Entry</h3>
                    <div className="space-y-4">
                        <ImageInput
                            label="Upload Photo"
                            currentImageUrl={formData.imageUrl}
                            onImageUrlChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="How are you feeling? Any observations?"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                            <button 
                                onClick={() => handleSave(key)} 
                                disabled={isSaving}
                                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400"
                            >
                                {isSaving ? 'Saving...' : 'Save Progress'}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (entry) {
            return (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold">{label}</h3>
                            <p className="text-sm text-gray-500">Logged on: {entry.date}</p>
                        </div>
                        <button onClick={() => handleEditClick(key)} className="text-sm text-teal-600 hover:underline font-semibold">Edit</button>
                    </div>
                    <img src={entry.imageUrl} alt={`${label} progress`} className="mt-4 rounded-lg w-full h-64 object-cover bg-gray-100" />
                    <p className="mt-4 text-gray-700 whitespace-pre-wrap">{entry.notes || 'No notes for this entry.'}</p>
                </div>
            );
        }

        return (
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-dashed flex flex-col items-center justify-center text-center h-full min-h-[200px]">
                <h3 className="text-xl font-bold text-gray-500">{label}</h3>
                <p className="text-gray-400 mt-2">No entry yet.</p>
                <button 
                    onClick={() => handleEditClick(key)}
                    className="mt-4 px-4 py-2 bg-teal-100 text-teal-800 font-semibold rounded-lg hover:bg-teal-200 transition-colors"
                >
                    Add Entry
                </button>
            </div>
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-1">My Progress Journal</h2>
            <p className="text-gray-600 mb-6">Track your hair restoration journey from start to finish. All entries are private.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {MILESTONES.map(renderMilestoneCard)}
            </div>
        </div>
    );
};

export default PatientJourney;
