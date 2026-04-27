import { mockProperties } from "../data/mockProperties";
import { AuthCredentials, ListingFormValues, ListingAttachment, Property, PropertyFilters, User } from "../types";
import { formatCategory } from "../utils/format";

const users: Array<User & { password: string }> = [
  {
    id: "user-001",
    name: "Abera M",
    phone: "+251 911 223 344",
    password: "password123",
    token: "mock-token-demo"
  }
];

let properties: Property[] = [...mockProperties];

const delay = (ms = 420) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizePhone = (value: string) =>
  value.replace(/[^\d]/g, "").replace(/^251/, "").replace(/^0/, "");

const formatEthiopianPhone = (value: string) => {
  const digits = normalizePhone(value).replace(/^251/, "");

  if (!digits) {
    return "+251";
  }

  const groups = digits.match(/^(\d)(\d{2})(\d{3})(\d{3})$/);

  if (!groups) {
    return `+251 ${digits}`;
  }

  return `+251 ${groups[1]}${groups[2]} ${groups[3]} ${groups[4]}`;
};

const normalizeAttachments = (attachments: ListingAttachment[] | undefined): ListingAttachment[] =>
  (attachments ?? []).map((attachment) => ({
    name: attachment.name,
    uri: attachment.uri,
    mimeType: attachment.mimeType,
    size: attachment.size
  }));

const createToken = (phone: string) => {
  const seed = Array.from(phone).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `mock-token-${seed.toString(36)}-${Date.now().toString(36)}`;
};

const normalizeText = (value: string) => value.toLowerCase().trim();

const matchesProperty = (property: Property, filters?: PropertyFilters) => {
  if (!filters) return true;

  const query = normalizeText(filters.query ?? "");
  const location = normalizeText(filters.location ?? "");

  const typeMatch =
    !filters.type || filters.type === "All" || property.type === filters.type;
  const categoryMatch =
    !filters.category || filters.category === "All" || property.category === filters.category;
  const minPriceMatch =
    filters.minPrice === undefined || property.price >= filters.minPrice;
  const maxPriceMatch =
    filters.maxPrice === undefined || property.price <= filters.maxPrice;
  const queryMatch =
    !query ||
    normalizeText(property.title).includes(query) ||
    normalizeText(property.location).includes(query) ||
    normalizeText(property.city).includes(query) ||
    normalizeText(formatCategory(property.category)).includes(query);
  const locationMatch =
    !location ||
    normalizeText(property.location).includes(location) ||
    normalizeText(property.city).includes(location);

  return typeMatch && categoryMatch && minPriceMatch && maxPriceMatch && queryMatch && locationMatch;
};

export const mockAuth = {
  async login(credentials: AuthCredentials) {
    await delay();
    const normalizedPhone = normalizePhone(credentials.mobile);
    const existing = users.find((item) => normalizePhone(item.phone ?? "") === normalizedPhone);

    if (!existing || existing.password !== credentials.password) {
      throw new Error("Invalid phone number or password.");
    }

    const token = createToken(existing.phone ?? normalizedPhone);
    return {
      token,
      refreshToken: createToken(`${existing.phone ?? normalizedPhone}-refresh`),
      user: {
        id: existing.id,
        name: existing.name,
        phone: formatEthiopianPhone(existing.phone ?? normalizedPhone),
        token
      }
    };
  },

  async register(credentials: AuthCredentials) {
    await delay();
    const normalizedPhone = normalizePhone(credentials.mobile);
    const duplicate = users.find((item) => normalizePhone(item.phone ?? "") === normalizedPhone);

    if (duplicate) {
      throw new Error("An account with that phone number already exists.");
    }

    const token = createToken(normalizedPhone);
    const user = {
      id: `user-${String(users.length + 1).padStart(3, "0")}`,
      name: credentials.name ?? "New User",
      phone: formatEthiopianPhone(normalizedPhone),
      token
    };

    users.push({ ...user, password: credentials.password });
    return { token, refreshToken: createToken(`${normalizedPhone}-refresh`), user };
  }
};

export const mockPropertiesApi = {
  async list(filters?: PropertyFilters) {
    await delay();
    return properties.filter((property) => matchesProperty(property, filters));
  },

  async getById(propertyId: string) {
    await delay();
    const property = properties.find((item) => item.id === propertyId);

    if (!property) {
      throw new Error("Property not found.");
    }

    return property;
  },

  async create(values: ListingFormValues) {
    await delay();

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title: values.title,
      price: Number(values.price),
      category: values.category,
      type: values.type || "Apartment",
      location: values.location,
      city: values.location.split(",")[1]?.trim() ?? "Addis Ababa",
      description: values.description,
      images: values.images,
      featured: false,
      bedrooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      area: Number(values.area),
      latitude: 8.99,
      longitude: 38.76,
      agentName: "You",
      agentPhone: "+251 900 000 000",
      housePlanDocuments: normalizeAttachments(values.housePlanDocuments),
      createdAt: new Date().toISOString()
    };

    properties = [newProperty, ...properties];
    return newProperty;
  },

  async update(propertyId: string, values: ListingFormValues) {
    await delay();
    const index = properties.findIndex((item) => item.id === propertyId);

    if (index === -1) {
      throw new Error("Property not found.");
    }

    const updatedProperty: Property = {
      ...properties[index],
      title: values.title,
      price: Number(values.price),
      category: values.category,
      type: values.type || properties[index].type,
      location: values.location,
      city: values.location.split(",")[1]?.trim() ?? properties[index].city,
      description: values.description,
      images: values.images,
      bedrooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      area: Number(values.area)
      ,
      housePlanDocuments: normalizeAttachments(values.housePlanDocuments)
    };

    properties[index] = updatedProperty;
    return updatedProperty;
  }
};
