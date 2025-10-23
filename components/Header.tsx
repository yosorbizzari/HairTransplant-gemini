
import React, { useState } from 'react';
import { View, User } from '../types';
import Logo from './icons/Logo';
import HamburgerIcon from './icons/HamburgerIcon';
import CloseIcon from './icons/CloseIcon';

interface HeaderProps {
    setView: (view: View) => void;
    currentUser: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ setView, currentUser, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const handleDashboardClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        if (!currentUser) return;

        if (currentUser.role === 'admin') {
            setView({ page: 'admin' });
        } else if (currentUser.role === 'clinic-owner') {
            setView({ page: 'clinicDashboard' });
        } else if (currentUser.role === 'patient') {
            setView({ page: 'patientDashboard' });
        }
    };

    const handleNavLinkClick = (view: View) => {
        setIsMobileMenuOpen(false);
        setView(view);
    }

    const navLinks = (
        <>
            <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={(e) => { e.preventDefault(); handleNavLinkClick({ page: 'home' }); }}>Home</a>
            <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={(e) => { e.preventDefault(); handleNavLinkClick({ page: 'directory' }); }}>Clinics</a>
            <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={(e) => { e.preventDefault(); handleNavLinkClick({ page: 'products' }); }}>Products</a>
            <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={(e) => { e.preventDefault(); handleNavLinkClick({ page: 'blog' }); }}>Blog</a>
            <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={(e) => { e.preventDefault(); handleNavLinkClick({ page: 'pricing' }); }}>For Clinics</a>
            {currentUser && (
                 <a href="#" className="text-gray-600 hover:text-teal-600 transition-colors" onClick={handleDashboardClick}>Dashboard</a>
            )}
        </>
    );

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="cursor-pointer" onClick={() => handleNavLinkClick({ page: 'home' })}>
                        <Logo />
                    </div>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center">
                        {currentUser ? (
                            <div className="text-right">
                                <span className="text-gray-700 font-medium text-sm block">Welcome, {currentUser.name}</span>
                                <button 
                                    onClick={onLogout}
                                    className="text-sm text-teal-600 hover:underline font-semibold"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button 
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                onClick={() => handleNavLinkClick({ page: 'login' })}
                            >
                                Login / Sign Up
                            </button>
                        )}
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <CloseIcon className="w-6 h-6"/> : <HamburgerIcon className="w-6 h-6"/>}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t">
                        <div className="flex flex-col space-y-4 items-center">
                            {navLinks}
                            <div className="w-full pt-4 border-t mt-2">
                                {currentUser ? (
                                    <div className="flex flex-col items-center gap-4 w-full">
                                        <span className="text-gray-700 font-medium">Welcome, {currentUser.name}</span>
                                        <button 
                                            onClick={onLogout}
                                            className="w-full text-center text-sm bg-gray-200 px-3 py-2 rounded-md hover:bg-gray-300 transition-colors font-semibold"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                        onClick={() => handleNavLinkClick({ page: 'login' })}
                                    >
                                        Login / Sign Up
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
