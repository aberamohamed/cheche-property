import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { AuthCredentials } from "../types";

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (values: AuthCredentials) => authService.login(values),
    onSuccess: (data) => setAuth(data)
  });
};

export const useRegisterMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (values: AuthCredentials) => authService.register(values),
    onSuccess: (data) => setAuth(data)
  });
};
