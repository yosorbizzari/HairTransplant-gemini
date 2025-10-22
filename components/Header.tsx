
import React from 'react';
import { View, User } from '../types';

interface HeaderProps {
    setView: (view: View) => void;
    currentUser: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, currentUser, onLogout }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-teal-600 cursor-pointer" onClick={() => setView({ page: 'home' })}>
                    <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 010 3H14a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H9a1 1 0 001-1v-.5z" />
                           <path d="M5.5 8.5A1.5 1.5 0 017 10v.5a1 1 0 001 1h.5a1.5 1.5 0 010 3H8a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V15a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H3a1 1 0 001-1v-.5A1.5 1.5 0 015.5 8.5z" />
                        </svg>
                        HairDirect
                    </span>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                    <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={(e) => { e.preventDefault(); setView({ page: 'home' }); }}>Home</a>
                    <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={(e) => { e.preventDefault(); setView({ page: 'directory' }); }}>Clinics</a>
                    <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={(e) => { e.preventDefault(); setView({ page: 'products' }); }}>Products</a>
                    <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={(e) => { e.preventDefault(); setView({ page: 'blog' }); }}>Blog</a>
                    <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={(e) => { e.preventDefault(); setView({ page: 'pricing' }); }}>For Clinics</a>
                    <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={(e) => { e.preventDefault(); setView({ page: 'admin' }); }}>Dashboard</a>
                </div>
                {currentUser ? (
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-medium">Welcome, {currentUser.name}</span>
                        <button 
                            onClick={onLogout}
                            className="text-sm text-gray-500 hover:text-gray-800"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <button 
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                        onClick={() => setView({ page: 'login' })}
                    >
                        Login / Sign Up
                    </button>
                )}
            </nav>
        </header>
    );
};

export default Header;
