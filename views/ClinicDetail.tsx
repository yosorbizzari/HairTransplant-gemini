import React from 'react';
import { Clinic, View, User, Tier } from '../types';
import { TREATMENTS } from '../constants';
import StarIcon from '../components/icons/StarIcon';
import MapPinIcon from '../components/icons/MapPinIcon';
import CheckIcon from '../components/icons/CheckIcon';

interface ClinicDetailProps {
    clinic: Clinic;
    setView: (view: View) => void;
    currentUser: User | null;
    requestLogin: (redirectView: View) => void;
    users: User[];
}

const ClinicDetail: React.FC<ClinicDetailProps> = ({ clinic, setView, currentUser, requestLogin, users }) => {
    const clinicTreatments = TREATMENTS.filter(t => clinic.treatments.includes(t.id));
    const approvedReviews = clinic.reviews.filter(r => r.status === 'approved');

    const hasCoordinates = clinic.latitude && clinic.longitude;
    const mapUrl = hasCoordinates 
        ? `https://maps.googleapis.com/maps/api/staticmap?center=${clinic.latitude},${clinic.longitude}&zoom=15&size=400x300&maptype=roadmap&markers=color:red%7C${clinic.latitude},${clinic.longitude}&key=${process.env.API_KEY}`
        : '';

    const handleWriteReviewClick = () => {
        const reviewView: View = { page: 'writeReview', params: { clinicId: clinic.id } };
        if (currentUser) {
            setView(reviewView);
        } else {
            requestLogin(reviewView);
        }
    };
    
    const getUserName = (userId: number) => {
        return users.find(u => u.id === userId)?.name || 'A Patient';
    };

    const getEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('youtube.com')) {
                const videoId = urlObj.searchParams.get('v');
                return `https://www.youtube.com/embed/${videoId}`;
            }
            if (urlObj.hostname.includes('youtu.be')) {
                const videoId = urlObj.pathname.slice(1);
                return `https://www.youtube.com/embed/${videoId}`;
            }
        } catch (e) {
            // Not a valid URL, return original string
        }
        return url;
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto px-6 py-12">
                {/* Back Button */}
                <button
                    onClick={() => setView({ page: 'directory' })}
                    className="mb-8 text-teal-600 hover:text-teal-800 font-semibold flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Directory
                </button>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <div className="flex items-center gap-4">
                             <h1 className="text-5xl font-extrabold text-gray-900">{clinic.name}</h1>
                             {clinic.verified && (
                                <div className="mt-2 bg-green-100 text-green-800 text-sm font-bold px-4 py-2 rounded-full flex items-center">
                                    <CheckIcon className="w-5 h-5 mr-2" />
                                    Verified Listing
                                </div>
                            )}
                        </div>
                        <div className="flex items-center text-gray-600 mt-4">
                            <MapPinIcon className="w-5 h-5 mr-2" />
                            <span>{clinic.address}, {clinic.city}, {clinic.country}</span>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center">
                        <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-6 h-6 ${i < Math.round(clinic.rating) ? 'text-amber-500' : 'text-gray-300'}`} />)}
                        </div>
                        <span className="ml-3 text-xl font-bold text-gray-800">{clinic.rating.toFixed(1)}</span>
                        <span className="ml-2 text-gray-500">({clinic.reviewCount} reviews)</span>
                    </div>
                </div>

                {/* Main Content Flex Layout */}
                <div className="flex flex-col lg:flex-row lg:items-start gap-12">
                    {/* Left Column (Details) */}
                    <div className="lg:w-2/3">
                        <img src={clinic.imageUrl} alt={clinic.name} className="w-full h-96 object-cover rounded-xl shadow-lg mb-8" />
                        
                        {/* Video Section for Gold Tier */}
                        {clinic.videoUrl && clinic.tier === Tier.GOLD && (
                            <div className="my-12">
                                <h2 className="text-3xl font-bold mb-4">Clinic Video</h2>
                                <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
                                    <iframe 
                                        className="w-full h-full"
                                        src={getEmbedUrl(clinic.videoUrl)}
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                        title={`${clinic.name} Video`}
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        {/* Gallery Section for Premium & Gold */}
                        {clinic.galleryImages && clinic.galleryImages.length > 0 && (clinic.tier === Tier.PREMIUM || clinic.tier === Tier.GOLD) && (
                             <div className="my-12">
                                <h2 className="text-3xl font-bold mb-4">Photo Gallery</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {clinic.galleryImages.map((img, index) => (
                                        <div key={index} className="overflow-hidden rounded-lg shadow-md aspect-square">
                                            <img src={img} alt={`Gallery photo ${index + 1} for ${clinic.name}`} className="w-full h-full object-cover"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <h2 className="text-3xl font-bold mb-4">About {clinic.name}</h2>
                        <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">{clinic.longDescription}</p>

                        <h2 className="text-3xl font-bold mt-12 mb-6">Treatments Offered</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {clinicTreatments.map(treatment => (
                                <div key={treatment.id} className="bg-gray-50 p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                        <CheckIcon className="w-6 h-6 mr-3 text-teal-500" />
                                        {treatment.name}
                                    </h3>
                                    <p className="text-gray-600 mt-2">{treatment.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-12 mb-6">
                            <h2 className="text-3xl font-bold">Patient Reviews</h2>
                            <button onClick={handleWriteReviewClick} className="px-5 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors">
                                Write a Review
                            </button>
                        </div>
                        <div className="space-y-6">
                            {approvedReviews.length > 0 ? (
                                approvedReviews.map(review => (
                                    <div key={review.id} className="bg-gray-50 p-6 rounded-lg border-l-4 border-teal-500">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-lg">{review.isAnonymous ? 'Anonymous' : getUserName(review.userId)}</h4>
                                            <div className="flex text-amber-500">
                                                {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-amber-500' : 'text-gray-300'}`} />)}
                                            </div>
                                        </div>
                                        <p className="text-gray-700 italic">"{review.comment}"</p>
                                        <p className="text-right text-sm text-gray-500 mt-2">{review.date}</p>
                                    </div>
                                ))
                            ) : clinic.aggregatedRating && clinic.aggregatedReviewCount && clinic.reviewSource ? (
                                <div className="bg-gray-50 p-8 rounded-lg text-center border-2 border-dashed">
                                    <h3 className="text-xl font-bold text-gray-800">Reviews From Around the Web</h3>
                                    <p className="text-gray-600 mt-2">This clinic has no reviews on HairDirect yet.</p>
                                    <div className="my-6">
                                        <span className="text-5xl font-extrabold text-gray-800">{clinic.aggregatedRating.toFixed(1)}</span>
                                        <div className="flex justify-center text-amber-500 mt-2">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className={`w-7 h-7 ${i < Math.round(clinic.aggregatedRating!) ? 'text-amber-500' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                        <p className="mt-2 text-gray-600">
                                            Based on <span className="font-bold">{clinic.aggregatedReviewCount}</span> reviews on <span className="font-bold">{clinic.reviewSource}</span>.
                                        </p>
                                    </div>
                                    <div className="space-y-4 max-w-sm mx-auto">
                                        <a href={clinic.reviewSourceUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full py-3 px-4 bg-white text-gray-800 font-bold rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                                            Read Reviews on {clinic.reviewSource}
                                        </a>
                                        <button onClick={handleWriteReviewClick} className="w-full py-3 px-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors">
                                            Be the first to leave a review!
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-600 bg-gray-50 p-6 rounded-lg">No reviews yet for this clinic.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column (Contact & Map) */}
                    <div className="lg:w-1/3">
                        <div className="bg-teal-50 border border-teal-200 p-8 rounded-xl shadow-md sticky top-28">
                            {!clinic.verified ? (
                                <div className="mb-8 text-center bg-amber-100 p-4 rounded-lg border border-amber-300">
                                    <h3 className="text-lg font-bold text-amber-800">Is this your clinic?</h3>
                                    <p className="text-amber-700 text-sm mt-1">Claim this listing to manage your profile, add photos, and respond to reviews.</p>
                                    <button 
                                        onClick={() => setView({ page: 'claimListing', params: { id: clinic.id } })}
                                        className="w-full mt-4 py-2 px-4 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors"
                                    >
                                        Claim This Listing
                                    </button>
                                </div>
                            ) : null}
                            <h3 className="text-2xl font-bold text-teal-900 mb-6">Contact & Booking</h3>
                            <div className="space-y-4">
                                <p className="text-lg"><strong>Phone:</strong> <a href={`tel:${clinic.contact.phone}`} className="text-teal-700 hover:underline">{clinic.contact.phone}</a></p>
                                <p className="text-lg"><strong>Website:</strong> <a href={`https://${clinic.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">{clinic.contact.website}</a></p>
                            </div>
                            <button className="w-full mt-8 py-3 px-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors text-lg">
                                Request a Quote
                            </button>
                            <div className="mt-8">
                                {hasCoordinates ? (
                                    <img src={mapUrl} alt={`Map of ${clinic.name}`} className="w-full rounded-lg" />
                                ) : (
                                    <div className="w-full h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
                                        <p className="text-gray-500">Map location not available.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicDetail;