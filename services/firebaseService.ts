
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
let currentAuthUser: User | null = null;

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
    
    approveClaim: async (claimId: number) : Promise<number> => {
        await networkDelay(300);
        const claim = db.pendingClaims.find(c => c.id === claimId);
        if (!claim) throw new Error("Claim not found.");

        db.clinics = db.clinics.map(c => 
            c.id === claim.clinicId ? { ...c, verified: true } : c
        );
        db.pendingClaims = db.pendingClaims.filter(c => c.id !== claimId);
        console.log("Firebase Service: Approved claim for clinic ID:", claim.clinicId);
        return claim.clinicId;
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
            db.clinics.unshift(clinicData);
             console.log("Firebase Service: Created new clinic.", clinicData);
        }
        return clinicData;
    },

    saveBlogPost: async (blogData: BlogPost): Promise<BlogPost> => {
        await networkDelay(500);
        const index = db.blogPosts.findIndex(b => b.id === blogData.id);
        if (index > -1) {
            db.blogPosts[index] = blogData;
        } else {
            db.blogPosts.unshift(blogData);
        }
        return blogData;
    },

    saveProductReview: async (productData: ProductReview): Promise<ProductReview> => {
        await networkDelay(500);
        const index = db.productReviews.findIndex(p => p.id === productData.id);
        if (index > -1) {
            db.productReviews[index] = productData;
        } else {
            db.productReviews.unshift(productData);
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
    
    // This simulates uploading a file (e.g., from the ImageInput) to Firebase Storage
    // and getting back a public URL. In our case, we just return the data URL back.
    uploadFile: async (fileDataUrl: string): Promise<string> => {
        await networkDelay(800);
        console.log("Firebase Service: 'Uploaded' file, returning data URL.");
        return fileDataUrl;
    }
};
