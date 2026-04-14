export interface WineryReview {
  reviewerId: string;
  reviewerUrl: string;
  name: string;
  reviewerNumberOfReviews: number;
  isLocalGuide: boolean;
  reviewerPhotoUrl: string;
  text: string;
  textTranslated?: string;
  publishAt: string;
  publishedAtDate: string;
  likesCount: number;
  reviewId: string;
  reviewUrl: string;
  reviewOrigin: string;
  stars: number;
  rating: number;
  responseFromOwnerDate?: string;
  responseFromOwnerText?: string;
  reviewImageUrls: string[];
  reviewContext?: string;
  reviewDetailedRating?: any;
  visitedIn?: string;
  originalLanguage?: string;
  translatedLanguage?: string;
}

export interface Winery {
  title: string;
  address: string;
  city: string;
  county: string;
  region: string;
  postalCode: string;
  state: string;
  location: {
    lat: number;
    lng: number;
  };
  phone: string;
  phoneUnformatted?: string;
  website: string;
  slug: string;
  totalScore: number;
  reviewsCount: number;
  reviewsDistribution: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
  categories: string[];
  categoryName: string;
  placeId: string;
  url: string;
  imageUrl: string;
  openingHours: Array<{
    day: string;
    hours: string;
  }>;
  permanentlyClosed: boolean;
  weddingConfidence?: 'confirmed' | 'likely' | 'unverified';
  reviews?: WineryReview[];
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  weddingDate: string;
  guestCount: string;
  preferredRegion: string;
  message: string;
}
