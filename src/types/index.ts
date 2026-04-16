export type ListingCategory = "rent" | "sale";
export type PropertyType =
  | "Apartment"
  | "Villa"
  | "Townhouse"
  | "Studio"
  | "Penthouse"
  | "Office";

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  category: ListingCategory;
  type: PropertyType;
  location: string;
  city: string;
  description: string;
  images: string[];
  featured: boolean;
  bedrooms: number;
  bathrooms: number;
  area: number;
  latitude: number;
  longitude: number;
  agentName: string;
  agentPhone: string;
  createdAt: string;
}

export interface PropertyFilters {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  type?: PropertyType | "All";
  location?: string;
  category?: ListingCategory | "All";
}

export interface ListingFormValues {
  title: string;
  price: string;
  description: string;
  location: string;
  type: PropertyType | "";
  category: ListingCategory;
  bedrooms: string;
  bathrooms: string;
  area: string;
  images: string[];
}

export interface Message {
  id: string;
  sender: "agent" | "user";
  text: string;
  timestamp: string;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  PropertyDetails: { propertyId: string };
  CreateEditListing: { propertyId?: string } | undefined;
  Chat: { propertyId?: string; propertyName?: string } | undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};
