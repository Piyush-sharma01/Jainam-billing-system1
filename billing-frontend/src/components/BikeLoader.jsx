import { useId } from "react";

/**
 * BikeLoader
 * A small, reusable gray-themed loading indicator: a bike icon with
 * independently spinning wheels (via SVG animateTransform), meant to
 * replace plain "Loading..." text inside individual page sections
 * (Catalogue, Products, Clients, Dashboard, InvoiceHistory, etc).
 *
 * The global navbar loading bar is untouched — this is only for
 * in-section loading states.
 *
 * Usage:
 *   import BikeLoader from "../components/BikeLoader";
 *   {loading ? <BikeLoader /> : <ActualContent />}
 *
 * Props:
 *   size  - pixel size of the icon (default 48)
 *   label - optional text under the bike (default "Loading")
 */
export default function BikeLoader({ size = 48, label = "Loading" }) {
  // useId keeps wheel spin animations unique if multiple loaders render at once
  const uid = useId();
  const frontWheelId = `bike-wheel-front-${uid}`;
  const rearWheelId = `bike-wheel-rear-${uid}`;

  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-400">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={label}
      >
        {/* Rear wheel */}
        <g id={rearWheelId}>
          <circle
            cx="16"
            cy="46"
            r="10"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-gray-300"
          />
          {/* spokes */}
          <g stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
            <line x1="16" y1="38" x2="16" y2="54" />
            <line x1="8" y1="46" x2="24" y2="46" />
            <line x1="10.3" y1="40.3" x2="21.7" y2="51.7" />
            <line x1="21.7" y1="40.3" x2="10.3" y2="51.7" />
          </g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 16 46"
            to="360 16 46"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </g>

        {/* Front wheel */}
        <g id={frontWheelId}>
          <circle
            cx="48"
            cy="46"
            r="10"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-gray-300"
          />
          <g stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
            <line x1="48" y1="38" x2="48" y2="54" />
            <line x1="40" y1="46" x2="56" y2="46" />
            <line x1="42.3" y1="40.3" x2="53.7" y2="51.7" />
            <line x1="53.7" y1="40.3" x2="42.3" y2="51.7" />
          </g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 48 46"
            to="360 48 46"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </g>

        {/* Frame */}
        <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
          <path d="M16 46 L28 26 L44 26" />
          <path d="M16 46 L34 46 L48 46" />
          <path d="M28 26 L34 46" />
          <path d="M44 26 L48 46" />
          {/* seat post */}
          <path d="M28 26 L24 18" />
          <line x1="20" y1="18" x2="28" y2="18" />
          {/* handlebar */}
          <path d="M44 26 L46 18" />
          <line x1="42" y1="16" x2="50" y2="16" />
        </g>
      </svg>

      {label ? (
        <span className="text-sm font-medium text-gray-400">{label}</span>
      ) : null}
    </div>
  );
}
