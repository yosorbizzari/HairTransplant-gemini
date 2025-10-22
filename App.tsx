
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
import MetaTagManager from './components/MetaTagManager';
import Schema from './components/Schema';
import Breadcrumbs from './components/Breadcrumbs';
import { View, Clinic, BlogPost, ProductReview, ClaimRequest, User, Review, Breadcrumb } from './types';
import { firebaseService } from './services/firebaseService';


const App: React.FC = () => {
    const [view, setView] = useState<View>({ page: 'home' });
    const [isLoading, setIsLoading] = useState(true);
    
    // Data state
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
    const [pendingClaims, setPendingClaims] = useState<ClaimRequest[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
    
    // Auth state
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loginRedirectView, setLoginRedirectView] = useState<View | null>(null);

    // Initial data fetch
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const data = await firebaseService.getInitialData();
                setClinics(data.clinics);
                setBlogPosts(data.blogPosts);
                setProductReviews(data.productReviews);
                setPendingClaims(data.pendingClaims);
                setUsers(data.users);
                setPendingReviews(data.pendingReviews);
                setCurrentUser(data.currentUser);
            } catch (error) {
                console.error("Failed to load initial data:", error);
                // Handle error state in UI
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Scroll to top on every view change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [view]);

    // SEO DATA GENERATION
    const getPageData = () => {
        const siteUrl = "https://transplantify.example.com";
        const defaultTitle = "Transplantify | Your Trusted Hair Transplant Directory";
        const defaultDescription = "Discover top-rated, verified hair transplant clinics in leading destinations worldwide. Read reviews, compare prices, and find your perfect clinic.";
        
        let title = defaultTitle;
        let description = defaultDescription;
        let breadcrumbs: Breadcrumb[] = [{ name: 'Home', view: { page: 'home' } }];
        let schema: any = { "@context": "https://schema.org", "@type": "WebSite", "url": siteUrl, "name": "Transplantify", "description": defaultDescription };

        switch (view.page) {
            case 'directory':
                title = `Clinic Directory | ${defaultTitle}`;
                description = `Browse our full directory of verified hair transplant clinics. Filter by city, country, and treatment to find the best option for you.`;
                breadcrumbs.push({ name: 'Clinics', view });
                schema = { ...schema, "@type": "WebPage", "name": title, "description": description };
                break;
            case 'clinic':
                const clinic = clinics.find(c => c.id === view.params?.id);
                if (clinic) {
                    title = `${clinic.name} | Reviews & Pricing in ${clinic.city}`;
                    description = `Read patient reviews, view pricing, and learn about treatments offered at ${clinic.name}, a leading hair transplant clinic in ${clinic.city}, ${clinic.country}.`;
                    breadcrumbs.push(
                        { name: 'Clinics', view: { page: 'directory' } },
                        { name: clinic.city, view: { page: 'city', params: { cityName: clinic.city } } },
                        { name: clinic.name, view }
                    );
                    const approvedReviews = clinic.reviews.filter(r => r.status === 'approved');
                    schema = {
                        "@context": "https://schema.org", "@type": "MedicalClinic", "name": clinic.name, "description": clinic.longDescription, "url": `${siteUrl}/clinics/${clinic.city.toLowerCase().replace(/ /g, '-')}/${clinic.id}`, "image": clinic.imageUrl, "telephone": clinic.contact.phone,
                        "address": { "@type": "PostalAddress", "streetAddress": clinic.address, "addressLocality": clinic.city, "addressCountry": clinic.country },
                        "geo": { "@type": "GeoCoordinates", "latitude": clinic.latitude, "longitude": clinic.longitude },
                        ...(approvedReviews.length > 0 && {
                            "aggregateRating": { "@type": "AggregateRating", "ratingValue": clinic.rating.toFixed(1), "reviewCount": clinic.reviewCount },
                            "review": approvedReviews.map(r => ({
                                "@type": "Review", "reviewRating": { "@type": "Rating", "ratingValue": r.rating },
                                "author": { "@type": "Person", "name": r.isAnonymous ? "Anonymous Patient" : users.find(u => u.uid === r.userId)?.name || "A Patient" },
                                "reviewBody": r.comment, "datePublished": r.date
                            }))
                        })
                    };
                }
                break;
            case 'city':
                const cityName = view.params?.cityName;
                if (cityName) {
                    title = `Best Hair Transplant Clinics in ${cityName} | Transplantify`;
                    description = `Discover and compare top-rated hair transplant clinics in ${cityName}. View locations, services, and find the best hair restoration experts.`;
                    breadcrumbs.push({ name: 'Clinics', view: { page: 'directory' } }, { name: cityName, view });
                    schema = { ...schema, "@type": "WebPage", "name": title, "description": description };
                }
                break;
            case 'blog':
                title = `Hair Transplant Blog | Expert Guides & Tips | Transplantify`;
                description = `Read our expert blog for guides on FUE, DHI, medical tourism, and tips for a successful hair restoration journey.`;
                breadcrumbs.push({ name: 'Blog', view });
                schema = { ...schema, "@type": "WebPage", "name": title, "description": description };
                break;
            case 'blogDetail':
                const blogPost = blogPosts.find(p => p.id === view.params?.id);
                if (blogPost) {
                    title = `${blogPost.title} | Transplantify Blog`;
                    description = blogPost.summary;
                    breadcrumbs.push({ name: 'Blog', view: { page: 'blog' } }, { name: blogPost.title, view });
                    schema = {
                        "@context": "https://schema.org", "@type": "BlogPosting", "headline": blogPost.title, "author": { "@type": "Person", "name": blogPost.author }, "datePublished": blogPost.date, "image": blogPost.imageUrl, "articleBody": blogPost.content,
                        "publisher": { "@type": "Organization", "name": "Transplantify", "logo": { "@type": "ImageObject", "url": `${siteUrl}/logo.png` } }
                    }
                }
                break;
            case 'products':
                title = `Recommended Hair Growth Products | Transplantify`;
                description = `Expert reviews of the best products for hair health, regrowth, and post-transplant care. We've curated the top selections.`;
                breadcrumbs.push({ name: 'Products', view });
                schema = { ...schema, "@type": "WebPage", "name": title, "description": description };
                break;
            case 'productDetail':
                const product = productReviews.find(p => p.id === view.params?.id);
                if (product) {
                    title = `${product.name} Review | Transplantify`;
                    description = product.summary;
                    breadcrumbs.push({ name: 'Products', view: { page: 'products' } }, { name: product.name, view });
                    schema = {
                        "@context": "https://schema.org", "@type": "Product", "name": product.name, "description": product.summary, "image": product.imageUrl,
                        "review": { "@type": "Review", "reviewBody": product.fullReview, "author": { "@type": "Organization", "name": "Transplantify" } },
                        "aggregateRating": { "@type": "AggregateRating", "ratingValue": product.rating.toFixed(1), "reviewCount": "1" }
                    };
                }
                break;
        }

        if (breadcrumbs.length > 1) {
            const breadcrumbSchema = {
                "@context": "https://schema.org", "@type": "BreadcrumbList",
                "itemListElement": breadcrumbs.map((crumb, index) => ({
                    "@type": "ListItem", "position": index + 1, "name": crumb.name, "item": `${siteUrl}/${crumb.view.page}${crumb.view.params ? `/${Object.values(crumb.view.params)[0]}` : ''}`
                }))
            };
            if (typeof schema === 'object' && schema !== null && !Array.isArray(schema)) {
                schema = [schema, breadcrumbSchema];
            } else {
                schema = breadcrumbSchema;
            }
        }
        
        return { title, description, breadcrumbs, schema };
    };

    const pageData = getPageData();

    // --- ASYNC HANDLERS ---
    const handleLogin = async (email: string, pass: string) => {
        try {
            const user = await firebaseService.login(email, pass);
            setCurrentUser(user);
            setView(loginRedirectView || { page: 'home' });
            setLoginRedirectView(null);
            return { success: true, message: 'Login successful!' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    };

    const handleLogout = async () => {
        await firebaseService.logout();
        setCurrentUser(null);
        setView({ page: 'home' });
    };

    const handleSignUp = async (name: string, email: string, pass: string) => {
        try {
            const newUser = await firebaseService.signUp(name, email, pass);
            setUsers(prev => [...prev, newUser]);
            setCurrentUser(newUser); // Auto-login after successful sign up
            setView(loginRedirectView || { page: 'home' });
            setLoginRedirectView(null);
            return { success: true, message: 'Sign up successful!' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    };
    
    const requestLogin = (redirectView: View) => {
        setLoginRedirectView(redirectView);
        setView({ page: 'login' });
    };

    const handleSubmitReview = async (reviewData: Omit<Review, 'id' | 'date' | 'status'>) => {
        try {
            const newReview = await firebaseService.submitReview(reviewData);
            setPendingReviews(prev => [newReview, ...prev]);
            alert('Thank you! Your review has been submitted for moderation.');
            setView({ page: 'clinic', params: { id: reviewData.clinicId }});
        } catch (error) {
            alert('There was an error submitting your review. Please try again.');
        }
    };
    
    const handleApproveReview = async (reviewId: number) => {
        try {
            const approvedReview = await firebaseService.approveReview(reviewId);
            setClinics(prevClinics => 
                prevClinics.map(c => 
                    c.id === approvedReview.clinicId 
                        ? { ...c, reviews: [approvedReview, ...c.reviews] } 
                        : c
                )
            );
            setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch (error) {
            alert('Failed to approve review.');
        }
    };

    const handleDenyReview = async (reviewId: number) => {
        try {
            await firebaseService.deleteReview(reviewId);
            setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
        } catch(error) {
            alert('Failed to deny review.');
        }
    };

    const handleSaveClinic = async (clinicToSave: Clinic) => {
        const savedClinic = await firebaseService.saveClinic(clinicToSave);
        const exists = clinics.some(c => c.id === savedClinic.id);
        if (exists) {
            setClinics(clinics.map(c => c.id === savedClinic.id ? savedClinic : c));
        } else {
            setClinics([savedClinic, ...clinics]);
        }
    };

    const handleSaveBlog = async (blogToSave: BlogPost) => {
        const savedBlog = await firebaseService.saveBlogPost(blogToSave);
        const exists = blogPosts.some(b => b.id === savedBlog.id);
        if (exists) {
            setBlogPosts(blogPosts.map(b => b.id === savedBlog.id ? savedBlog : b));
        } else {
            setBlogPosts([savedBlog, ...blogPosts]);
        }
    };

    const handleSaveProduct = async (productToSave: ProductReview) => {
        const savedProduct = await firebaseService.saveProductReview(productToSave);
        const exists = productReviews.some(p => p.id === savedProduct.id);
        if (exists) {
            setProductReviews(productReviews.map(p => p.id === savedProduct.id ? savedProduct : p));
        } else {
            setProductReviews([savedProduct, ...productReviews]);
        }
    };

    const handleDeleteBlog = async (blogId: number) => {
        await firebaseService.deleteBlog(blogId);
        setBlogPosts(posts => posts.filter(p => p.id !== blogId));
    };

    const handleDeleteProduct = async (productId: number) => {
        await firebaseService.deleteProduct(productId);
        setProductReviews(reviews => reviews.filter(r => r.id !== productId));
    };

    const handleClaimSubmit = async (claim: Omit<ClaimRequest, 'id' | 'status'>) => {
        const newClaim = await firebaseService.submitClaim(claim);
        setPendingClaims(prev => [newClaim, ...prev]);
        alert('Claim submitted for review!');
        setView({ page: 'clinic', params: { id: claim.clinicId } });
    };

    const handleApproveClaim = async (claimId: number) => {
        const updatedClinicId = await firebaseService.approveClaim(claimId);
        if (updatedClinicId) {
            setClinics(prevClinics => 
                prevClinics.map(c => 
                    c.id === updatedClinicId ? { ...c, verified: true } : c
                )
            );
            setPendingClaims(prevClaims => prevClaims.filter(c => c.id !== claimId));
        }
    };
    
    const handleDenyClaim = async (claimId: number) => {
        await firebaseService.deleteClaim(claimId);
        setPendingClaims(prevClaims => prevClaims.filter(c => c.id !== claimId));
    };

    const renderView = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-2xl font-semibold">Loading Directory...</div>
                </div>
            );
        }

        const showBreadcrumbs = ['clinic', 'city', 'blogDetail', 'productDetail'].includes(view.page);
        
        const mainContent = () => {
            switch (view.page) {
                case 'home': return <Home setView={setView} clinics={clinics} />;
                case 'directory': return <Directory setView={setView} initialFilters={view.params} clinics={clinics} />;
                case 'clinic':
                    const clinic = clinics.find(c => c.id === view.params?.id);
                    if (clinic) return <ClinicDetail clinic={clinic} setView={setView} currentUser={currentUser} requestLogin={requestLogin} users={users} />;
                    return <Directory setView={setView} clinics={clinics} />;
                case 'city':
                    if (view.params?.cityName) return <CityPage cityName={view.params.cityName} setView={setView} clinics={clinics} />;
                    return <Home setView={setView} clinics={clinics} />;
                case 'admin':
                    return <AdminDashboard 
                        setView={setView} clinics={clinics} blogs={blogPosts} products={productReviews} claims={pendingClaims} pendingReviews={pendingReviews} users={users}
                        onSaveClinic={handleSaveClinic} onSaveBlog={handleSaveBlog} onSaveProduct={handleSaveProduct} onDeleteBlog={handleDeleteBlog} onDeleteProduct={handleDeleteProduct}
                        onApproveClaim={handleApproveClaim} onDenyClaim={handleDenyClaim} onApproveReview={handleApproveReview} onDenyReview={handleDenyReview}
                    />;
                case 'pricing': return <PricingPage setView={setView} />;
                case 'blog': return <Blog setView={setView} blogPosts={blogPosts} />;
                case 'blogDetail':
                    const blogPost = blogPosts.find(p => p.id === view.params?.id);
                    if (blogPost) return <BlogDetail blogPost={blogPost} setView={setView} />;
                    return <Blog setView={setView} blogPosts={blogPosts} />;
                case 'products': return <Products setView={setView} products={productReviews} />;
                case 'productDetail':
                    const product = productReviews.find(p => p.id === view.params?.id);
                    if (product) return <ProductDetail product={product} setView={setView} />;
                    return <Products setView={setView} products={productReviews} />;
                case 'claimListing':
                     const clinicToClaim = clinics.find(c => c.id === view.params?.id);
                     if (clinicToClaim) return <ClaimListingPage clinic={clinicToClaim} setView={setView} onClaimSubmit={handleClaimSubmit} />;
                     return <Directory setView={setView} clinics={clinics} />;
                case 'login':
                    const reason = loginRedirectView ? 'You need to be logged in to leave a review.' : 'Log in to your account to continue.';
                    return <LoginPage setView={setView} onLogin={handleLogin} onSignUp={handleSignUp} reason={reason} />;
                case 'writeReview':
                    const clinicForReview = clinics.find(c => c.id === view.params?.clinicId);
                    if (clinicForReview && currentUser) return <WriteReviewPage clinic={clinicForReview} user={currentUser} setView={setView} onSubmitReview={handleSubmitReview} />;
                    return <Directory setView={setView} clinics={clinics} />;
                default:
                    return <Home setView={setView} clinics={clinics} />;
            }
        };

        return (
            <div className="flex flex-col">
                {showBreadcrumbs && <Breadcrumbs crumbs={pageData.breadcrumbs} setView={setView} />}
                {mainContent()}
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            <MetaTagManager title={pageData.title} description={pageData.description} />
            <Schema data={pageData.schema} />
            <Header setView={setView} currentUser={currentUser} onLogout={handleLogout} />
            <main className="flex-grow">
                {renderView()}
            </main>
            <Footer />
        </div>
    );
};

export default App;