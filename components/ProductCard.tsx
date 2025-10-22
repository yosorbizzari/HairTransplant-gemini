
import React from 'react';
import { ProductReview, View } from '../types';
import StarIcon from './icons/StarIcon';

interface ProductCardProps {
    product: ProductReview;
    setView: (view: View) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, setView }) => {
    return (
        <div 
            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer group"
            onClick={() => setView({ page: 'productDetail', params: { id: product.id } })}
        >
            <div className="overflow-hidden">
                <img className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300" src={product.imageUrl} alt={product.name} />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">{product.name}</h3>
                <div className="flex items-center mb-3">
                    <div className="flex items-center text-amber-500">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-amber-500' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    <span className="ml-2 text-gray-600 font-semibold">{product.rating.toFixed(1)}</span>
                </div>
                <p className="text-gray-700 mb-4 line-clamp-3">{product.summary}</p>
                 <span className="font-semibold text-teal-600 group-hover:underline">
                    Read Review &rarr;
                </span>
            </div>
        </div>
    );
};

export default ProductCard;