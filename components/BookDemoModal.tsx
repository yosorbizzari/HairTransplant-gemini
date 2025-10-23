
import React, { useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';
import CheckIcon from './icons/CheckIcon';

interface BookDemoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ name: '', clinicName: '', website: '', email: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setMessage('');
            setFormData({ name: '', clinicName: '', website: '', email: '' });
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStatus('success');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <CloseIcon className="w-6 h-6" />
                </button>
                
                {status === 'success' ? (
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <CheckIcon className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-4">Demo Booked!</h3>
                        <p className="text-gray-600 mt-2">Thank you! Please check your email for a calendar invitation and next steps.</p>
                        <button onClick={onClose} className="mt-6 w-full px-4 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-semibold">
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Schedule Your Live Demo</h2>
                        <p className="text-gray-600 mb-6">Fill out the form below and our team will be in touch to confirm your personalized demo.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                             <div>
                                <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700">Clinic Name</label>
                                <input type="text" name="clinicName" id="clinicName" value={formData.clinicName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                             <div>
                                <label htmlFor="website" className="block text-sm font-medium text-gray-700">Clinic Website URL</label>
                                <input type="url" name="website" id="website" value={formData.website} onChange={handleChange} required placeholder="https://example.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full mt-2 px-4 py-3 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
                            >
                                {status === 'loading' ? 'Scheduling...' : 'Schedule Demo'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookDemoModal;
