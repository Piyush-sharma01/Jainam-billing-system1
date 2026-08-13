import React, { useEffect, useRef, useState } from "react";
import { Bike } from "lucide-react";
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
    <div>
      <div className="relative h-1 w-full overflow-hidden bg-gray-200">
        <div className="h-full w-1/3 animate-loading-bar bg-orange-500" />
        <Bike
          size={18}
          strokeWidth={2.5}
          className="animate-bike-ride absolute -top-2 text-orange-600"
        />
      </div>
      {isSlow && (
        <p className="flex items-center gap-1.5 px-4 sm:px-6 py-1 text-xs text-amber-600 bg-amber-50">
          <Bike size={14} className="animate-bike-bounce shrink-0" />
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
        @keyframes bike-ride {
          0% { left: -5%; }
          100% { left: 102%; }
        }
        .animate-bike-ride {
          animation: bike-ride 1.8s linear infinite;
        }
        @keyframes bike-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .animate-bike-bounce {
          animation: bike-bounce 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
