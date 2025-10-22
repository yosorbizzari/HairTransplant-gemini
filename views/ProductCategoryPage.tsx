
import React from 'react';
import { View, ProductReview } from '../types';
import { PRODUCT_CATEGORIES } from '../constants';
import ProductCard from '../components/ProductCard';

interface ProductCategoryPageProps {
    categoryId: number;
    setView: (view: View) => void;
    products: ProductReview[];
}

const ProductCategoryPage: React.FC<ProductCategoryPageProps> = ({ categoryId, setView, products }) => {
    const category = PRODUCT_CATEGORIES.find(c => c.id === categoryId);
    const productsInCategory = products.filter(p => p.categoryId === categoryId);

    if (!category) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold">Category not found.</h2>
                <button onClick={() => setView({ page: 'products' })} className="mt-4 text-teal-600 hover:underline">
                    &larr; Back to All Products
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                 <button
                    onClick={() => setView({ page: 'products' })}
                    className="mb-8 text-teal-600 hover:text-teal-800 font-semibold flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Product Categories
                </button>
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{category.name}</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">{category.description}</p>
                </div>

                {productsInCategory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {productsInCategory.map(product => (
                            <ProductCard key={product.id} product={product} setView={setView} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-gray-700">No Products Found</h2>
                        <p className="text-gray-500 mt-2">We haven't reviewed any products in this category yet. Please check back soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCategoryPage;