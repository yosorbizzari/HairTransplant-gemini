
import React from 'react';
import { View } from '../types';
import CheckIcon from '../components/icons/CheckIcon';
import BookOpenIcon from '../components/icons/BookOpenIcon';
import UsersIcon from '../components/icons/UsersIcon';

interface AboutUsPageProps {
    setView: (view: View) => void;
}

const AboutUsPage: React.FC<AboutUsPageProps> = ({ setView }) => {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-800 text-white py-20 md:py-32">
                <div className="absolute inset-0">
                    <img src="https://picsum.photos/1600/800?random=about" alt="Team working together" className="w-full h-full object-cover opacity-30" />
                </div>
                <div className="relative container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">About Transplantify</h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">Bringing clarity and confidence to your hair restoration journey.</p>
                </div>
            </div>

            {/* Our Mission */}
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Mission</h2>
                    <p className="mt-6 text-xl text-gray-700 leading-relaxed border-l-4 border-teal-500 pl-6 italic">
                        To empower patients with transparent, reliable, and comprehensive information, connecting them with the world's most trusted hair transplant clinics. We believe everyone deserves to make a confident, informed decision about their hair restoration.
                    </p>
                </div>
            </div>

            {/* Our Story */}
            <div className="py-20">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                        <div className="text-gray-700 space-y-4 leading-loose">
                            <p>
                                Transplantify was born from a personal struggle. Our founder, like many of you, faced the daunting task of navigating the complex world of hair restoration. The endless research, the confusing pricing, and the difficulty in distinguishing reputable clinics from the rest was overwhelming.
                            </p>
                            <p>
                                Frustrated by the lack of a single, trustworthy resource, the idea for Transplantify was conceived: a platform dedicated to providing clarity. We set out to create a directory that not only lists clinics but also verifies them, shares real patient reviews, and offers unbiased educational content to guide you every step of the way.
                            </p>
                             <p>
                                Today, we're proud to be a leading resource for patients worldwide, helping thousands find their perfect clinic and regain their confidence.
                            </p>
                        </div>
                    </div>
                     <div className="order-1 md:order-2">
                        <img src="https://picsum.photos/600/500?random=story" alt="A person looking confidently in a mirror" className="rounded-xl shadow-2xl w-full" />
                    </div>
                </div>
            </div>

            {/* What We Believe In */}
            <div className="py-20 bg-gray-50">
                 <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">What We Believe In</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                        <div className="text-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mx-auto mb-4">
                                <CheckIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Verification & Trust</h3>
                            <p className="text-gray-600">
                                Trust is our foundation. We meticulously verify clinics to ensure they meet high standards of quality and care. Our "Verified" badge is a symbol of our commitment to your safety and satisfaction.
                            </p>
                        </div>
                        <div className="text-center">
                             <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mx-auto mb-4">
                                <BookOpenIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Education & Transparency</h3>
                            <p className="text-gray-600">
                                An informed patient is an empowered patient. We provide in-depth guides, honest product reviews, and a transparent platform for real patient feedback, giving you the knowledge to choose wisely.
                            </p>
                        </div>
                        <div className="text-center">
                             <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mx-auto mb-4">
                                <UsersIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">A Patient-First Approach</h3>
                            <p className="text-gray-600">
                                Your journey is at the heart of everything we do. From our intuitive search tools to our responsive support, we are dedicated to making your experience as smooth and stress-free as possible.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-teal-700">
                <div className="container mx-auto px-6 py-20 text-center text-white">
                    <h2 className="text-4xl font-extrabold">Join Our Community</h2>
                    <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">
                        Whether you're a patient looking for the right clinic or a clinic owner wanting to reach more patients, Transplantify is here to help you succeed.
                    </p>
                    <div className="mt-8 flex justify-center gap-4 flex-wrap">
                        <button
                            onClick={() => setView({ page: 'directory' })}
                            className="px-8 py-3 bg-white text-teal-800 font-bold rounded-lg hover:bg-gray-200 transition-colors text-lg shadow-md"
                        >
                            Find a Clinic
                        </button>
                        <button
                            onClick={() => setView({ page: 'pricing' })}
                            className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-teal-800 transition-colors text-lg"
                        >
                            For Clinic Owners
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;