import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertyService } from "../services/propertyService";
import { ListingFormValues, PropertyFilters } from "../types";

export const propertyKeys = {
  all: ["properties"] as const,
  lists: () => [...propertyKeys.all, "list"] as const,
  list: (filters?: PropertyFilters) => [...propertyKeys.lists(), filters ?? {}] as const,
  details: () => [...propertyKeys.all, "detail"] as const,
  detail: (propertyId: string) => [...propertyKeys.details(), propertyId] as const
};

export const useProperties = (filters?: PropertyFilters) =>
  useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: () => propertyService.list(filters)
  });

export const useProperty = (propertyId?: string) =>
  useQuery({
    queryKey: propertyId ? propertyKeys.detail(propertyId) : propertyKeys.detail("missing"),
    queryFn: () => {
      if (!propertyId) {
        throw new Error("Property id is required.");
      }

      return propertyService.getById(propertyId);
    },
    enabled: Boolean(propertyId)
  });

export const useCreatePropertyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ListingFormValues) => propertyService.create(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    }
  });
};

export const useUpdatePropertyMutation = (propertyId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ListingFormValues) => {
      if (!propertyId) {
        throw new Error("Property id is required.");
      }

      return propertyService.update(propertyId, values);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: propertyKeys.all });
    }
  });
};
