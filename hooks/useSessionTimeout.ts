"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_THROTTLE = 30 * 1000; // Throttle activity checks to every 30s

export function useSessionTimeout() {
  const { data: session, status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (status === "authenticated" && session) {
      const startTimeout = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          signOut({
            callbackUrl: "/login?expired=true",
            redirect: true,
          });
        }, SESSION_TIMEOUT);
      };

      startTimeout();

      const resetTimeout = () => {
        const now = Date.now();
        if (now - lastActivityRef.current > ACTIVITY_THROTTLE) {
          lastActivityRef.current = now;
          startTimeout();
        }
      };

      const events = ["mousedown", "keydown", "touchstart", "click"];
      events.forEach((event) => {
        document.addEventListener(event, resetTimeout, { passive: true });
      });

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        events.forEach((event) => {
          document.removeEventListener(event, resetTimeout);
        });
      };
    }
  }, [session, status]);
}
