import { api } from "./api";
import { mockPropertiesApi } from "./mockDb";
import { ListingFormValues, Property, PropertyFilters } from "../types";

const fallbackMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

export const propertyService = {
  async list(filters?: PropertyFilters): Promise<Property[]> {
    try {
      const response = await api.get<Property[]>("/properties", {
        params: filters
      });
      return response.data;
    } catch (error) {
      try {
        return await mockPropertiesApi.list(filters);
      } catch (mockError) {
        throw mockError instanceof Error ? mockError : new Error(fallbackMessage(mockError));
      }
    }
  },

  async getById(propertyId: string): Promise<Property> {
    try {
      const response = await api.get<Property>(`/properties/${propertyId}`);
      return response.data;
    } catch (error) {
      try {
        return await mockPropertiesApi.getById(propertyId);
      } catch (mockError) {
        throw mockError instanceof Error ? mockError : new Error(fallbackMessage(mockError));
      }
    }
  },

  async create(values: ListingFormValues): Promise<Property> {
    try {
      const response = await api.post<Property>("/properties", values);
      return response.data;
    } catch (error) {
      try {
        return await mockPropertiesApi.create(values);
      } catch (mockError) {
        throw mockError instanceof Error ? mockError : new Error(fallbackMessage(mockError));
      }
    }
  },

  async update(propertyId: string, values: ListingFormValues): Promise<Property> {
    try {
      const response = await api.put<Property>(`/properties/${propertyId}`, values);
      return response.data;
    } catch (error) {
      try {
        return await mockPropertiesApi.update(propertyId, values);
      } catch (mockError) {
        throw mockError instanceof Error ? mockError : new Error(fallbackMessage(mockError));
      }
    }
  }
};
