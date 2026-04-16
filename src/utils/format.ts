import { ListingCategory, PropertyType } from "../types";

export const formatCurrency = (value: number) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      currencyDisplay: "code",
      maximumFractionDigits: 0
    }).format(value);
  } catch (e) {
    return `ETB ${value.toLocaleString()}`;
  }
};

export const formatCompactPrice = (value: number) => {
  if (value >= 1_000_000) {
    const amount = value / 1_000_000;
    return `${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (value >= 1_000) {
    const amount = value / 1_000;
    return `${amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(1).replace(/\.0$/, "")}K`;
  }

  return `${value}`;
};

export const formatDate = (value: string) => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(new Date(value));
  } catch (e) {
    return value ? new Date(value).toDateString() : "";
  }
};

export const formatCategory = (value: ListingCategory) =>
  value === "rent" ? "For Rent" : "For Sale";

export const formatPropertyType = (value: PropertyType | "All") =>
  value === "All" ? "Any type" : value;

export const compactLocation = (location: string, city?: string) =>
  city ? `${location}, ${city}` : location;
