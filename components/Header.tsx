
import React from 'react';
import { View, User } from '../types';
import Logo from './icons/Logo';

interface HeaderProps {
    setView: (view: View) => void;
    currentUser: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, currentUser, onLogout }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="cursor-pointer" onClick={() => setView({ page: 'home' })}>
                    <Logo />
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