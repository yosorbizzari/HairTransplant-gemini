
import React from 'react';
import { View, BlogPost } from '../types';
import BlogCard from '../components/BlogCard';

interface BlogProps {
    setView: (view: View) => void;
    blogPosts: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ setView, blogPosts }) => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Transplantify Blog</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Expert insights, patient guides, and the latest news in hair restoration.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map(post => (
                        <BlogCard key={post.id} post={post} setView={setView} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;