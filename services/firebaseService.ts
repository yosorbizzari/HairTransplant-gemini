import { Clinic, BlogPost, ProductReview, ClaimRequest, User, Review, Treatment, City, NewsletterSubscriber, Tier } from '../types';
import { CLINICS, BLOG_POSTS, PRODUCT_REVIEWS, PENDING_CLAIMS, INITIAL_USERS, PENDING_REVIEWS, TREATMENTS, CITIES, INITIAL_SUBSCRIBERS } from '../constants';

// --- DEEP CLONE UTILITY ---
// This is crucial for preventing state mutation bugs in our simulation.
// Every function that modifies data should return a new object.
const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

// --- DATABASE SIMULATION ---
// In a real app, this would be your Firestore database.
// We're using local variables to simulate the database state.
let db = {
    clinics: deepClone(CLINICS),
    blogPosts: deepClone(BLOG_POSTS),
    productReviews: deepClone(PRODUCT_REVIEWS),
    pendingClaims: deepClone(PENDING_CLAIMS),
    users: deepClone(INITIAL_USERS),
    pendingReviews: deepClone(PENDING_REVIEWS),
    treatments: deepClone(TREATMENTS),
    cities: deepClone(CITIES),
    newsletterSubscribers: deepClone(INITIAL_SUBSCRIBERS),
};

// --- AUTH SIMULATION ---
let currentAuthUser: User | null = db.users.find(u => u.role === 'admin') || null; // Default to admin for testing

// --- SIMULATED NETWORK LATENCY ---
const networkDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- SERVICE DEFINITION ---
export const firebaseService = {

    getInitialData: async () => {
        await networkDelay(1000); // Simulate fetching initial data
        console.log("Firebase Service: Fetched initial data.");
        // Return clones to prevent direct mutation of the source of truth
        return deepClone({
            clinics: db.clinics,
            blogPosts: db.blogPosts,
            productReviews: db.productReviews,
            pendingClaims: db.pendingClaims,
            users: db.users,
            pendingReviews: db.pendingReviews,
            currentUser: currentAuthUser,
            newsletterSubscribers: db.newsletterSubscribers,
        });
    },

    signUp: async (name: string, email: string, password: string): Promise<User> => {
        await networkDelay(500);
        if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error("Authentication failed: Email address already in use.");
        }
        const newUser: User = {
            uid: `user-${Date.now()}`,
            name,
            email,
            role: 'patient', // New users default to 'patient' role
            favoriteClinics: [],
        };
        db.users = [...db.users, newUser];
        currentAuthUser = deepClone(newUser); // Auto-login
        console.log("Firebase Service: Signed up and logged in new user.", newUser);
        return deepClone(newUser);
    },

    login: async (email: string, password: string): Promise<User> => {
        await networkDelay(500);
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
            currentAuthUser = deepClone(user);
            console.log("Firebase Service: Logged in user.", user);
            return deepClone(user);
        } else {
            throw new Error("Authentication failed: User not found or password incorrect.");
        }
    },

    logout: async (): Promise<void> => {
        await networkDelay(200);
        console.log("Firebase Service: Logged out user.", currentAuthUser);
        currentAuthUser = null;
    },

    submitReview: async (reviewData: Omit<Review, 'id' | 'date' | 'status'>): Promise<Review> => {
        await networkDelay(400);
        const newReview: Review = {
            ...reviewData,
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };
        db.pendingReviews = [newReview, ...db.pendingReviews];
        console.log("Firebase Service: Submitted new review for moderation.", newReview);
        return deepClone(newReview);
    },

    approveReview: async (reviewId: number): Promise<Review> => {
        await networkDelay(300);
        const reviewIndex = db.pendingReviews.findIndex(r => r.id === reviewId);
        if (reviewIndex === -1) throw new Error("Review not found in pending list.");

        const reviewToApprove = db.pendingReviews[reviewIndex];
        const approvedReview = { ...deepClone(reviewToApprove), status: 'approved' as const };
        
        db.clinics = db.clinics.map(clinic => {
            if (clinic.id === approvedReview.clinicId) {
                const newClinic = deepClone(clinic);
                newClinic.reviews.unshift(approvedReview);
                return newClinic;
            }
            return clinic;
        });
        
        db.pendingReviews = db.pendingReviews.filter(r => r.id !== reviewId);
        console.log("Firebase Service: Approved review.", approvedReview);
        return deepClone(approvedReview);
    },

    deleteReview: async (reviewId: number): Promise<void> => {
        await networkDelay(300);
        db.pendingReviews = db.pendingReviews.filter(r => r.id !== reviewId);
        console.log("Firebase Service: Deleted/Denied pending review with ID:", reviewId);
    },
    
    submitClaim: async (claimData: Omit<ClaimRequest, 'id' | 'status'>) : Promise<ClaimRequest> => {
        await networkDelay(400);
         const newClaim: ClaimRequest = {
            ...claimData,
            id: Date.now(),
            status: 'pending'
        };
        db.pendingClaims = [newClaim, ...db.pendingClaims];
        console.log("Firebase Service: Submitted new claim.", newClaim);
        return deepClone(newClaim);
    },
    
    approveClaim: async (claimId: number) : Promise<{ updatedClinic: Clinic; updatedUser: User }> => {
        await networkDelay(500);
        const claim = db.pendingClaims.find(c => c.id === claimId);
        if (!claim) throw new Error("Claim not found.");

        let finalUpdatedClinic: Clinic | null = null;
        let finalUpdatedUser: User | null = null;
        
        const userIndex = db.users.findIndex(u => u.email.toLowerCase() === claim.submitterEmail.toLowerCase());
        
        if (userIndex === -1) {
            const newUser: User = { uid: `user-${Date.now()}`, name: claim.submitterName, email: claim.submitterEmail, role: 'clinic-owner', favoriteClinics: [] };
            db.users = [...db.users, newUser];
            finalUpdatedUser = newUser;
        } else {
            const originalUser = db.users[userIndex];
            const updatedUser = { ...deepClone(originalUser), role: 'clinic-owner' as const };
            db.users = db.users.map(u => u.uid === updatedUser.uid ? updatedUser : u);
            finalUpdatedUser = updatedUser;
        }

        db.clinics = db.clinics.map(clinic => {
            if (clinic.id === claim.clinicId) {
                const updatedClinic = deepClone(clinic);
                updatedClinic.verified = true;
                updatedClinic.ownerId = finalUpdatedUser!.uid;
                updatedClinic.tier = Tier.BASIC;
                finalUpdatedClinic = updatedClinic;
                return updatedClinic;
            }
            return clinic;
        });

        if (!finalUpdatedClinic) throw new Error("Clinic to be claimed not found.");

        db.pendingClaims = db.pendingClaims.filter(c => c.id !== claimId);
        
        console.log(`Firebase Service: Approved claim. User ${finalUpdatedUser.name} now owns ${finalUpdatedClinic.name} (Tier: Basic).`);
        return { updatedClinic: deepClone(finalUpdatedClinic), updatedUser: deepClone(finalUpdatedUser) };
    },

    deleteClaim: async (claimId: number): Promise<void> => {
        await networkDelay(300);
        db.pendingClaims = db.pendingClaims.filter(c => c.id !== claimId);
        console.log("Firebase Service: Deleted/Denied claim with ID:", claimId);
    },

    saveClinic: async (clinicData: Clinic): Promise<Clinic> => {
        await networkDelay(500); // Base delay for DB write
        
        const isBase64 = (str: string) => str && str.startsWith('data:image');
        let clinicToSave = deepClone(clinicData);
    
        // Simulate uploading the main image
        if (isBase64(clinicToSave.imageUrl)) {
            console.log("Firebase Service: Detected Base64 main image. Uploading...");
            clinicToSave.imageUrl = await firebaseService.uploadFile(clinicToSave.imageUrl);
        }
    
        // Simulate uploading gallery images
        if (clinicToSave.galleryImages && clinicToSave.galleryImages.length > 0) {
            const uploadedGalleryImages = await Promise.all(
                clinicToSave.galleryImages.map(img => {
                    if (isBase64(img)) {
                        console.log("Firebase Service: Detected Base64 gallery image. Uploading...");
                        return firebaseService.uploadFile(img);
                    }
                    return Promise.resolve(img); // Return existing URL
                })
            );
            clinicToSave.galleryImages = uploadedGalleryImages.filter(url => url); // Filter out empty strings
        }

        const index = db.clinics.findIndex(c => c.id === clinicToSave.id);
        
        if (index > -1) {
            db.clinics = db.clinics.map(c => c.id === clinicToSave.id ? clinicToSave : c);
            console.log("Firebase Service: Updated clinic.", clinicToSave);
        } else {
            clinicToSave.id = Date.now();
            db.clinics = [clinicToSave, ...db.clinics];
            console.log("Firebase Service: Created new clinic.", clinicToSave);
        }
        return deepClone(clinicToSave);
    },

    saveBlogPost: async (blogData: BlogPost): Promise<BlogPost> => {
        await networkDelay(500);
        const postToSave = deepClone(blogData);
        const index = db.blogPosts.findIndex(b => b.id === postToSave.id);
        if (index > -1) {
            db.blogPosts = db.blogPosts.map(b => b.id === postToSave.id ? postToSave : b);
        } else {
            postToSave.id = Date.now();
            db.blogPosts = [postToSave, ...db.blogPosts];
        }
        return deepClone(postToSave);
    },

    saveProductReview: async (productData: ProductReview): Promise<ProductReview> => {
        await networkDelay(500);
        const productToSave = deepClone(productData);
        const index = db.productReviews.findIndex(p => p.id === productToSave.id);
        if (index > -1) {
            db.productReviews = db.productReviews.map(p => p.id === productToSave.id ? productToSave : p);
        } else {
            productToSave.id = Date.now();
            db.productReviews = [productToSave, ...db.productReviews];
        }
        return deepClone(productToSave);
    },
    
    deleteBlog: async (blogId: number): Promise<void> => {
        await networkDelay(300);
        db.blogPosts = db.blogPosts.filter(b => b.id !== blogId);
    },

    deleteProduct: async (productId: number): Promise<void> => {
        await networkDelay(300);
        db.productReviews = db.productReviews.filter(p => p.id !== productId);
    },
    
    uploadFile: async (fileDataUrl: string): Promise<string> => {
        await networkDelay(1200); // Simulate a slightly longer upload time
        const placeholderUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
        console.log(`Firebase Service: 'Uploaded' file, returning placeholder URL: ${placeholderUrl}`);
        return placeholderUrl;
    },

    toggleFavoriteClinic: async (userId: string, clinicId: number): Promise<User> => {
        await networkDelay(200);
        const userIndex = db.users.findIndex(u => u.uid === userId);
        if (userIndex === -1) throw new Error("User not found.");
        
        const user = db.users[userIndex];
        const favorites = user.favoriteClinics || [];
        const isFavorite = favorites.includes(clinicId);
        
        const updatedUser = {
            ...deepClone(user),
            favoriteClinics: isFavorite ? favorites.filter(id => id !== clinicId) : [...favorites, clinicId]
        };

        db.users = db.users.map(u => u.uid === userId ? updatedUser : u);
        
        if (currentAuthUser?.uid === userId) {
            currentAuthUser = deepClone(updatedUser);
        }

        console.log("Firebase Service: Toggled favorite for user.", updatedUser);
        return deepClone(updatedUser);
    },

    subscribeToNewsletter: async (email: string): Promise<NewsletterSubscriber> => {
        await networkDelay(400);
        if (db.newsletterSubscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
            throw new Error("This email address is already subscribed.");
        }
        const newSubscriber: NewsletterSubscriber = { id: Date.now(), email, subscribedAt: new Date().toISOString().split('T')[0] };
        db.newsletterSubscribers = [newSubscriber, ...db.newsletterSubscribers];
        console.log("Firebase Service: New newsletter subscriber.", newSubscriber);
        return deepClone(newSubscriber);
    },

    processSubscription: async (clinicId: number, tier: Tier): Promise<Clinic> => {
        await networkDelay(1500);
        let updatedClinic: Clinic | null = null;
        db.clinics = db.clinics.map(c => {
            if (c.id === clinicId) {
                updatedClinic = {
                    ...deepClone(c),
                    tier,
                    subscriptionStatus: 'active',
                    stripeCustomerId: c.stripeCustomerId || `cus_${Date.now()}`
                };
                return updatedClinic;
            }
            return c;
        });

        if (!updatedClinic) throw new Error("Clinic not found for subscription.");
        console.log(`Firebase Service: Processed subscription for ${updatedClinic.name} to ${tier} tier.`);
        return deepClone(updatedClinic);
    },

    cancelSubscription: async (clinicId: number): Promise<Clinic> => {
        await networkDelay(800);
        let updatedClinic: Clinic | null = null;
        db.clinics = db.clinics.map(c => {
            if (c.id === clinicId) {
                updatedClinic = {
                    ...deepClone(c),
                    tier: Tier.BASIC, // Revert to Basic on cancellation
                    subscriptionStatus: 'canceled'
                };
                return updatedClinic;
            }
            return c;
        });
        
        if (!updatedClinic) throw new Error("Clinic not found for cancellation.");
        console.log(`Firebase Service: Canceled subscription for ${updatedClinic.name}.`);
        return deepClone(updatedClinic);
    },
};