import { api } from "./api";
import { mockAuth } from "./mockDb";
import { AuthCredentials, User } from "../types";

interface AuthResponse {
  token: string;
  user: User;
}

const fallbackMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    } catch (error) {
      try {
        return await mockAuth.login(credentials);
      } catch (mockError) {
        throw mockError instanceof Error ? mockError : new Error(fallbackMessage(mockError));
      }
    }
  },

  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/auth/register", credentials);
      return response.data;
    } catch (error) {
      try {
        return await mockAuth.register(credentials);
      } catch (mockError) {
        throw mockError instanceof Error ? mockError : new Error(fallbackMessage(mockError));
      }
    }
  }
};
