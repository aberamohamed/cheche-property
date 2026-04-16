import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { useAuthStore } from "../../src/store/authStore";

export default function AuthLayout() {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Redirect href="/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
