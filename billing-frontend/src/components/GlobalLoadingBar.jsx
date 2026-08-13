import React, { useEffect, useState, useRef } from "react";

// Listens for api-loading-start / api-loading-end events fired from
// services/api.js on every request. Mounted once in App.jsx so it shows
// on every page without each page needing its own loading state.
export default function GlobalLoadingBar() {
  const [loading, setLoading] = useState(false);
  const [slowLoad, setSlowLoad] = useState(false);
  const slowTimerRef = useRef(null);

  useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      slowTimerRef.current = setTimeout(() => setSlowLoad(true), 3000);
    };
    const handleEnd = () => {
      clearTimeout(slowTimerRef.current);
      setLoading(false);
      setSlowLoad(false);
    };

    window.addEventListener("api-loading-start", handleStart);
    window.addEventListener("api-loading-end", handleEnd);
    return () => {
      window.removeEventListener("api-loading-start", handleStart);
      window.removeEventListener("api-loading-end", handleEnd);
      clearTimeout(slowTimerRef.current);
    };
  }, []);

  if (!loading) return null;

  return (
    <>
      {/* Slim progress bar pinned to the very top of the viewport */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-secondary/20 overflow-hidden">
        <div className="h-full w-1/3 bg-secondary animate-[loading-bar_1.1s_ease-in-out_infinite]" />
      </div>

      {/* Only appears once a request has been hanging for 3s+ — this is
          what catches a Render cold start without flashing on every
          normal, fast request. */}
      {slowLoad && (
        <div className="fixed top-1 left-1/2 -translate-x-1/2 z-[100] bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm rounded-lg px-4 py-2 shadow-sm mt-2 max-w-[90vw] text-center">
          Waking up the server — first load can take up to 30 seconds if the app
          has been idle.
        </div>
      )}

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </>
  );
}
