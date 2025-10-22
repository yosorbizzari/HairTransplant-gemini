
import React from 'react';
import { BlogPost, View } from '../types';

interface BlogDetailProps {
    blogPost: BlogPost;
    setView: (view: View) => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blogPost, setView }) => {
    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-6">
                <button
                    onClick={() => setView({ page: 'blog' })}
                    className="mb-8 text-teal-600 hover:text-teal-800 font-semibold flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Blog
                </button>

                <article className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">{blogPost.title}</h1>
                    <p className="mt-4 text-lg text-gray-500">By {blogPost.author} on {blogPost.date}</p>
                    
                    <img src={blogPost.imageUrl} alt={blogPost.title} className="w-full h-96 object-cover rounded-xl shadow-lg my-8" />
                    
                    <div 
                        className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: blogPost.content.replace(/\n/g, '<br /><br />') }}
                    />
                </article>
            </div>
        </div>
    );
};

export default BlogDetail;
