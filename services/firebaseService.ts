
import { Clinic, BlogPost, ProductReview, ClaimRequest, User, Review, Treatment, City } from '../types';
import { CLINICS, BLOG_POSTS, PRODUCT_REVIEWS, PENDING_CLAIMS, INITIAL_USERS, PENDING_REVIEWS, TREATMENTS, CITIES } from '../constants';

// --- DATABASE SIMULATION ---
// In a real app, this would be your Firestore database.
// We're using local variables to simulate the database state.
let db = {
    clinics: [...CLINICS],
    blogPosts: [...BLOG_POSTS],
    productReviews: [...PRODUCT_REVIEWS],
    pendingClaims: [...PENDING_CLAIMS],
    users: [...INITIAL_USERS],
    pendingReviews: [...PENDING_REVIEWS],
    treatments: [...TREATMENTS],
    cities: [...CITIES],
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
        return {
            clinics: db.clinics,
            blogPosts: db.blogPosts,
            productReviews: db.productReviews,
            pendingClaims: db.pendingClaims,
            users: db.users,
            pendingReviews: db.pendingReviews,
            currentUser: currentAuthUser,
        };
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
        db.users.push(newUser);
        currentAuthUser = newUser; // Auto-login
        console.log("Firebase Service: Signed up and logged in new user.", newUser);
        return newUser;
    },

    login: async (email: string, password: string): Promise<User> => {
        await networkDelay(500);
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        // In a real app, you'd also check the password hash.
        if (user) {
            currentAuthUser = user;
            console.log("Firebase Service: Logged in user.", user);
            return user;
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
        db.pendingReviews.unshift(newReview);
        console.log("Firebase Service: Submitted new review for moderation.", newReview);
        return newReview;
    },

    approveReview: async (reviewId: number): Promise<Review> => {
        await networkDelay(300);
        const review = db.pendingReviews.find(r => r.id === reviewId);
        if (!review) throw new Error("Review not found in pending list.");

        const approvedReview = { ...review, status: 'approved' as const };
        
        db.clinics = db.clinics.map(c => 
            c.id === review.clinicId 
                ? { ...c, reviews: [approvedReview, ...c.reviews] } 
                : c
        );
        db.pendingReviews = db.pendingReviews.filter(r => r.id !== reviewId);
        console.log("Firebase Service: Approved review.", approvedReview);
        return approvedReview;
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
        db.pendingClaims.unshift(newClaim);
        console.log("Firebase Service: Submitted new claim.", newClaim);
        return newClaim;
    },
    
    approveClaim: async (claimId: number) : Promise<{ updatedClinic: Clinic; updatedUser: User }> => {
        await networkDelay(500);
        const claim = db.pendingClaims.find(c => c.id === claimId);
        if (!claim) throw new Error("Claim not found.");

        let updatedClinic: Clinic | null = null;
        let updatedUser: User | null = null;

        // Find user by email from the claim
        const userIndex = db.users.findIndex(u => u.email.toLowerCase() === claim.submitterEmail.toLowerCase());
        
        if (userIndex === -1) {
            // If user doesn't exist, create one
            updatedUser = {
                uid: `user-${Date.now()}`,
                name: claim.submitterName,
                email: claim.submitterEmail,
                role: 'clinic-owner',
                favoriteClinics: [],
            };
            db.users.push(updatedUser);
        } else {
            // If user exists, promote them
            db.users[userIndex].role = 'clinic-owner';
            updatedUser = db.users[userIndex];
        }

        // Find clinic and assign owner
        const clinicIndex = db.clinics.findIndex(c => c.id === claim.clinicId);
        if (clinicIndex > -1) {
            db.clinics[clinicIndex].verified = true;
            db.clinics[clinicIndex].ownerId = updatedUser.uid;
            updatedClinic = db.clinics[clinicIndex];
        } else {
            throw new Error("Clinic to be claimed not found.");
        }

        // Remove claim from pending list
        db.pendingClaims = db.pendingClaims.filter(c => c.id !== claimId);
        
        console.log(`Firebase Service: Approved claim. User ${updatedUser.name} now owns ${updatedClinic.name}.`);
        return { updatedClinic, updatedUser };
    },

    deleteClaim: async (claimId: number): Promise<void> => {
        await networkDelay(300);
        db.pendingClaims = db.pendingClaims.filter(c => c.id !== claimId);
        console.log("Firebase Service: Deleted/Denied claim with ID:", claimId);
    },

    saveClinic: async (clinicData: Clinic): Promise<Clinic> => {
        await networkDelay(500);
        const index = db.clinics.findIndex(c => c.id === clinicData.id);
        if (index > -1) {
            db.clinics[index] = clinicData;
            console.log("Firebase Service: Updated clinic.", clinicData);
        } else {
            // In a real app, ID would be generated by Firestore
            const newClinicWithId = { ...clinicData, id: Date.now() };
            db.clinics.unshift(newClinicWithId);
             console.log("Firebase Service: Created new clinic.", newClinicWithId);
             return newClinicWithId;
        }
        return clinicData;
    },

    saveBlogPost: async (blogData: BlogPost): Promise<BlogPost> => {
        await networkDelay(500);
        const index = db.blogPosts.findIndex(b => b.id === blogData.id);
        if (index > -1) {
            db.blogPosts[index] = blogData;
        } else {
            const newPost = { ...blogData, id: Date.now() };
            db.blogPosts.unshift(newPost);
            return newPost;
        }
        return blogData;
    },

    saveProductReview: async (productData: ProductReview): Promise<ProductReview> => {
        await networkDelay(500);
        const index = db.productReviews.findIndex(p => p.id === productData.id);
        if (index > -1) {
            db.productReviews[index] = productData;
        } else {
            const newProduct = { ...productData, id: Date.now() };
            db.productReviews.unshift(newProduct);
            return newProduct;
        }
        return productData;
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
        await networkDelay(800);
        console.log("Firebase Service: 'Uploaded' file, returning data URL.");
        return fileDataUrl;
    },

    toggleFavoriteClinic: async (userId: string, clinicId: number): Promise<User> => {
        await networkDelay(200);
        const userIndex = db.users.findIndex(u => u.uid === userId);
        if (userIndex === -1) {
            throw new Error("User not found.");
        }
        const user = db.users[userIndex];
        const favorites = user.favoriteClinics || [];
        const isFavorite = favorites.includes(clinicId);
        
        if (isFavorite) {
            user.favoriteClinics = favorites.filter(id => id !== clinicId);
        } else {
            user.favoriteClinics = [...favorites, clinicId];
        }
        
        db.users[userIndex] = user;
        if (currentAuthUser?.uid === userId) {
            currentAuthUser = user;
        }

        console.log("Firebase Service: Toggled favorite for user.", user);
        return user;
    }
};