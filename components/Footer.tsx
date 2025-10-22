
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Transplantify</h3>
                        <p className="text-gray-400">Your trusted guide to hair restoration clinics worldwide.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul>
                            <li className="mb-2"><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
                        <p className="text-gray-400 mb-4">Sign up for our newsletter for the latest updates and offers.</p>
                        <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">
                            Subscribe to Newsletter
                        </button>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Transplantify. All rights reserved.</p>
                    <p className="text-xs text-gray-500 mt-4 max-w-3xl mx-auto">
                        Disclaimer: Information on this site is for informational purposes only and does not constitute medical advice. We may earn a commission from affiliate links and sponsored placements. Please conduct your own thorough research before making any decisions.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;