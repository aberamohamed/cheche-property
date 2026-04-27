import { api } from "./api";
import { mockAuth } from "./mockDb";
import { AuthCredentials, User } from "../types";
import { buildDisplayNameFromJwt, decodeJwtPayload, resolvePhoneFromJwt } from "../utils/jwt";

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface LoginApiResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

const fallbackMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

const createUserFromToken = (token: string, fallbackPhone = ""): User => {
  const payload = decodeJwtPayload<Record<string, unknown>>(token) ?? {};
  const phone = resolvePhoneFromJwt(payload, fallbackPhone);
  const userId =
    typeof payload["id"] === "string"
      ? payload["id"]
      : typeof payload["user_id"] === "string"
        ? payload["user_id"]
        : typeof payload["cheche_user_id"] === "string"
          ? payload["cheche_user_id"]
          : phone || "user";

  return {
    id: userId,
    name: buildDisplayNameFromJwt(payload, phone || "Relty User"),
    phone,
    token
  };
};

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<LoginApiResponse>("https://realty.cheche.et/api/v1/auth/login-with-password", {
        mobile: credentials.mobile,
        password: credentials.password
      });

      const { accessToken, refreshToken } = response.data.data;
      return {
        token: accessToken,
        refreshToken,
        user: createUserFromToken(accessToken, credentials.mobile)
      };
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
