
import React, { useState } from 'react';
import { Clinic, User, View, Review } from '../types';
import StarIcon from '../components/icons/StarIcon';

interface WriteReviewPageProps {
    clinic: Clinic;
    user: User;
    setView: (view: View) => void;
    onSubmitReview: (review: Omit<Review, 'id' | 'date' | 'status'>) => void;
}

const WriteReviewPage: React.FC<WriteReviewPageProps> = ({ clinic, user, setView, onSubmitReview }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (comment.trim().length < 10) {
            setError('Please write a review of at least 10 characters.');
            return;
        }
        setError('');
        onSubmitReview({
            clinicId: clinic.id,
            userId: user.id,
            rating,
            comment,
            isAnonymous
        });
    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-6 max-w-2xl">
                <button
                    onClick={() => setView({ page: 'clinic', params: { id: clinic.id }})}
                    className="mb-8 text-teal-600 hover:text-teal-800 font-semibold flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Clinic Page
                </button>

                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-extrabold text-gray-900">Write a review for</h1>
                    <p className="mt-1 text-2xl font-semibold text-teal-600">{clinic.name}</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                            <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, index) => {
                                    const starValue = index + 1;
                                    return (
                                        <StarIcon
                                            key={starValue}
                                            onClick={() => setRating(starValue)}
                                            onMouseEnter={() => setHoverRating(starValue)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className={`w-10 h-10 cursor-pointer transition-colors ${
                                                starValue <= (hoverRating || rating) ? 'text-amber-500' : 'text-gray-300'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review</label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                rows={6}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                                placeholder={`Share your experience at ${clinic.name}...`}
                                required
                            />
                        </div>

                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="anonymous"
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="anonymous" className="font-medium text-gray-700">Post as anonymous</label>
                                <p className="text-gray-500">Your username will not be shown with your review.</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input id="confirm" type="checkbox" className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded" required />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="confirm" className="font-medium text-gray-700">I confirm this review is based on my own genuine experience.</label>
                            </div>
                        </div>

                        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WriteReviewPage;
