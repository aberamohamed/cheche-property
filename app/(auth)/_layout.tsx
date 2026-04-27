import { useEffect, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "../../src/store/authStore";

export default function AuthLayout() {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (token && !redirected.current) {
      redirected.current = true;
      router.replace("/home");
    }
  }, [router, token]);

  if (token) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
