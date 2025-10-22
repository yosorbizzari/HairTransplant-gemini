
import React from 'react';
import { BlogPost, View } from '../types';

interface BlogCardProps {
    post: BlogPost;
    setView: (view: View) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, setView }) => {
    return (
        <div 
            className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer group"
            onClick={() => setView({ page: 'blogDetail', params: { id: post.id } })}
        >
            <div className="overflow-hidden">
                <img className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300" src={post.imageUrl} alt={post.title} />
            </div>
            <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date} &bull; {post.author}</p>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">{post.title}</h3>
                <p className="text-gray-700 mb-6 line-clamp-3">{post.summary}</p>
                <span className="font-semibold text-teal-600 group-hover:underline">
                    Read More &rarr;
                </span>
            </div>
        </div>
    );
};

export default BlogCard;
