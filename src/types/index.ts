export type Locale = "en" | "hi";

export type PackageCategory =
  | "family"
  | "honeymoon"
  | "group"
  | "adventure"
  | "domestic";

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  titleHi: string;
  destination: string;
  destinationHi: string;
  country: string;
  durationDays: number;
  durationNights: number;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  categories: PackageCategory[];
  featured?: boolean;
  bestSeller?: boolean;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  nameHi: string;
  country: string;
  image: string;
  packageCount: number;
  startingPrice: number;
  description: string;
  descriptionHi: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  locationHi: string;
  avatar: string;
  rating: number;
  text: string;
  textHi: string;
  tripName: string;
  tripNameHi: string;
  isVideo?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleHi: string;
  excerpt: string;
  excerptHi: string;
  image: string;
  category: string;
  categoryHi: string;
  date: string;
  author: string;
  readTime: number;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  altHi: string;
  category: "domestic" | "adventure" | "memories";
}

export interface FaqItem {
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
}

export interface SiteStats {
  happyCustomers: number;
  toursCompleted: number;
  destinationsCovered: number;
  yearsOfExperience: number;
}

export interface DestinationBookingDatum {
  destination: string;
  destinationHi: string;
  bookings: number;
}

export interface SeasonalTrendDatum {
  month: string;
  monthHi: string;
  bookings: number;
}

export interface SatisfactionDatum {
  name: string;
  nameHi: string;
  value: number;
}
