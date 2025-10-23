import React, { useState, useMemo } from 'react';
import { CITIES, TREATMENTS } from '../constants';
import { Clinic, View, Tier, BlogPost, ProductReview, ClaimRequest, Review, User, NewsletterSubscriber } from '../types';
import { getReviewResponse, getOptimizedContent } from '../services/geminiService';
import ImageInput from '../components/ImageInput';
import ClinicEditor from '../components/ClinicEditor';

interface AdminDashboardProps {
    setView: (view: View) => void;
    clinics: Clinic[];
    blogs: BlogPost[];
    products: ProductReview[];
    claims: ClaimRequest[];
    pendingReviews: Review[];
    users: User[];
    subscribers: NewsletterSubscriber[];
    onSaveClinic: (clinic: Clinic) => void;
    onSaveBlog: (blog: BlogPost) => void;
    onSaveProduct: (product: ProductReview) => void;
    onDeleteBlog: (id: number) => void;
    onDeleteProduct: (id: number) => void;
    onApproveClaim: (id: number) => void;
    onDenyClaim: (id: number) => void;
    onApproveReview: (id: number) => void;
    onDenyReview: (id: number) => void;
    isSaving: boolean;
}

const AITool: React.FC<{ title: string; description: string; inputLabel: string; buttonText: string; onGenerate: (input: string) => Promise<string>; }> = ({ title, description, inputLabel, buttonText, onGenerate }) => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        setOutput('');
        const result = await onGenerate(input);
        setOutput(result);
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputLabel}
                className="w-full p-2 border border-gray-300 rounded-md h-32 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400"
            >
                {isLoading ? 'Generating...' : buttonText}
            </button>
            {isLoading && <div className="mt-4 text-center">Loading...</div>}
            {output && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md border">
                    <h4 className="font-semibold mb-2">Generated Output:</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{output}</p>
                </div>
            )}
        </div>
    );
};


// Blog Form Component
const BlogEditor: React.FC<{ blog: BlogPost | 'new', onSave: (blog: BlogPost) => void, onCancel: () => void }> = ({ blog, onSave, onCancel }) => {
    const isNew = blog === 'new';
    const [formData, setFormData] = useState(isNew ? {
        title: '', author: '', date: new Date().toISOString().split('T')[0], summary: '', content: '', imageUrl: ''
    } : { ...blog });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: isNew ? Date.now() : (blog as BlogPost).id } as BlogPost);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-2xl font-bold mb-6">{isNew ? 'Add New Blog Post' : 'Edit Blog Post'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Blog Title" className="p-2 border rounded md:col-span-2 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                </div>
                <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <ImageInput 
                    label="Blog Post Image"
                    currentImageUrl={formData.imageUrl}
                    onImageUrlChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                />
                <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Summary" className="p-2 border rounded w-full h-24 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Full Content (use \n for new paragraphs)" className="p-2 border rounded w-full h-48 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Save Post</button>
                </div>
            </form>
        </div>
    );
};

// Product Form Component
const ProductEditor: React.FC<{ product: ProductReview | 'new', onSave: (product: ProductReview) => void, onCancel: () => void }> = ({ product, onSave, onCancel }) => {
    const isNew = product === 'new';
    const [formData, setFormData] = useState(isNew ? {
        name: '', rating: 4.5, summary: '', fullReview: '', affiliateLink: '', imageUrl: '', categoryId: 1
    } : { ...product });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'rating' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: isNew ? Date.now() : (product as ProductReview).id } as ProductReview);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-2xl font-bold mb-6">{isNew ? 'Add New Product Review' : `Editing: ${formData.name}`}</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="p-2 border rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                
                <input type="number" step="0.1" min="1" max="5" name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating (1.0 - 5.0)" className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <div></div>
                
                <input name="affiliateLink" value={formData.affiliateLink} onChange={handleChange} placeholder="Affiliate Link" className="p-2 border rounded col-span-2 focus:outline-none focus:ring-2 focus:ring-teal-500" required/>
                
                <ImageInput 
                    label="Product Image"
                    currentImageUrl={formData.imageUrl}
                    onImageUrlChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                />

                <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Summary" className="p-2 border rounded col-span-2 h-24 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                <textarea name="fullReview" value={formData.fullReview} onChange={handleChange} placeholder="Full Review (use \n for new paragraphs)" className="p-2 border rounded col-span-2 h-48 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                
                <div className="col-span-2 flex justify-end space-x-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Save Product</button>
                </div>
            </form>
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ setView, clinics, blogs, products, claims, pendingReviews, users, subscribers, onSaveClinic, onSaveBlog, onSaveProduct, onDeleteBlog, onDeleteProduct, onApproveClaim, onDenyClaim, onApproveReview, onDenyReview, isSaving }) => {
    const [activeTab, setActiveTab] = useState('claims');
    const [editingClinic, setEditingClinic] = useState<Clinic | 'new' | null>(null);
    const [editingBlog, setEditingBlog] = useState<BlogPost | 'new' | null>(null);
    const [editingProduct, setEditingProduct] = useState<ProductReview | 'new' | null>(null);

    // Clinic Filters
    const [cityFilter, setCityFilter] = useState('All');
    const [tierFilter, setTierFilter] = useState('All');

    const filteredClinics = useMemo(() => {
        return clinics.filter(clinic => {
            const matchesCity = cityFilter === 'All' || clinic.city === cityFilter;
            const matchesTier = tierFilter === 'All' || clinic.tier === tierFilter;
            return matchesCity && matchesTier;
        });
    }, [clinics, cityFilter, tierFilter]);


    const handleSaveClinic = (clinicToSave: Clinic) => {
        onSaveClinic(clinicToSave);
        setEditingClinic(null);
    };

    const handleSaveBlog = (blogToSave: BlogPost) => {
        onSaveBlog(blogToSave);
        setEditingBlog(null);
    };

     const handleSaveProduct = (productToSave: ProductReview) => {
        onSaveProduct(productToSave);
        setEditingProduct(null);
    };

    const handleDeleteBlog = (id: number) => {
        if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
            onDeleteBlog(id);
        }
    };
    
    const handleDeleteProduct = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product review? This action cannot be undone.')) {
            onDeleteProduct(id);
        }
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'claims':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Pending Claims</h2>
                        {claims.length > 0 ? (
                            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {claims.map(claim => (
                                            <tr key={claim.id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium">{claim.clinicName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>{claim.submitterName} ({claim.submitterTitle})</div>
                                                    <div className="text-sm text-gray-500">{claim.submitterEmail}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {claim.verificationMethod === 'email' ? (
                                                        <span className="text-sm">Business Email</span>
                                                    ) : (
                                                        <a href={claim.documentProof} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:underline font-semibold">View Document</a>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                                    <button onClick={() => onApproveClaim(claim.id)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                                                    <button onClick={() => onDenyClaim(claim.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Deny</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">No pending claims to review.</p>
                        )}
                    </div>
                );
            case 'reviews':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Pending Reviews</h2>
                        {pendingReviews.length > 0 ? (
                            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pendingReviews.map(review => (
                                            <tr key={review.id}>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium">{clinics.find(c => c.id === review.clinicId)?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{users.find(u => u.uid === review.userId)?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{review.rating} ★</td>
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-sm truncate">{review.comment}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                                    <button onClick={() => onApproveReview(review.id)} className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">Approve</button>
                                                    <button onClick={() => onDenyReview(review.id)} className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">Deny</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-600">No pending reviews to moderate.</p>
                        )}
                    </div>
                );
            case 'clinics':
                return editingClinic ? (
                    <ClinicEditor clinic={editingClinic} onSave={handleSaveClinic} onCancel={() => setEditingClinic(null)} mode="admin" isSaving={isSaving} />
                ) : (
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold">Manage Clinics</h2>
                            <div className="flex items-center gap-4">
                                <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="p-2 border rounded">
                                    <option value="All">All Cities</option>
                                    {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                </select>
                                <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} className="p-2 border rounded">
                                    <option value="All">All Tiers</option>
                                    {Object.values(Tier).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <button onClick={() => setEditingClinic('new')} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 whitespace-nowrap">Add New Clinic</button>
                            </div>
                        </div>
                        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredClinics.map(clinic => (
                                        <tr key={clinic.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{clinic.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{clinic.city}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    clinic.tier === Tier.GOLD ? 'bg-amber-100 text-amber-800' :
                                                    clinic.tier === Tier.PREMIUM ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {clinic.tier}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${clinic.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {clinic.verified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => setEditingClinic(clinic)} className="text-teal-600 hover:text-teal-900">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'blogs':
                 return editingBlog ? (
                    <BlogEditor blog={editingBlog} onSave={handleSaveBlog} onCancel={() => setEditingBlog(null)} />
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Manage Blogs</h2>
                            <button onClick={() => setEditingBlog('new')} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Add New Post</button>
                        </div>
                         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {blogs.map(blog => (
                                        <tr key={blog.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">{blog.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{blog.author}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{blog.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => setEditingBlog(blog)} className="text-teal-600 hover:text-teal-900">Edit</button>
                                                <button onClick={() => handleDeleteBlog(blog.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'products':
                 return editingProduct ? (
                    <ProductEditor product={editingProduct} onSave={handleSaveProduct} onCancel={() => setEditingProduct(null)} />
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Manage Product Reviews</h2>
                            <button onClick={() => setEditingProduct('new')} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">Add New Product</button>
                        </div>
                         <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map(product => (
                                        <tr key={product.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">{product.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{product.rating.toFixed(1)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button onClick={() => setEditingProduct(product)} className="text-teal-600 hover:text-teal-900">Edit</button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'subscribers':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Newsletter Subscribers</h2>
                        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {subscribers.map(sub => (
                                        <tr key={sub.id}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">{sub.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{sub.subscribedAt}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'ai-tools':
                return (
                     <div>
                        <h2 className="text-2xl font-bold mb-4">AI Assistant Tools</h2>
                        <p className="text-gray-600 mb-6">Powered by Gemini. Available for Gold Tier clinics.</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           <AITool
                                title="Review Assistant"
                                description="Paste a negative patient review and get a professional, empathetic response drafted for you."
                                inputLabel="Paste patient review here..."
                                buttonText="Generate Response"
                                onGenerate={getReviewResponse}
                           />
                           <AITool
                                title="Content Optimizer"
                                description="Paste your clinic's description to get an improved version that is more compelling to potential patients."
                                inputLabel="Paste clinic description here..."
                                buttonText="Optimize Content"
                                onGenerate={getOptimizedContent}
                           />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const TabButton = ({ id, label, count }: { id: string; label: string, count?: number }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === id
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label}
            {count && count > 0 ? (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">
                    {count}
                </span>
            ) : null}
        </button>
    );

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-extrabold mb-8">Admin Dashboard</h1>
                <div className="flex flex-wrap gap-2 border-b mb-8 pb-2">
                    <TabButton id="claims" label="Pending Claims" count={claims.length} />
                    <TabButton id="reviews" label="Pending Reviews" count={pendingReviews.length} />
                    <TabButton id="clinics" label="Manage Clinics" />
                    <TabButton id="blogs" label="Manage Blogs" />
                    <TabButton id="products" label="Manage Products" />
                    <TabButton id="subscribers" label="Subscribers" />
                    <TabButton id="ai-tools" label="AI Tools" />
                </div>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default AdminDashboard;