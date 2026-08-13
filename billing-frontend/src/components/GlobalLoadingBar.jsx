import React, { useEffect, useRef, useState } from "react";
import { subscribe } from "../services/loadingTracker";

const SLOW_THRESHOLD_MS = 3000;

// Sits right under the "Welcome, Admin" heading. Shows a thin animated bar
// whenever any API request is in flight, and — only if it drags past 3s —
// an amber "waking up the server" note (Render free-tier cold start).
export default function GlobalLoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const slowTimerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribe((activeCount) => {
      const loading = activeCount > 0;
      setIsLoading(loading);

      if (loading) {
        if (!slowTimerRef.current) {
          slowTimerRef.current = setTimeout(() => {
            setIsSlow(true);
          }, SLOW_THRESHOLD_MS);
        }
      } else {
        clearTimeout(slowTimerRef.current);
        slowTimerRef.current = null;
        setIsSlow(false);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(slowTimerRef.current);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="mt-2">
      <div className="h-1 w-full max-w-xs overflow-hidden rounded-full bg-gray-200">
        <div className="h-full w-1/3 animate-loading-bar rounded-full bg-orange-500" />
      </div>
      {isSlow && (
        <p className="mt-1.5 text-xs text-amber-600">
          Waking up the server, this can take a few seconds…
        </p>
      )}
      <style>{`
        @keyframes loading-bar-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-loading-bar {
          animation: loading-bar-slide 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
