
import React, { useState } from 'react';
import { View } from '../types';
import CheckIcon from '../components/icons/CheckIcon';

const AiConciergePage: React.FC<{ setView: (view: View) => void }> = ({ setView }) => {
    
    const [demoStep, setDemoStep] = useState(0);
    const demoConversation = [
        { type: 'patient', text: 'Hi, how much does an FUE procedure cost?' },
        { type: 'ai', text: 'Hello! The cost of an FUE procedure can vary based on the number of grafts needed. Generally, it ranges from $4,000 to $15,000. Would you like me to help you get a more precise quote?' },
        { type: 'patient', text: 'Yes, please.' },
        { type: 'ai', text: 'Great! To get started, could I get your first name and email address?' },
    ];

    const handleDemoClick = () => {
        if (demoStep < demoConversation.length) {
            setDemoStep(demoStep + 1);
        } else {
            setDemoStep(0);
        }
    };
    
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-800 text-white py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-800 to-gray-900 opacity-80"></div>
                <div className="relative container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight">Never Miss a Patient Inquiry Again</h1>
                    <p className="text-lg md:text-xl text-teal-100 mb-8 max-w-3xl mx-auto">Introducing the Transplantify AI Concierge: Your 24/7 Automated Clinic Receptionist.</p>
                    <button className="px-8 py-4 bg-white text-teal-800 font-bold rounded-lg hover:bg-gray-200 transition-colors text-lg shadow-xl">
                        Book a Live Demo
                    </button>
                </div>
            </div>

             {/* How It Works Section */}
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Capture Leads While You Sleep</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <div className="flex flex-col items-center">
                             <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                                <span className="text-2xl font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Patient Asks</h3>
                            <p className="text-gray-600">A potential patient visits your website outside of business hours and asks a question.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                                <span className="text-2xl font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">AI Answers & Qualifies</h3>
                            <p className="text-gray-600">Our AI provides instant answers, qualifies their needs, and gathers their contact information.</p>
                        </div>
                         <div className="flex flex-col items-center">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-600 mb-4">
                                <span className="text-2xl font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">You Get the Lead</h3>
                            <p className="text-gray-600">The qualified lead and conversation summary are sent directly to your inbox for follow-up.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Interactive Demo */}
            <div className="py-20">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                         <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
                         <p className="text-lg text-gray-600 mb-6">Experience how the AI Concierge handles a typical patient conversation. Click the button to advance the dialogue.</p>
                         <button onClick={handleDemoClick} className="px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors">
                            {demoStep < demoConversation.length ? 'Next Message' : 'Reset Demo'}
                        </button>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-xl shadow-lg border h-96 flex flex-col">
                        <div className="bg-gray-700 text-white font-semibold p-3 rounded-t-lg">
                            Clinic Chat
                        </div>
                        <div className="flex-grow space-y-3 p-4 overflow-y-auto">
                           {demoConversation.slice(0, demoStep).map((msg, index) => (
                               <div key={index} className={`flex ${msg.type === 'patient' ? 'justify-end' : 'justify-start'}`}>
                                   <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${msg.type === 'patient' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                       {msg.text}
                                   </div>
                               </div>
                           ))}
                        </div>
                    </div>
                </div>
            </div>

             {/* Pricing Section */}
            <div className="bg-gray-50 py-20">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Plans & Pricing to Grow Your Practice</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-teal-500 flex flex-col">
                            <h3 className="text-2xl font-bold">24/7 AI Receptionist</h3>
                            <p className="my-4"><span className="text-5xl font-extrabold">$499</span>/mo</p>
                            <ul className="space-y-3 text-left my-6 flex-grow">
                                <li className="flex"><CheckIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" /> Up to 500 patient conversations</li>
                                <li className="flex"><CheckIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" /> Trained on your clinic's data</li>
                                <li className="flex"><CheckIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" /> Daily lead summary emails</li>
                                <li className="flex"><CheckIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" /> Full setup & integration</li>
                            </ul>
                            <button onClick={() => setView({ page: 'aiConciergeCheckout' })} className="w-full py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700">Get Started</button>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg p-8 border flex flex-col">
                            <h3 className="text-2xl font-bold">Enterprise Integration</h3>
                            <p className="my-4"><span className="text-5xl font-extrabold">Custom</span></p>
                             <ul className="space-y-3 text-left my-6 flex-grow">
                                <li className="flex"><CheckIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" /> Unlimited patient conversations</li>
                                <li className="flex"><CheckIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" /> Advanced logic & multi-step booking</li>
                                <li className="flex"><CheckIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" /> CRM integration</li>
                                <li className="flex"><CheckIcon className="w-6 h-6 text-green-500 mr-2 flex-shrink-0" /> Dedicated support</li>
                            </ul>
                            <button className="w-full py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-900">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="bg-teal-700 text-white">
                <div className="container mx-auto px-6 py-20 text-center">
                    <h2 className="text-4xl font-extrabold">Ready to automate your patient intake?</h2>
                    <p className="mt-4 text-lg text-teal-100 max-w-2xl mx-auto">Book your free, no-obligation demo today and see how the AI Concierge can transform your clinic's efficiency.</p>
                    <button className="mt-8 px-8 py-4 bg-white text-teal-800 font-bold rounded-lg hover:bg-gray-200 transition-colors text-lg shadow-xl">
                        Book Your Free Demo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiConciergePage;