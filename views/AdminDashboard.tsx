
import React, { useState, useMemo } from 'react';
import { CITIES, TREATMENTS } from '../constants';
import { Clinic, View, Tier, BlogPost, ProductReview, ClaimRequest, Review, User } from '../types';
import { getReviewResponse, getOptimizedContent, getOptimizedDescriptionOnly } from '../services/geminiService';
import ImageInput from '../components/ImageInput';
import SparklesIcon from '../components/icons/SparklesIcon';


interface AdminDashboardProps {
    setView: (view: View) => void;
    clinics: Clinic[];
    blogs: BlogPost[];
    products: ProductReview[];
    claims: ClaimRequest[];
    pendingReviews: Review[];
    users: User[];
    onSaveClinic: (clinic: Clinic) => void;
    onSaveBlog: (blog: BlogPost) => void;
    onSaveProduct: (product: ProductReview) => void;
    onDeleteBlog: (id: number) => void;
    onDeleteProduct: (id: number) => void;
    onApproveClaim: (id: number) => void;
    onDenyClaim: (id: number) => void;
    onApproveReview: (id: number) => void;
    onDenyReview: (id: number) => void;
}

const AITool: React.FC<{ title: string; description: string; inputLabel: string; buttonText: string; onGenerate: (input: string) => Promise<string>; }> = ({ title, description, inputLabel, buttonText, onGenerate }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        setOutput('');
        const result = await onGenerate(input);
        setOutput(result);
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputLabel}
                className="w-full p-2 border border-gray-300 rounded-md h-32 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400"
            >
                {isLoading ? 'Generating...' : buttonText}
            </button>
            {isLoading && <div className="mt-4 text-center">Loading...</div>}
            {output && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md border">
                    <h4 className="font-semibold mb-2">Generated Output:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{output}</p>
                </div>
            )}
        </div>
    );
};

// Clinic Form Component
const ClinicEditor: React.FC<{ clinic: Clinic | 'new', onSave: (clinic: Clinic) => void, onCancel: () => void }> = ({ clinic, onSave, onCancel }) => {
    const isNew = clinic === 'new';
    const [formData, setFormData] = useState(isNew ? {
        name: '', tier: Tier.BASIC, city: '', country: '', address: '', latitude: 0, longitude: 0, shortDescription: '', longDescription: '', treatments: [], contact: { phone: '', website: ''}, imageUrl: '', galleryImages: [], videoUrl: '', rating: 0, reviewCount: 0, reviews: [], verified: false
    } : { ...clinic, latitude: clinic.latitude || 0, longitude: clinic.longitude || 0, galleryImages: clinic.galleryImages || [], videoUrl: clinic.videoUrl || '' });
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isFetchingCoords, setIsFetchingCoords] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'phone' || name === 'website') {
            setFormData(prev => ({ ...prev, contact: { ...prev.contact, [name]: value }}));
        } else if (name === 'treatments') {
            setFormData(prev => ({ ...prev, treatments: value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id))}));
        } else if (name === 'city') {
            const selectedCity = CITIES.find(c => c.name === value);
            setFormData(prev => ({
                ...prev,
                city: value,
                country: selectedCity ? selectedCity.country : ''
            }));
        } else if (name === 'latitude' || name === 'longitude') {
             setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleGalleryImageChange = (url: string, index: number) => {
        setFormData(prev => {
            const newGallery = [...(prev.galleryImages || [])];
            newGallery[index] = url;
            return { ...prev, galleryImages: newGallery };
        });
    };

    const addGalleryImageSlot = () => {
        setFormData(prev => ({ ...prev, galleryImages: [...(prev.galleryImages || []), ''] }));
    };

    const removeGalleryImageSlot = (index: number) => {
        setFormData(prev => ({ ...prev, galleryImages: (prev.galleryImages || []).filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: isNew ? Date.now() : (clinic as Clinic).id } as Clinic);
    };

    const handleOptimizeDescription = async () => {
        if (!formData.longDescription.trim()) return;
        setIsOptimizing(true);
        try {
            const optimizedText = await getOptimizedDescriptionOnly(formData.longDescription);
            if (optimizedText && !optimizedText.toLowerCase().includes("error occurred")) {
                setFormData(prev => ({...prev, longDescription: optimizedText}));
            } else {
                alert("AI optimization failed. Please try again.");
            }
        } catch (error) {
            console.error("Optimization failed", error);
            alert("AI optimization failed. Please try again.");
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleFetchCoordinates = async () => {
        if (!formData.address || !formData.city) {
            alert("Please enter an address and city first.");
            return;
        }
        setIsFetchingCoords(true);
        // This is a simulation. In a real app, you would use the Google Geocoding API.
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        const cityCoords: { [key: string]: { lat: number, lng: number } } = {
            'Istanbul': { lat: 41.0082, lng: 28.9784 }, 'Dubai': { lat: 25.2048, lng: 55.2708 },
            'Delhi': { lat: 28.6139, lng: 77.2090 }, 'Mexico City': { lat: 19.4326, lng: -99.1332 },
            'Tijuana': { lat: 32.5149, lng: -117.0382 }, 'Bangkok': { lat: 13.7563, lng: 100.5018 },
            'London': { lat: 51.5072, lng: -0.1276 }, 'Los Angeles': { lat: 34.0522, lng: -118.2437 },
            'Chicago': { lat: 41.8781, lng: -87.6298 }, 'New York': { lat: 40.7128, lng: -74.0060 },
            'Miami': { lat: 25.7617, lng: -80.1918 }, 'Budapest': { lat: 47.4979, lng: 19.0402 },
            'Warsaw': { lat: 52.2297, lng: 21.0122 }, 'Kuala Lumpur': { lat: 3.1390, lng: 101.6869 },
            'Seoul': { lat: 37.5665, lng: 126.9780 }
        };
        const base = cityCoords[formData.city];
        if (base) {
            const lat = base.lat + (Math.random() - 0.5) * 0.05;
            const lng = base.lng + (Math.random() - 0.5) * 0.05;
            setFormData(prev => ({ ...prev, latitude: parseFloat(lat.toFixed(6)), longitude: parseFloat(lng.toFixed(6)) }));
        } else {
            alert('Could not find coordinates for this city. Please enter them manually.');
        }
        setIsFetchingCoords(false);
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-2xl font-bold mb-6">{isNew ? 'Add New Clinic' : `Editing: ${formData.name}`}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Clinic Name" className="p-2 border rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                    <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Short Description" className="p-2 border rounded col-span-2 h-24 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                    
                    <div className="col-span-2">
                        <div className="flex justify-between items-center mb-1">
                            <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700">Long Description</label>
                            <button
                                type="button"
                                onClick={handleOptimizeDescription}
                                disabled={isOptimizing || !formData.longDescription.trim()}
                                className="flex items-center px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-100 rounded-full hover:bg-teal-200 disabled:bg-gray-200 disabled:text-gray-500 transition-colors"
                            >
                                {isOptimizing ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <SparklesIcon className="w-4 h-4 mr-1.5" />
                                )}
                                {isOptimizing ? 'Optimizing...' : 'Optimize with AI'}
                            </button>
                        </div>
                        <textarea id="longDescription" name="longDescription" value={formData.longDescription} onChange={handleChange} placeholder="Long Description" className="p-2 border rounded w-full h-40 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                    </div>
                    
                    <select name="city" value={formData.city} onChange={handleChange} className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" required>
                        <option value="" disabled>Select a City</option>
                        {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    
                    <input name="country" value={formData.country} onChange={handleChange} placeholder="Country (auto-filled)" className="p-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500" readOnly />

                    <div className="col-span-2">
                        <input name="address" value={formData.address} onChange={handleChange} placeholder="Full Street Address" className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                    </div>

                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" />
                        <button
                            type="button"
                            onClick={handleFetchCoordinates}
                            disabled={isFetchingCoords}
                            className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
                        >
                            {isFetchingCoords ? 'Fetching...' : 'Verify Address & Get Coordinates'}
                        </button>
                    </div>


                    <input name="phone" value={formData.contact.phone} onChange={handleChange} placeholder="Phone" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <input name="website" value={formData.contact.website} onChange={handleChange} placeholder="Website (e.g. domain.com)" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <select name="tier" value={formData.tier} onChange={handleChange} className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500">
                        {Object.values(Tier).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                
                 {/* Tier-based Media Uploads */}
                <div className="border-t pt-6 space-y-6">
                    <ImageInput 
                        label="Main Clinic Image (Required)"
                        currentImageUrl={formData.imageUrl}
                        onImageUrlChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                    />
                    
                    {formData.tier === Tier.PREMIUM && (
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Photo Gallery (up to 5 images)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Array.from({ length: 5 }).map((_, index) => (
                                     <ImageInput 
                                        key={index}
                                        label={`Gallery Image ${index + 1}`}
                                        currentImageUrl={formData.galleryImages?.[index] || ''}
                                        onImageUrlChange={(url) => handleGalleryImageChange(url, index)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {formData.tier === Tier.GOLD && (
                        <>
                            <div>
                                <h4 className="text-lg font-semibold mb-2">Photo Gallery (Unlimited)</h4>
                                <div className="space-y-4">
                                {(formData.galleryImages || []).map((imgUrl, index) => (
                                    <div key={index} className="flex items-end gap-4">
                                        <div className="flex-grow">
                                             <ImageInput 
                                                label={`Gallery Image ${index + 1}`}
                                                currentImageUrl={imgUrl}
                                                onImageUrlChange={(url) => handleGalleryImageChange(url, index)}
                                            />
                                        </div>
                                        <button type="button" onClick={() => removeGalleryImageSlot(index)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mb-9">-</button>
                                    </div>
                                ))}
                                </div>
                                <button type="button" onClick={addGalleryImageSlot} className="mt-4 px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300">Add Photo Slot</button>
                            </div>
                             <div>
                                <h4 className="text-lg font-semibold mb-2">Video Upload</h4>
                                 <input 
                                    name="videoUrl" 
                                    value={formData.videoUrl} 
                                    onChange={handleChange} 
                                    placeholder="Video URL (e.g., YouTube, Vimeo)" 
                                    className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500" 
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="col-span-2 border-t pt-6">
                    <label className="block text-sm font-medium text-gray-700">Treatments (comma-separated IDs)</label>
                    <input name="treatments" value={formData.treatments.join(', ')} onChange={handleChange} placeholder="e.g., 1, 2, 4" className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <p className="text-xs text-gray-500 mt-1">{TREATMENTS.map(t => `${t.id}: ${t.name}`).join('; ')}</p>
                </div>
                <div className="col-span-2 flex justify-end space-x-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Save Clinic</button>
                </div>
            </form>
        </div>
    );
};

// Blog Form Component
const BlogEditor: React.FC<{ blog: BlogPost | 'new', onSave: (blog: BlogPost) => void, onCancel: () => void }> = ({ blog, onSave, onCancel }) => {
    const isNew = blog === 'new';
    const [formData, setFormData] = useState(isNew ? {
        title: '', author: '', date: new Date().toISOString().split('T')[0], summary: '', content: '', imageUrl: ''
    } : { ...blog });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: isNew ? Date.now() : (blog as BlogPost).id } as BlogPost);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-2xl font-bold mb-6">{isNew ? 'Add New Blog Post' : 'Edit Blog Post'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Blog Title" className="p-2 border rounded md:col-span-2 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                </div>
                <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <ImageInput 
                    label="Blog Post Image"
                    currentImageUrl={formData.imageUrl}
                    onImageUrlChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                />
                <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Summary" className="p-2 border rounded w-full h-24 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Full Content (use \n for new paragraphs)" className="p-2 border rounded w-full h-48 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Save Post</button>
                </div>
            </form>
        </div>
    );
};

// Product Form Component
const ProductEditor: React.FC<{ product: ProductReview | 'new', onSave: (product: ProductReview) => void, onCancel: () => void }> = ({ product, onSave, onCancel }) => {
    const isNew = product === 'new';
    const [formData, setFormData] = useState(isNew ? {
        name: '', rating: 4.5, summary: '', fullReview: '', affiliateLink: '', imageUrl: '', categoryId: 1
    } : { ...product });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'rating' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: isNew ? Date.now() : (product as ProductReview).id } as ProductReview);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-2xl font-bold mb-6">{isNew ? 'Add New Product Review' : `Editing: ${formData.name}`}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="p-2 border rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                
                <input type="number" step="0.1" min="1" max="5" name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating (1.0 - 5.0)" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <div></div>
                
                <input name="affiliateLink" value={formData.affiliateLink} onChange={handleChange} placeholder="Affiliate Link" className="p-2 border rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-teal-500" required/>
                
                <ImageInput 
                    label="Product Image"
                    currentImageUrl={formData.imageUrl}
                    onImageUrlChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                />

                <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Summary" className="p-2 border rounded col-span-2 h-24 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <textarea name="fullReview" value={formData.fullReview} onChange={handleChange} placeholder="Full Review (use \n for new paragraphs)" className="p-2 border rounded col-span-2 h-48 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                
                <div className="col-span-2 flex justify-end space-x-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Save Product</button>
                </div>
            </form>
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView, clinics, blogs, products, claims, pendingReviews, users, onSaveClinic, onSaveBlog, onSaveProduct, onDeleteBlog, onDeleteProduct, onApproveClaim, onDenyClaim, onApproveReview, onDenyReview }) => {
    const [activeTab, setActiveTab] = useState('claims');
    const [editingClinic, setEditingClinic] = useState<Clinic | 'new' | null>(null);
    const [editingBlog, setEditingBlog] = useState<BlogPost | 'new' | null>(null);
    const [editingProduct, setEditingProduct] = useState<ProductReview | 'new' | null>(null);

    // Clinic Filters
    const [cityFilter, setCityFilter] = useState('All');
    const [tierFilter, setTierFilter] = useState('All');

    const filteredClinics = useMemo(() => {
        return clinics.filter(clinic => {
            const matchesCity = cityFilter === 'All' || clinic.city === cityFilter;
            const matchesTier = tierFilter === 'All' || clinic.tier === tierFilter;
            return matchesCity && matchesTier;
        });
    }, [clinics, cityFilter, tierFilter]);


    const handleSaveClinic = (clinicToSave: Clinic) => {
        onSaveClinic(clinicToSave);
        setEditingClinic(null);
    };

    const handleSaveBlog = (blogToSave: BlogPost) => {
        onSaveBlog(blogToSave);
        setEditingBlog(null);
    };

     const handleSaveProduct = (productToSave: ProductReview) => {
        onSaveProduct(productToSave);
        setEditingProduct(null);
    };

    const handleDeleteBlog = (id: number) => {
        if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            onDeleteBlog(id);
        }
    };
    
    const handleDeleteProduct = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product review? This action cannot be undone.')) {
            onDeleteProduct(id);
        }
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'claims':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Pending Claims</h2>
                        {claims.length > 0 ? (
                            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {claims.map(claim => (
                                            <tr key={claim.id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium">{claim.clinicName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>{claim.submitterName} ({claim.submitterTitle})</div>
                                                    <div className="text-sm text-gray-500">{claim.submitterEmail}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {claim.verificationMethod === 'email' ? (
                                                        <span className="text-sm">Business Email</span>
                                                    ) : (
                                                        <a href={claim.documentProof} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:underline font-semibold">View Document</a>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                                    <button onClick={() => onApproveClaim(claim.id)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                                                    <button onClick={() => onDenyClaim(claim.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Deny</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">No pending claims to review.</p>
                        )}
                    </div>
                );
            case 'reviews':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Pending Reviews</h2>
                        {pendingReviews.length > 0 ? (
                            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pendingReviews.map(review => (
                                            <tr key={review.id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium">{clinics.find(c => c.id === review.clinicId)?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{users.find(u => u.uid === review.userId)?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{review.rating} ★</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-sm truncate">{review.comment}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                                    <button onClick={() => onApproveReview(review.id)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                                                    <button onClick={() => onDenyReview(review.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Deny</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">No pending reviews to moderate.</p>
                        )}
                    </div>
                );
            case 'clinics':
                return editingClinic ? (
                    <ClinicEditor clinic={editingClinic} onSave={handleSaveClinic} onCancel={() => setEditingClinic(null)} />
                ) : (
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold">Manage Clinics</h2>
                            <div className="flex items-center gap-4">
                                <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="p-2 border rounded">
                                    <option value="All">All Cities</option>
                                    {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                </select>
                                <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="p-2 border rounded">
                                    <option value="All">All Tiers</option>
                                    {Object.values(Tier).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <button onClick={() => setEditingClinic('new')} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 whitespace-nowrap">Add New Clinic</button>
                            </div>
                        </div>
                        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredClinics.map(clinic => (
                                        <tr key={clinic.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{clinic.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{clinic.city}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    clinic.tier === Tier.GOLD ? 'bg-amber-100 text-amber-800' :
                                                    clinic.tier === Tier.PREMIUM ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {clinic.tier}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${clinic.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {clinic.verified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => setEditingClinic(clinic)} className="text-teal-600 hover:text-teal-900">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'blogs':
                 return editingBlog ? (
                    <BlogEditor blog={editingBlog} onSave={handleSaveBlog} onCancel={() => setEditingBlog(null)} />
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Manage Blogs</h2>
                            <button onClick={() => setEditingBlog('new')} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Add New Post</button>
                        </div>
                         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {blogs.map(blog => (
                                        <tr key={blog.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">{blog.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{blog.author}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{blog.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => setEditingBlog(blog)} className="text-teal-600 hover:text-teal-900">Edit</button>
                                                <button onClick={() => handleDeleteBlog(blog.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'products':
                 return editingProduct ? (
                    <ProductEditor product={editingProduct} onSave={handleSaveProduct} onCancel={() => setEditingProduct(null)} />
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Manage Product Reviews</h2>
                            <button onClick={() => setEditingProduct('new')} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Add New Product</button>
                        </div>
                         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.rating.toFixed(1)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => setEditingProduct(product)} className="text-teal-600 hover:text-teal-900">Edit</button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'ai-tools':
                return (
                     <div>
                        <h2 className="text-2xl font-bold mb-4">AI Assistant Tools</h2>
                        <p className="text-gray-600 mb-6">Powered by Gemini. Available for Gold Tier clinics.</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           <AITool
                                title="Review Assistant"
                                description="Paste a negative patient review and get a professional, empathetic response drafted for you."
                                inputLabel="Paste patient review here..."
                                buttonText="Generate Response"
                                onGenerate={getReviewResponse}
                           />
                           <AITool
                                title="Content Optimizer"
                                description="Paste your clinic's description to get an improved version that is more compelling to potential patients."
                                inputLabel="Paste clinic description here..."
                                buttonText="Optimize Content"
                                onGenerate={getOptimizedContent}
                           />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const TabButton = ({ id, label, count }: { id: string; label: string, count?: number }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === id
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label}
            {count && count > 0 ? (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                    {count}
                </span>
            ) : null}
        </button>
    );

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold mb-8">Admin Dashboard</h1>
                <div className="flex flex-wrap gap-2 border-b mb-8 pb-2">
                    <TabButton id="claims" label="Pending Claims" count={claims.length} />
                    <TabButton id="reviews" label="Pending Reviews" count={pendingReviews.length} />
                    <TabButton id="clinics" label="Manage Clinics" />
                    <TabButton id="blogs" label="Manage Blogs" />
                    <TabButton id="products" label="Manage Products" />
                    <TabButton id="ai-tools" label="AI Tools" />
                </div>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default AdminDashboard;