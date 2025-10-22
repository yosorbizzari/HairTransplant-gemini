import React from 'react';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import Directory from './views/Directory';
import ClinicDetail from './views/ClinicDetail';
import CityPage from './views/CityPage';
import AdminDashboard from './views/AdminDashboard';
import PricingPage from './views/PricingPage';
import Blog from './views/Blog';
import BlogDetail from './views/BlogDetail';
import Products from './views/Products';
import ProductDetail from './views/ProductDetail';
import ClaimListingPage from './views/ClaimListingPage';
import LoginPage from './views/LoginPage';
import WriteReviewPage from './views/WriteReviewPage';
import { View, Clinic, BlogPost, ProductReview, ClaimRequest, User, Review } from './types';
import { CLINICS, BLOG_POSTS, PRODUCT_REVIEWS, PENDING_CLAIMS, INITIAL_USERS, PENDING_REVIEWS } from './constants';

const App: React.FC = () => {
    const [view, setView] = useState<View>({ page: 'home' });
    const [clinics, setClinics] = useState<Clinic[]>(CLINICS);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);
    const [productReviews, setProductReviews] = useState<ProductReview[]>(PRODUCT_REVIEWS);
    const [pendingClaims, setPendingClaims] = useState<ClaimRequest[]>(PENDING_CLAIMS);
    
    // New state for user auth and review moderation
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [pendingReviews, setPendingReviews] = useState<Review[]>(PENDING_REVIEWS);
    const [loginRedirectView, setLoginRedirectView] = useState<View | null>(null);

    // Scroll to top on every view change for a smoother navigation experience
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
        setView(loginRedirectView || { page: 'home' });
        setLoginRedirectView(null);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView({ page: 'home' });
    };

    const handleSignUp = (username: string): { success: boolean; message: string; user?: User } => {
        const usernameExists = users.some(u => u.name.toLowerCase() === username.toLowerCase());
        if (usernameExists) {
            return { success: false, message: 'Username already taken. Please choose another.' };
        }
        const newUser: User = {
            id: Date.now(),
            name: username
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        return { success: true, message: 'Sign up successful!', user: newUser };
    };
    
    const requestLogin = (redirectView: View) => {
        setLoginRedirectView(redirectView);
        setView({ page: 'login' });
    };

    const handleSubmitReview = (reviewData: Omit<Review, 'id' | 'date' | 'status'>) => {
        const newReview: Review = {
            ...reviewData,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };
        setPendingReviews(prev => [newReview, ...prev]);
        alert('Thank you! Your review has been submitted for moderation.');
        setView({ page: 'clinic', params: { id: reviewData.clinicId }});
    };
    
    const handleApproveReview = (reviewId: number) => {
        const review = pendingReviews.find(r => r.id === reviewId);
        if (review) {
            const approvedReview = { ...review, status: 'approved' as const };
            setClinics(prevClinics => 
                prevClinics.map(c => 
                    c.id === review.clinicId 
                        ? { ...c, reviews: [approvedReview, ...c.reviews] } 
                        : c
                )
            );
            setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
        }
    };

    const handleDenyReview = (reviewId: number) => {
        setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
    };

    const handleSaveClinic = (clinicToSave: Clinic) => {
        const exists = clinics.some(c => c.id === clinicToSave.id);
        if (exists) {
            setClinics(clinics.map(c => c.id === clinicToSave.id ? clinicToSave : c));
        } else {
            setClinics([clinicToSave, ...clinics]);
        }
    };

    const handleSaveBlog = (blogToSave: BlogPost) => {
        const exists = blogPosts.some(b => b.id === blogToSave.id);
        if (exists) {
            setBlogPosts(blogPosts.map(b => b.id === blogToSave.id ? blogToSave : b));
        } else {
            setBlogPosts([blogToSave, ...blogPosts]);
        }
    };

    const handleSaveProduct = (productToSave: ProductReview) => {
        const exists = productReviews.some(p => p.id === productToSave.id);
        if (exists) {
            setProductReviews(productReviews.map(p => p.id === productToSave.id ? productToSave : p));
        } else {
            setProductReviews([productToSave, ...productReviews]);
        }
    };

    const handleDeleteBlog = (blogId: number) => {
        setBlogPosts(posts => posts.filter(p => p.id !== blogId));
    };

    const handleDeleteProduct = (productId: number) => {
        setProductReviews(reviews => reviews.filter(r => r.id !== productId));
    };

    const handleClaimSubmit = (claim: Omit<ClaimRequest, 'id' | 'status'>) => {
        const newClaim: ClaimRequest = {
            ...claim,
            id: Date.now(),
            status: 'pending'
        };
        setPendingClaims(prev => [newClaim, ...prev]);
        alert('Claim submitted for review!');
        setView({ page: 'clinic', params: { id: claim.clinicId } });
    };

    const handleApproveClaim = (claimId: number) => {
        const claim = pendingClaims.find(c => c.id === claimId);
        if (claim) {
            setClinics(prevClinics => 
                prevClinics.map(c => 
                    c.id === claim.clinicId ? { ...c, verified: true } : c
                )
            );
            setPendingClaims(prevClaims => prevClaims.filter(c => c.id !== claimId));
        }
    };
    
    const handleDenyClaim = (claimId: number) => {
        setPendingClaims(prevClaims => prevClaims.filter(c => c.id !== claimId));
    };

    const renderView = () => {
        switch (view.page) {
            case 'home':
                return <Home setView={setView} clinics={clinics} />;
            case 'directory':
                return <Directory setView={setView} initialFilters={view.params} clinics={clinics} />;
            case 'clinic':
                const clinic = clinics.find(c => c.id === view.params?.id);
                if (clinic) {
                    return <ClinicDetail clinic={clinic} setView={setView} currentUser={currentUser} requestLogin={requestLogin} users={users} />;
                }
                return <Directory setView={setView} clinics={clinics} />;
            case 'city':
                if (view.params?.cityName) {
                    return <CityPage cityName={view.params.cityName} setView={setView} clinics={clinics} />;
                }
                 return <Home setView={setView} clinics={clinics} />;
            case 'admin':
                return <AdminDashboard 
                    setView={setView} 
                    clinics={clinics} 
                    blogs={blogPosts} 
                    products={productReviews}
                    claims={pendingClaims}
                    pendingReviews={pendingReviews}
                    users={users}
                    onSaveClinic={handleSaveClinic} 
                    onSaveBlog={handleSaveBlog}
                    onSaveProduct={handleSaveProduct}
                    onDeleteBlog={handleDeleteBlog}
                    onDeleteProduct={handleDeleteProduct}
                    onApproveClaim={handleApproveClaim}
                    onDenyClaim={handleDenyClaim}
                    onApproveReview={handleApproveReview}
                    onDenyReview={handleDenyReview}
                />;
            case 'pricing':
                return <PricingPage setView={setView} />;
            case 'blog':
                return <Blog setView={setView} blogPosts={blogPosts} />;
            case 'blogDetail':
                const blogPost = blogPosts.find(p => p.id === view.params?.id);
                if (blogPost) {
                    return <BlogDetail blogPost={blogPost} setView={setView} />;
                }
                return <Blog setView={setView} blogPosts={blogPosts} />;
            case 'products':
                return <Products setView={setView} products={productReviews} />;
            case 'productDetail':
                const product = productReviews.find(p => p.id === view.params?.id);
                if (product) {
                    return <ProductDetail product={product} setView={setView} />;
                }
                return <Products setView={setView} products={productReviews} />;
            case 'claimListing':
                 const clinicToClaim = clinics.find(c => c.id === view.params?.id);
                 if (clinicToClaim) {
                     return <ClaimListingPage clinic={clinicToClaim} setView={setView} onClaimSubmit={handleClaimSubmit} />;
                 }
                 return <Directory setView={setView} clinics={clinics} />;
            case 'login':
                const reason = loginRedirectView 
                    ? 'You need to be logged in to leave a review.' 
                    : 'Log in to your account to continue.';
                return <LoginPage setView={setView} onLogin={handleLogin} onSignUp={handleSignUp} reason={reason} users={users} />;
            case 'writeReview':
                const clinicForReview = clinics.find(c => c.id === view.params?.clinicId);
                if (clinicForReview && currentUser) {
                    return <WriteReviewPage clinic={clinicForReview} user={currentUser} setView={setView} onSubmitReview={handleSubmitReview} />;
                }
                // If not logged in when trying to write a review, the requestLogin function will handle the redirect.
                // This is a fallback.
                return <Directory setView={setView} clinics={clinics} />;
            default:
                return <Home setView={setView} clinics={clinics} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header setView={setView} currentUser={currentUser} onLogout={handleLogout} />
            <main className="flex-grow">
                {renderView()}
            </main>
            <Footer />
        </div>
    );
};

export default App;