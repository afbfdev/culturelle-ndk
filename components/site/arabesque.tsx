import { cn } from "@/lib/utils";

type ArabesqueProps = {
  id?: string;
  className?: string;
  size?: number;
};

/**
 * Motif géométrique islamique (étoile à 8 branches « khatim »).
 * Décoratif : faible opacité, hérite de `currentColor` pour le trait.
 */
export function Arabesque({ id = "arabesque", className, size = 64 }: ArabesqueProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none h-full w-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={id}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          >
            <polygon points="32,4 60,32 32,60 4,32" />
            <rect x="12.2" y="12.2" width="39.6" height="39.6" />
            <circle cx="32" cy="32" r="5.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
