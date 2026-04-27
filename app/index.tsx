import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../src/store/authStore";

export default function Index() {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) {
      return;
    }

    redirected.current = true;
    router.replace(token ? "/home" : "/login");
  }, [router, token]);

  return null;
}
