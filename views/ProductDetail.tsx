
import React from 'react';
import { ProductReview, View } from '../types';
import StarIcon from '../components/icons/StarIcon';

interface ProductDetailProps {
    product: ProductReview;
    setView: (view: View) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, setView }) => {
    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-6">
                <button
                    onClick={() => setView({ page: 'products' })}
                    className="mb-8 text-teal-600 hover:text-teal-800 font-semibold flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to All Products
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Column (Image & Buy Button) */}
                    <div className="sticky top-28">
                        <img src={product.imageUrl} alt={product.name} className="w-full rounded-xl shadow-lg mb-6" />
                         <a 
                            href={product.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full block text-center py-4 px-6 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-colors text-xl shadow-md"
                        >
                            Buy Now
                        </a>
                        <p className="text-center text-xs text-gray-500 mt-2">Note: This is an affiliate link. We may earn a commission.</p>
                    </div>

                    {/* Right Column (Review Details) */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
                        
                        <div className="my-6 flex items-center">
                            <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-6 h-6 ${i < Math.round(product.rating) ? 'text-amber-500' : 'text-gray-300'}`} />)}
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-800">{product.rating.toFixed(1)} / 5.0</span>
                        </div>
                        
                        <p className="text-lg text-gray-600 italic mb-8 border-l-4 border-gray-200 pl-4">{product.summary}</p>

                        <h2 className="text-2xl font-bold mb-4">Our Expert Review</h2>
                        <div 
                            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product.fullReview.replace(/\n/g, '<br /><br />') }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;