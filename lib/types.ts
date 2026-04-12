export interface Winery {
  title: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
  location: {
    lat: number;
    lng: number;
  };
  phone: string;
  phoneUnformatted?: string;
  website: string;
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
