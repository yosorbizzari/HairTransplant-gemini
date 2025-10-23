
import React from 'react';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import Directory from './views/Directory';
import ClinicDetail from './views/ClinicDetail';
import CityPage from './views/CityPage';
import AdminDashboard from './views/AdminDashboard';
import ClinicDashboard from './views/ClinicDashboard';
import PatientDashboard from './views/PatientDashboard';
import PricingPage from './views/PricingPage';
import AiConciergePage from './views/AiConciergePage';
import AiConciergeCheckoutPage from './views/AiConciergeCheckoutPage';
import Blog from './views/Blog';
import BlogDetail from './views/BlogDetail';
import Products from './views/Products';
import ProductDetail from './views/ProductDetail';
import ClaimListingPage from './views/ClaimListingPage';
import SubmitListingPage from './views/SubmitListingPage';
import LoginPage from './views/LoginPage';
import WriteReviewPage from './views/WriteReviewPage';
import CheckoutPage from './views/CheckoutPage';
import AboutUsPage from './views/AboutUsPage';
import ContactPage from './views/ContactPage';
import PrivacyPolicyPage from './views/PrivacyPolicyPage';
import TermsOfServicePage from './views/TermsOfServicePage';
import MetaTagManager from './components/MetaTagManager';
import Schema from './components/Schema';
import Breadcrumbs from './components/Breadcrumbs';
import NewsletterModal from './components/NewsletterModal';
import { View, Clinic, BlogPost, ProductReview, ClaimRequest, User, Review, Breadcrumb, NewsletterSubscriber, Tier, ListingSubmission, JournalEntry } from './types';
import { firebaseService } from './services/firebaseService';


const App: React.FC = () => {
    const [view, setView] = useState<View>({ page: 'home' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // Data state
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
    const [pendingClaims, setPendingClaims] = useState<ClaimRequest[]>([]);
    const [pendingSubmissions, setPendingSubmissions] = useState<ListingSubmission[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
    
    // Auth state
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loginRedirectView, setLoginRedirectView] = useState<View | null>(null);

    // UI State
    const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

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
                setPendingSubmissions(data.pendingSubmissions);
                setUsers(data.users);
                setPendingReviews(data.pendingReviews);
                setCurrentUser(data.currentUser);
                setSubscribers(data.newsletterSubscribers);
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
            case 'aiConcierge':
                 title = `AI Patient Concierge for Clinics | Transplantify`;
                 description = `Automate your patient inquiries and booking process with a custom-trained AI receptionist. Capture every lead, 24/7.`;
                 breadcrumbs.push({ name: 'For Clinics', view: { page: 'pricing' } }, { name: 'AI Concierge', view });
                 schema = { ...schema, "@type": "WebPage", "name": title, "description": description };
                 break;
            case 'aiConciergeCheckout':
                title = `Checkout: AI Patient Concierge | Transplantify`;
                description = `Complete your subscription for the 24/7 AI Receptionist and start automating your patient intake process.`;
                breadcrumbs.push(
                    { name: 'For Clinics', view: { page: 'pricing' } },
                    { name: 'AI Concierge', view: { page: 'aiConcierge' } },
                    { name: 'Checkout', view }
                );
                schema = { ...schema, "@type": "WebPage", "name": title, "description": description };
                break;
            case 'about':
                title = 'About Transplantify | Our Mission and Story';
                description = 'Learn about Transplantify\'s mission to bring transparency and trust to the hair transplant industry. Discover our story and our commitment to patients.';
                breadcrumbs.push({ name: 'About Us', view });
                schema = { ...schema, "@type": "AboutPage", "name": title, "description": description };
                break;
            case 'contact':
                title = 'Contact Us | Transplantify';
                description = 'Get in touch with the Transplantify team. We are here to help with any questions or feedback you may have.';
                breadcrumbs.push({ name: 'Contact Us', view });
                schema = { ...schema, "@type": "ContactPage", "name": title, "description": description };
                break;
            case 'privacy':
                title = 'Privacy Policy | Transplantify';
                description = 'Read the Transplantify Privacy Policy to understand how we collect, use, and protect your personal data.';
                breadcrumbs.push({ name: 'Privacy Policy', view });
                schema = { ...schema, "@type": "WebPage", "name": title, "description": description };
                break;
            case 'terms':
                title = 'Terms of Service | Transplantify';
                description = 'Review the Terms of Service for using the Transplantify website and its related services.';
                breadcrumbs.push({ name: 'Terms of Service', view });
                schema = { ...schema, "@type": "WebPage", "name": title, "description": description };
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
        setIsSaving(true);
        try {
            const savedClinic = await firebaseService.saveClinic(clinicToSave);
            const exists = clinics.some(c => c.id === savedClinic.id);
            if (exists) {
                setClinics(clinics.map(c => c.id === savedClinic.id ? savedClinic : c));
            } else {
                setClinics([savedClinic, ...clinics]);
            }
        } catch (error) {
            console.error("Failed to save clinic:", error);
            alert("There was an error saving the clinic. Please try again.");
        } finally {
            setIsSaving(false);
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
        try {
            const { updatedClinic, updatedUser } = await firebaseService.approveClaim(claimId);
            
            setClinics(prevClinics => 
                prevClinics.map(c => 
                    c.id === updatedClinic.id ? updatedClinic : c
                )
            );
            
            setUsers(prevUsers => {
                const userExists = prevUsers.some(u => u.uid === updatedUser.uid);
                return userExists 
                    ? prevUsers.map(u => u.uid === updatedUser.uid ? updatedUser : u)
                    : [...prevUsers, updatedUser];
            });

            setPendingClaims(prevClaims => prevClaims.filter(c => c.id !== claimId));
        } catch (error) {
            console.error("Failed to approve claim:", error);
            alert("Failed to approve claim.");
        }
    };
    
    const handleDenyClaim = async (claimId: number) => {
        await firebaseService.deleteClaim(claimId);
        setPendingClaims(prevClaims => prevClaims.filter(c => c.id !== claimId));
    };

    const handleSubmitListing = async (submissionData: Omit<ListingSubmission, 'id' | 'status'>) => {
        const newSubmission = await firebaseService.submitListing(submissionData);
        setPendingSubmissions(prev => [newSubmission, ...prev]);
        alert('Thank you! Your submission has been sent for review.');
        setView({ page: 'patientDashboard' });
    };

    const handleApproveSubmission = async (submissionId: number) => {
        const newClinic = await firebaseService.approveSubmission(submissionId);
        setClinics(prev => [newClinic, ...prev]);
        setPendingSubmissions(prev => prev.filter(s => s.id !== submissionId));
    };
    
    const handleDenySubmission = async (submissionId: number) => {
        await firebaseService.denySubmission(submissionId);
        setPendingSubmissions(prev => prev.filter(s => s.id !== submissionId));
    };

    const handleToggleFavorite = async (clinicId: number) => {
        if (!currentUser) {
            requestLogin({ page: 'directory' }); // Redirect to directory after login
            return;
        }
        try {
            const updatedUser = await firebaseService.toggleFavoriteClinic(currentUser.uid, clinicId);
            setCurrentUser(updatedUser);
            setUsers(prevUsers => prevUsers.map(u => u.uid === updatedUser.uid ? updatedUser : u));
        } catch (error) {
            alert('Failed to update favorites.');
        }
    };

    const handleSubscribe = async (email: string) => {
        try {
            const newSubscriber = await firebaseService.subscribeToNewsletter(email);
            setSubscribers(prev => [newSubscriber, ...prev]);
            return { success: true };
        } catch (error: any) {
             return { success: false, message: error.message };
        }
    };

    const handleContactSubmit = async (formData: { name: string; email: string; subject: string; message: string; }) => {
        // In a real app, this would send an email or save to a database.
        // For this simulation, we'll just show an alert.
        console.log("Contact form submitted:", formData);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network request
        return { success: true, message: "Your message has been sent successfully!" };
    };

    const handleProcessSubscription = async (clinicId: number, tier: Tier) => {
        try {
            const updatedClinic = await firebaseService.processSubscription(clinicId, tier);
            setClinics(prev => prev.map(c => c.id === clinicId ? updatedClinic : c));
        } catch (error) {
            alert('Failed to process subscription.');
        }
    };

    const handleCancelSubscription = async (clinicId: number) => {
        try {
            const updatedClinic = await firebaseService.cancelSubscription(clinicId);
            setClinics(prev => prev.map(c => c.id === clinicId ? updatedClinic : c));
        } catch (error) {
            alert('Failed to cancel subscription.');
        }
    };

    const handleSaveJournalEntry = async (milestone: string, entryData: Omit<JournalEntry, 'date'>) => {
        if (!currentUser) return;
        setIsSaving(true);
        try {
            const updatedUser = await firebaseService.saveJournalEntry(currentUser.uid, milestone, entryData);
            setCurrentUser(updatedUser);
            setUsers(prevUsers => prevUsers.map(u => u.uid === updatedUser.uid ? updatedUser : u));
        } catch (error) {
            console.error("Failed to save journal entry:", error);
            alert("There was an error saving your journal entry. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };


    const renderView = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-2xl font-semibold">Loading Directory...</div>
                </div>
            );
        }

        const showBreadcrumbs = ['clinic', 'city', 'blogDetail', 'productDetail', 'about', 'contact', 'privacy', 'terms', 'aiConcierge', 'aiConciergeCheckout'].includes(view.page);
        
        let mainContent;
        switch (view.page) {
            case 'home':
                mainContent = <Home setView={setView} clinics={clinics} currentUser={currentUser} onToggleFavorite={handleToggleFavorite} requestLogin={requestLogin} />;
                break;
            case 'directory':
                mainContent = <Directory setView={setView} clinics={clinics} currentUser={currentUser} onToggleFavorite={handleToggleFavorite} requestLogin={requestLogin} initialFilters={view.params} />;
                break;
            case 'clinic':
                const clinic = clinics.find(c => c.id === view.params?.id);
                if (clinic) {
                    mainContent = <ClinicDetail clinic={clinic} setView={setView} currentUser={currentUser} requestLogin={requestLogin} users={users} />;
                } else {
                    mainContent = <div className="text-center py-20">Clinic not found.</div>;
                }
                break;
            case 'city':
                const cityName = view.params?.cityName;
                if (cityName) {
                    mainContent = <CityPage cityName={cityName} setView={setView} clinics={clinics} currentUser={currentUser} onToggleFavorite={handleToggleFavorite} requestLogin={requestLogin} />;
                } else {
                    mainContent = <div className="text-center py-20">City not specified.</div>;
                }
                break;
             case 'admin':
                if (currentUser?.role === 'admin') {
                    mainContent = <AdminDashboard 
                        setView={setView}
                        clinics={clinics}
                        blogs={blogPosts}
                        products={productReviews}
                        claims={pendingClaims}
                        pendingReviews={pendingReviews}
                        pendingSubmissions={pendingSubmissions}
                        users={users}
                        subscribers={subscribers}
                        onSaveClinic={handleSaveClinic}
                        onSaveBlog={handleSaveBlog}
                        onSaveProduct={handleSaveProduct}
                        onDeleteBlog={handleDeleteBlog}
                        onDeleteProduct={handleDeleteProduct}
                        onApproveClaim={handleApproveClaim}
                        onDenyClaim={handleDenyClaim}
                        onApproveReview={handleApproveReview}
                        onDenyReview={handleDenyReview}
                        onApproveSubmission={handleApproveSubmission}
                        onDenySubmission={handleDenySubmission}
                        isSaving={isSaving}
                    />;
                } else {
                    mainContent = <div className="text-center py-20">Access Denied.</div>;
                }
                break;
             case 'clinicDashboard':
                if (currentUser?.role === 'clinic-owner') {
                    mainContent = <ClinicDashboard currentUser={currentUser} clinics={clinics} setView={setView} onSaveClinic={handleSaveClinic} onCancelSubscription={handleCancelSubscription} isSaving={isSaving} />;
                } else {
                    mainContent = <div className="text-center py-20">Access Denied.</div>;
                }
                break;
            case 'patientDashboard':
                if (currentUser?.role === 'patient') {
                    mainContent = <PatientDashboard 
                        currentUser={currentUser} 
                        clinics={clinics} 
                        pendingReviews={pendingReviews}
                        pendingSubmissions={pendingSubmissions}
                        setView={setView} 
                        onToggleFavorite={handleToggleFavorite}
                        requestLogin={requestLogin}
                        onSaveJournalEntry={handleSaveJournalEntry}
                        isSaving={isSaving}
                    />;
                } else {
                    mainContent = <div className="text-center py-20">Access Denied.</div>;
                }
                break;
            case 'pricing':
                mainContent = <PricingPage setView={setView} currentUser={currentUser} clinics={clinics} onCancelSubscription={handleCancelSubscription} />;
                break;
            case 'aiConcierge':
                mainContent = <AiConciergePage setView={setView} />;
                break;
            case 'aiConciergeCheckout':
                mainContent = <AiConciergeCheckoutPage setView={setView} />;
                break;
            case 'blog':
                mainContent = <Blog setView={setView} blogPosts={blogPosts} />;
                break;
            case 'blogDetail':
                const blogPost = blogPosts.find(p => p.id === view.params?.id);
                 if (blogPost) {
                    mainContent = <BlogDetail blogPost={blogPost} setView={setView} />;
                } else {
                    mainContent = <div className="text-center py-20">Blog post not found.</div>;
                }
                break;
            case 'products':
                mainContent = <Products setView={setView} products={productReviews} />;
                break;
            case 'productDetail':
                const product = productReviews.find(p => p.id === view.params?.id);
                if (product) {
                    mainContent = <ProductDetail product={product} setView={setView} />;
                } else {
                    mainContent = <div className="text-center py-20">Product not found.</div>;
                }
                break;
            case 'claimListing':
                const clinicToClaim = clinics.find(c => c.id === view.params?.id);
                if (clinicToClaim) {
                    mainContent = <ClaimListingPage clinic={clinicToClaim} setView={setView} onClaimSubmit={handleClaimSubmit} />;
                } else {
                    mainContent = <div className="text-center py-20">Clinic not found.</div>;
                }
                break;
            case 'submitListing':
                mainContent = <SubmitListingPage setView={setView} onSubmit={handleSubmitListing} currentUser={currentUser} requestLogin={requestLogin} />;
                break;
            case 'login':
                mainContent = <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} setView={setView} reason={loginRedirectView ? "Please log in or sign up to continue." : ""} />;
                break;
            case 'writeReview':
                const clinicToReview = clinics.find(c => c.id === view.params?.clinicId);
                if (clinicToReview && currentUser) {
                    mainContent = <WriteReviewPage clinic={clinicToReview} user={currentUser} setView={setView} onSubmitReview={handleSubmitReview} />;
                } else {
                     mainContent = <div className="text-center py-20">Error: Clinic not found or user not logged in.</div>;
                }
                break;
            case 'checkout':
                const tier = view.params?.tier as Tier;
                const ownedClinic = clinics.find(c => c.ownerId === currentUser?.uid);
                if (tier && ownedClinic) {
                    mainContent = <CheckoutPage tier={tier} clinic={ownedClinic} setView={setView} onProcessSubscription={handleProcessSubscription} />;
                } else {
                    mainContent = <div className="text-center py-20">Error: Plan or clinic information is missing.</div>;
                }
                break;
            case 'about':
                mainContent = <AboutUsPage setView={setView} />;
                break;
            case 'contact':
                mainContent = <ContactPage setView={setView} onContactSubmit={handleContactSubmit} />;
                break;
            case 'privacy':
                mainContent = <PrivacyPolicyPage />;
                break;
            case 'terms':
                mainContent = <TermsOfServicePage />;
                break;
            default:
                mainContent = <Home setView={setView} clinics={clinics} currentUser={currentUser} onToggleFavorite={handleToggleFavorite} requestLogin={requestLogin} />;
        }
        
        return (
             <div className="flex flex-col min-h-screen">
                <MetaTagManager title={pageData.title} description={pageData.description} />
                <Schema data={pageData.schema} />
                <Header setView={setView} currentUser={currentUser} onLogout={handleLogout} />
                {showBreadcrumbs && <Breadcrumbs crumbs={pageData.breadcrumbs} setView={setView} />}
                <main className="flex-grow">
                    {mainContent}
                </main>
                <Footer onOpenNewsletterModal={() => setIsNewsletterModalOpen(true)} setView={setView} />
                <NewsletterModal isOpen={isNewsletterModalOpen} onClose={() => setIsNewsletterModalOpen(false)} onSubscribe={handleSubscribe} />
            </div>
        );
    };

    return renderView();
};

export default App;