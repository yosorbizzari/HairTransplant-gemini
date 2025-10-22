
import React, { useState } from 'react';
import { Clinic, View, ClaimRequest } from '../types';

interface ClaimListingPageProps {
    clinic: Clinic;
    setView: (view: View) => void;
    onClaimSubmit: (claim: Omit<ClaimRequest, 'id' | 'status'>) => void;
}

const ClaimListingPage: React.FC<ClaimListingPageProps> = ({ clinic, setView, onClaimSubmit }) => {
    const [submitterName, setSubmitterName] = useState('');
    const [submitterTitle, setSubmitterTitle] = useState('');
    const [submitterEmail, setSubmitterEmail] = useState('');
    const [verificationMethod, setVerificationMethod] = useState<'email' | 'document'>('email');
    const [documentProof, setDocumentProof] = useState<string | undefined>(undefined);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                setError('File size must be less than 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setDocumentProof(reader.result as string);
                setError('');
            };
            reader.onerror = () => {
                setError('Failed to read file.');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!submitterName || !submitterTitle || !submitterEmail) {
            setError('Please fill in all required fields.');
            return;
        }
        if (verificationMethod === 'document' && !documentProof) {
            setError('Please upload a verification document.');
            return;
        }
        setError('');
        onClaimSubmit({
            clinicId: clinic.id,
            clinicName: clinic.name,
            submitterName,
            submitterTitle,
            submitterEmail,
            verificationMethod,
            documentProof
        });
    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-6 max-w-2xl">
                <button
                    onClick={() => setView({ page: 'clinic', params: { id: clinic.id }})}
                    className="mb-8 text-teal-600 hover:text-teal-800 font-semibold flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Clinic Page
                </button>

                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-900">Claim Your Listing</h1>
                    <p className="mt-2 text-gray-600">Verify your ownership of <span className="font-bold">{clinic.name}</span> to manage your profile.</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Full Name</label>
                            <input type="text" id="name" value={submitterName} onChange={e => setSubmitterName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                        </div>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Your Title (e.g., Clinic Manager)</label>
                            <input type="text" id="title" value={submitterTitle} onChange={e => setSubmitterTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Work Email Address</label>
                            <input type="email" id="email" value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
                        </div>

                        <fieldset>
                            <legend className="block text-sm font-medium text-gray-700">Verification Method</legend>
                            <div className="mt-2 space-y-2">
                                <div className="flex items-center">
                                    <input id="email-verification" name="verification-method" type="radio" value="email" checked={verificationMethod === 'email'} onChange={() => setVerificationMethod('email')} className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300" />
                                    <label htmlFor="email-verification" className="ml-3 block text-sm text-gray-700">
                                        Business Email <span className="text-gray-500">(must match clinic's website domain)</span>
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input id="document-verification" name="verification-method" type="radio" value="document" checked={verificationMethod === 'document'} onChange={() => setVerificationMethod('document')} className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300" />
                                    <label htmlFor="document-verification" className="ml-3 block text-sm text-gray-700">
                                        Upload Official Document <span className="text-gray-500">(e.g., utility bill, business license)</span>
                                    </label>
                                </div>
                            </div>
                        </fieldset>

                        {verificationMethod === 'document' && (
                            <div>
                                <label htmlFor="document-upload" className="block text-sm font-medium text-gray-700">Proof of Ownership Document</label>
                                <input id="document-upload" type="file" accept="image/*,.pdf" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
                                {documentProof && <p className="text-green-600 text-sm mt-2">File selected successfully.</p>}
                            </div>
                        )}
                        
                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <div>
                            <p className="text-xs text-gray-500">By submitting this claim, you agree to our Terms of Service and confirm that you are an authorized representative of this clinic.</p>
                        </div>

                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                            Submit Claim for Review
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClaimListingPage;