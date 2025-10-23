
import React, { useState, useEffect } from 'react';
import CloseIcon from './icons/CloseIcon';

interface NewsletterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubscribe: (email: string) => Promise<{ success: boolean; message?: string }>;
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose, onSubscribe }) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Reset state when modal is opened
        if (isOpen) {
            setStatus('idle');
            setMessage('');
            setEmail('');
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
            setStatus('error');
            setMessage('Please enter a valid email address.');
            return;
        }

        setStatus('loading');
        setMessage('');

        const result = await onSubscribe(email);

        if (result.success) {
            setStatus('success');
            setMessage('Thank you for subscribing! Check your inbox for a confirmation.');
        } else {
            setStatus('error');
            setMessage(result.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <CloseIcon className="w-6 h-6" />
                </button>
                
                {status === 'success' ? (
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                             <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mt-4">Subscription Successful!</h3>
                        <p className="text-gray-600 mt-2">{message}</p>
                        <button onClick={onClose} className="mt-6 w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscribe to our Newsletter</h2>
                        <p className="text-gray-600 mb-6">Get the latest news, articles, and resources, sent to your inbox weekly.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                                <input
                                    type="email"
                                    id="newsletter-email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                            </div>
                            {status === 'error' && message && <p className="text-sm text-red-600">{message}</p>}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full px-4 py-3 bg-teal-600 text-white font-bold rounded-md hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
                            >
                                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default NewsletterModal;