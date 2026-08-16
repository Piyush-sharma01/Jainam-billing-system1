import { useRef, useState, useCallback } from "react";

/**
 * PullToRefresh
 * Replaces the native browser/PWA pull-to-refresh spinner with a
 * custom in-app pull gesture + animated indicator.
 *
 * IMPORTANT companion step: you must also disable the native
 * overscroll behavior in CSS (see index.css snippet below), otherwise
 * both the native Chrome spinner AND this component will show at once.
 *
 * Usage — wrap your page/route content:
 *   <PullToRefresh onRefresh={loadDashboardData}>
 *     <Dashboard content... />
 *   </PullToRefresh>
 *
 * Props:
 *   onRefresh   - async function to call when the user releases past threshold
 *   threshold   - px of pull distance required to trigger refresh (default 70)
 *   maxPull     - px cap on how far the indicator can be dragged (default 120)
 */
export default function PullToRefresh({
  onRefresh,
  threshold = 70,
  maxPull = 120,
  children,
}) {
  const containerRef = useRef(null);
  const startY = useRef(0);
  const pulling = useRef(false);

  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const atTop = () => {
    const el = containerRef.current;
    if (!el) return window.scrollY === 0;
    return el.scrollTop <= 0;
  };

  const handleTouchStart = useCallback((e) => {
    if (!atTop() || refreshing) return;
    startY.current = e.touches[0].clientY;
    pulling.current = true;
  }, [refreshing]);

  const handleTouchMove = useCallback((e) => {
    if (!pulling.current || refreshing) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta <= 0) {
      setPullDistance(0);
      return;
    }
    // resistance curve so it feels elastic, not linear
    const resisted = Math.min(maxPull, delta * 0.5);
    setPullDistance(resisted);
  }, [refreshing, maxPull]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pullDistance >= threshold) {
      setRefreshing(true);
      setPullDistance(threshold); // hold indicator while refreshing
      try {
        await onRefresh?.();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, onRefresh]);

  const progress = Math.min(1, pullDistance / threshold);
  const showIndicator = pullDistance > 0 || refreshing;

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        overscrollBehaviorY: "contain",
        WebkitOverflowScrolling: "touch",
        position: "relative",
        minHeight: "100%",
      }}
    >
      {/* Custom pull indicator */}
      <div
        style={{
          height: showIndicator ? pullDistance : 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          transition: pulling.current ? "none" : "height 0.2s ease-out",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            transform: refreshing
              ? "none"
              : `rotate(${progress * 360}deg)`,
            animation: refreshing ? "ptr-spin 0.7s linear infinite" : "none",
            opacity: 0.3 + progress * 0.7,
          }}
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="#9CA3AF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="42 14"
          />
        </svg>
      </div>

      {children}

      <style>{`
        @keyframes ptr-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
