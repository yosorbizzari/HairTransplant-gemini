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

    // SEO DATA GENERATION
    const getPageData = () => {
        const siteUrl = "https://hairdirect.example.com"; // Replace with your actual domain
        const defaultTitle = "HairDirect | Your Trusted Hair Transplant Directory";
        const defaultDescription = "Discover top-rated, verified hair transplant clinics in leading destinations worldwide. Read reviews, compare prices, and find your perfect clinic.";
        
        let title = defaultTitle;
        let description = defaultDescription;
        let breadcrumbs: Breadcrumb[] = [{ name: 'Home', view: { page: 'home' } }];
        let schema: any = {
             "@context": "https://schema.org",
             "@type": "WebSite",
             "url": siteUrl,
             "name": "HairDirect",
             "description": defaultDescription,
        };

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
                        "@context": "https://schema.org",
                        "@type": "MedicalClinic",
                        "name": clinic.name,
                        "description": clinic.longDescription,
                        "url": `${siteUrl}/clinics/${clinic.city.toLowerCase().replace(/ /g, '-')}/${clinic.id}`,
                        "image": clinic.imageUrl,
                        "telephone": clinic.contact.phone,
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": clinic.address,
                            "addressLocality": clinic.city,
                            "addressCountry": clinic.country
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": clinic.latitude,
                            "longitude": clinic.longitude
                        },
                        ...(approvedReviews.length > 0 && {
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": clinic.rating.toFixed(1),
                                "reviewCount": clinic.reviewCount
                            },
                            "review": approvedReviews.map(r => ({
                                "@type": "Review",
                                "reviewRating": {
                                    "@type": "Rating",
                                    "ratingValue": r.rating
                                },
                                "author": {
                                    "@type": "Person",
                                    "name": r.isAnonymous ? "Anonymous Patient" : users.find(u => u.id === r.userId)?.name || "A Patient"
                                },
                                "reviewBody": r.comment,
                                "datePublished": r.date
                            }))
                        })
                    };
                }
                break;
            
            case 'city':
                const cityName = view.params?.cityName;
                if (cityName) {
                    title = `Best Hair Transplant Clinics in ${cityName} | HairDirect`;
                    description = `Discover and compare top-rated hair transplant clinics in ${cityName}. View locations, services, and find the best hair restoration experts.`;
                    breadcrumbs.push(
                        { name: 'Clinics', view: { page: 'directory' } },
                        { name: cityName, view }
                    );
                    schema = { ...schema, "@type": "WebPage", "name": title, "description": description };
                }
                break;
            
            case 'blog':
                title = `Hair Transplant Blog | Expert Guides & Tips | HairDirect`;
                description = `Read our expert blog for guides on FUE, DHI, medical tourism, and tips for a successful hair restoration journey.`;
                breadcrumbs.push({ name: 'Blog', view });
                schema = { ...schema, "@type": "WebPage", "name": title, "description": description };
                break;
            
            case 'blogDetail':
                const blogPost = blogPosts.find(p => p.id === view.params?.id);
                if (blogPost) {
                    title = `${blogPost.title} | HairDirect Blog`;
                    description = blogPost.summary;
                    breadcrumbs.push(
                        { name: 'Blog', view: { page: 'blog' } },
                        { name: blogPost.title, view }
                    );
                    schema = {
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": blogPost.title,
                        "author": {
                            "@type": "Person",
                            "name": blogPost.author
                        },
                        "datePublished": blogPost.date,
                        "image": blogPost.imageUrl,
                        "articleBody": blogPost.content,
                        "publisher": {
                            "@type": "Organization",
                            "name": "HairDirect",
                            "logo": {
                                "@type": "ImageObject",
                                "url": `${siteUrl}/logo.png`
                            }
                        }
                    }
                }
                break;
            
            case 'products':
                title = `Recommended Hair Growth Products | HairDirect`;
                description = `Expert reviews of the best products for hair health, regrowth, and post-transplant care. We've curated the top selections.`;
                breadcrumbs.push({ name: 'Products', view });
                schema = { ...schema, "@type": "WebPage", "name": title, "description": description };
                break;

            case 'productDetail':
                const product = productReviews.find(p => p.id === view.params?.id);
                if (product) {
                    title = `${product.name} Review | HairDirect`;
                    description = product.summary;
                    breadcrumbs.push(
                        { name: 'Products', view: { page: 'products' } },
                        { name: product.name, view }
                    );
                     schema = {
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": product.name,
                        "description": product.summary,
                        "image": product.imageUrl,
                        "review": {
                            "@type": "Review",
                            "reviewBody": product.fullReview,
                            "author": {
                                "@type": "Organization",
                                "name": "HairDirect"
                            }
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": product.rating.toFixed(1),
                            "reviewCount": "1" // Represents our single expert review
                        }
                    };
                }
                break;
        }

        // Add breadcrumb schema if we have more than just home
        if (breadcrumbs.length > 1) {
            const breadcrumbSchema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbs.map((crumb, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": crumb.name,
                    "item": `${siteUrl}/${crumb.view.page}${crumb.view.params ? `/${Object.values(crumb.view.params)[0]}` : ''}`
                }))
            };
            // If main schema is an object, merge them.
            if (typeof schema === 'object' && schema !== null && !Array.isArray(schema)) {
                schema = [schema, breadcrumbSchema];
            } else {
                schema = breadcrumbSchema;
            }
        }
        
        return { title, description, breadcrumbs, schema };
    };

    const pageData = getPageData();

    // --- HANDLERS ---
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
        const showBreadcrumbs = ['clinic', 'city', 'blogDetail', 'productDetail'].includes(view.page);
        
        const mainContent = () => {
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