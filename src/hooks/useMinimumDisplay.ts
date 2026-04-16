import { useEffect, useRef, useState } from "react";

export const useMinimumDisplay = (active: boolean, minimumMs = 3000) => {
  const [show, setShow] = useState(active);
  const startedAtRef = useRef<number | null>(active ? Date.now() : null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (active) {
      startedAtRef.current = Date.now();
      setShow(true);
      return;
    }

    if (!show) {
      return;
    }

    const startedAt = startedAtRef.current ?? Date.now();
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(minimumMs - elapsed, 0);

    if (remaining === 0) {
      setShow(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      setShow(false);
      timerRef.current = null;
    }, remaining);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active, minimumMs, show]);

  return show;
};
