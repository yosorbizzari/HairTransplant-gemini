
import React, { useState } from 'react';
import { View, User } from '../types';

interface LoginPageProps {
    onLogin: (email: string, pass: string) => Promise<{ success: boolean; message: string; }>;
    onSignUp: (name: string, email: string, pass: string) => Promise<{ success: boolean; message: string; }>;
    setView: (view: View) => void;
    reason: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignUp, setView, reason }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLoginView) {
            const result = await onLogin(email, password);
            if (!result.success) {
                setError(result.message);
            }
        } else {
            if (name.length < 3) {
                setError('Username must be at least 3 characters long.');
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters long.');
                return;
            }
            const result = await onSignUp(name, email, password);
            if (!result.success) {
                setError(result.message);
            }
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="bg-gray-50 py-12 flex items-center justify-center min-h-full">
            <div className="max-w-md w-full mx-auto">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-900 text-center">{isLoginView ? 'Login' : 'Create an Account'}</h1>
                    <p className="mt-2 text-gray-600 text-center">{reason}</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        {!isLoginView && (
                             <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Username</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" 
                                    required 
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" 
                                required 
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                id="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" 
                                required 
                            />
                        </div>
                        
                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                            {isLoginView ? 'Login' : 'Sign Up & Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={toggleView} className="text-sm text-teal-600 hover:text-teal-800 font-medium">
                            {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;