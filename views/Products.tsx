
import React from 'react';
import { View, ProductReview } from '../types';
import ProductCard from '../components/ProductCard';

interface ProductsProps {
    setView: (view: View) => void;
    products: ProductReview[];
}

const Products: React.FC<ProductsProps> = ({ setView, products }) => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Recommended Products</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Expert reviews of the best products for hair health, growth, and post-procedure care. We've tested and curated these selections to help you on your journey.</p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} setView={setView} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
                        <p className="text-gray-500 mt-2">We haven't reviewed any products yet. Please check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;