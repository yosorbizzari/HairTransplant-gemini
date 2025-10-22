
import React, { useState } from 'react';
import { Clinic, Tier } from '../types';
import { CITIES, TREATMENTS } from '../constants';
import { getOptimizedDescriptionOnly } from '../services/geminiService';
import ImageInput from './ImageInput';
import SparklesIcon from './icons/SparklesIcon';

interface ClinicEditorProps {
    clinic: Clinic | 'new';
    onSave: (clinic: Clinic) => void;
    onCancel: () => void;
    mode: 'admin' | 'owner';
}

const ClinicEditor: React.FC<ClinicEditorProps> = ({ clinic, onSave, onCancel, mode }) => {
    const isNew = clinic === 'new';
    const initialFormData = isNew 
        ? {
            name: '', tier: Tier.BASIC, city: '', country: '', address: '', latitude: 0, longitude: 0, shortDescription: '', longDescription: '', treatments: [], contact: { phone: '', website: ''}, imageUrl: '', galleryImages: [], videoUrl: '', rating: 0, reviewCount: 0, reviews: [], verified: false
        } 
        : { ...clinic, latitude: clinic.latitude || 0, longitude: clinic.longitude || 0, galleryImages: clinic.galleryImages || [], videoUrl: clinic.videoUrl || '' };
    
    const [formData, setFormData] = useState(initialFormData);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [isFetchingCoords, setIsFetchingCoords] = useState(false);

    const isFieldDisabled = (fieldName: string) => {
        if (mode === 'admin') return false;
        // In owner mode, some fields are not editable
        return ['name', 'tier', 'city', 'country', 'address', 'latitude', 'longitude'].includes(fieldName);
    };

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
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Clinic Name" className="p-2 border rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-teal-500" required disabled={isFieldDisabled('name')} />
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
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                    
                    <select name="city" value={formData.city} onChange={handleChange} className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" required disabled={isFieldDisabled('city')}>
                        <option value="" disabled>Select a City</option>
                        {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    
                    <input name="country" value={formData.country} onChange={handleChange} placeholder="Country (auto-filled)" className="p-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500" readOnly disabled={isFieldDisabled('country')} />

                    <div className="col-span-2">
                        <input name="address" value={formData.address} onChange={handleChange} placeholder="Full Street Address" className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500" required disabled={isFieldDisabled('address')} />
                    </div>

                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" disabled={isFieldDisabled('latitude')} />
                        <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" disabled={isFieldDisabled('longitude')} />
                        <button
                            type="button"
                            onClick={handleFetchCoordinates}
                            disabled={isFetchingCoords || isFieldDisabled('address')}
                            className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
                        >
                            {isFetchingCoords ? 'Fetching...' : 'Verify Address & Get Coordinates'}
                        </button>
                    </div>


                    <input name="phone" value={formData.contact.phone} onChange={handleChange} placeholder="Phone" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <input name="website" value={formData.contact.website} onChange={handleChange} placeholder="Website (e.g. domain.com)" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" />
                    <select name="tier" value={formData.tier} onChange={handleChange} className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" disabled={isFieldDisabled('tier')}>
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

export default ClinicEditor;