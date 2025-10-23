
import React, { useState } from 'react';
import { View } from '../types';
import EnvelopeIcon from '../components/icons/EnvelopeIcon';
import PhoneIcon from '../components/icons/PhoneIcon';
import MapPinIcon from '../components/icons/MapPinIcon';

interface ContactPageProps {
    setView: (view: View) => void;
    onContactSubmit: (formData: { name: string; email: string; subject: string; message: string; }) => Promise<{ success: boolean; message: string; }>;
}

const ContactPage: React.FC<ContactPageProps> = ({ setView, onContactSubmit }) => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setResponseMessage('');

        const result = await onContactSubmit(formData);
        
        setResponseMessage(result.message);
        if (result.success) {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form on success
        } else {
            setStatus('error');
        }
    };

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-6 py-20">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Get In Touch</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Have a question or feedback? We'd love to hear from you. Reach out and we'll get back to you as soon as possible.</p>
                </div>

                <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-xl shadow-lg">
                    {/* Contact Form */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                             <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"></textarea>
                            </div>

                            {responseMessage && (
                                <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{responseMessage}</p>
                            )}
                            
                            <button type="submit" disabled={status === 'loading'} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400">
                                {status === 'loading' ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-teal-50 p-8 rounded-lg border border-teal-200">
                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                         <div className="space-y-6 text-gray-700">
                             <div className="flex items-start">
                                <MapPinIcon className="w-6 h-6 mr-4 mt-1 text-teal-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Our Office</h3>
                                    <p>123 Innovation Drive<br/>Tech City, CA 94105, USA</p>
                                </div>
                             </div>
                             <div className="flex items-start">
                                <EnvelopeIcon className="w-6 h-6 mr-4 mt-1 text-teal-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">General Inquiries</h3>
                                    <a href="mailto:contact@transplantify.com" className="hover:text-teal-700 hover:underline">contact@transplantify.com</a>
                                </div>
                             </div>
                             <div className="flex items-start">
                                <PhoneIcon className="w-6 h-6 mr-4 mt-1 text-teal-600 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Call Us</h3>
                                    <a href="tel:+1234567890" className="hover:text-teal-700 hover:underline">+1 (234) 567-890</a>
                                </div>
                             </div>
                         </div>
                         <div className="mt-8 border-t pt-6">
                            <h3 className="font-semibold mb-2">Business Hours</h3>
                            <p className="text-gray-600">Monday - Friday: 9am - 5pm PST</p>
                            <p className="text-gray-600">Saturday - Sunday: Closed</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;