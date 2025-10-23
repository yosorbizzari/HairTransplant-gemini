
import React from 'react';
import { View } from '../types';

interface FooterProps {
    onOpenNewsletterModal: () => void;
    setView: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenNewsletterModal, setView }) => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="sm:col-span-2 md:col-span-1">
                        <h3 className="text-lg font-bold mb-4">Transplantify</h3>
                        <p className="text-gray-400">Your trusted guide to hair restoration clinics worldwide.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">For Patients</h3>
                        <ul>
                            <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'directory' }); }} className="hover:text-teal-400 transition-colors">Find a Clinic</a></li>
                            <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'products' }); }} className="hover:text-teal-400 transition-colors">Product Reviews</a></li>
                            <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'blog' }); }} className="hover:text-teal-400 transition-colors">Read our Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">For Clinics</h3>
                        <ul>
                            <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'pricing' }); }} className="hover:text-teal-400 transition-colors">Pricing & Plans</a></li>
                            <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'submitListing' }); }} className="hover:text-teal-400 transition-colors">Submit Your Clinic</a></li>
                            <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'login' }); }} className="hover:text-teal-400 transition-colors">Clinic Login</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
                        <p className="text-gray-400 mb-4">Sign up for our newsletter for the latest updates and offers.</p>
                        <button 
                            onClick={onOpenNewsletterModal}
                            className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                        >
                            Subscribe to Newsletter
                        </button>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Transplantify. All rights reserved.</p>
                     <div className="mt-4 text-sm flex justify-center gap-6 flex-wrap">
                        <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'about' }); }} className="hover:text-teal-400 transition-colors">About Us</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'contact' }); }} className="hover:text-teal-400 transition-colors">Contact</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'privacy' }); }} className="hover:text-teal-400 transition-colors">Privacy Policy</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'terms' }); }} className="hover:text-teal-400 transition-colors">Terms of Service</a>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 max-w-3xl mx-auto">
                        Disclaimer: Information on this site is for informational purposes only and does not constitute medical advice. We may earn a commission from affiliate links and sponsored placements. Please conduct your own thorough research before making any decisions.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;