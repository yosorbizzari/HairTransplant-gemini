

export enum Tier {
    BASIC = 'Basic',
    PREMIUM = 'Premium',
    GOLD = 'Gold'
}

export interface User {
    id: number;
    name: string;
}

export interface Review {
    id: number;
    userId: number;
    clinicId: number;
    rating: number;
    comment: string;
    date: string;
    status: 'pending' | 'approved';
    isAnonymous?: boolean;
}

export interface Treatment {
    id: number;
    name: string;
    description: string;
}

export interface Clinic {
    id: number;
    name: string;
    tier: Tier;
    city: string;
    country: string;
    address: string;
    latitude?: number;
    longitude?: number;
    rating: number;
    reviewCount: number;
    shortDescription: string;
    longDescription: string;
    treatments: number[]; // Array of treatment IDs
    contact: {
        phone: string;
        website: string;
    };
    reviews: Review[];
    imageUrl: string;
    galleryImages?: string[];
    videoUrl?: string;
    verified: boolean;
    aggregatedRating?: number;
    aggregatedReviewCount?: number;
    reviewSource?: string;
    reviewSourceUrl?: string;
}

export interface City {
    name: string;
    country: string;
    imageUrl: string;
}

export interface BlogPost {
    id: number;
    title: string;
    author: string;
    date: string;
    summary: string;
    content: string;
    imageUrl: string;
}

export interface ProductCategory {
    id: number;
    name: string;
    description: string;
}

export interface ProductReview {
    id: number;
    name: string;
    rating: number;
    summary: string;
    fullReview: string;
    affiliateLink: string;
    imageUrl: string;
    categoryId: number;
}

export interface ClaimRequest {
    id: number;
    clinicId: number;
    clinicName: string;
    submitterName: string;
    submitterTitle: string;
    submitterEmail: string;
    verificationMethod: 'email' | 'document';
    documentProof?: string; // Base64 data URL of the uploaded file
    status: 'pending';
}

export interface Breadcrumb {
    name: string;
    view: View;
}

export interface View {
    page: 'home' | 'directory' | 'clinic' | 'city' | 'admin' | 'pricing' | 'blog' | 'blogDetail' | 'products' | 'productDetail' | 'claimListing' | 'login' | 'writeReview';
    params?: Record<string, any>;
}