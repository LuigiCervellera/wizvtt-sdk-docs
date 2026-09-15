import { cn } from "../utils";

export function WanderingEyes({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <>
      <style>{`
        @keyframes loading-ui-wandering-eyes-1 {
          0%, 100% {
            transform: translate(0, 0);
          }
          15% {
            transform: translate(-3px, 0);
          }
          30% {
            transform: translate(3px, 0);
          }
          45% {
            transform: translate(3px, -2px);
          }
          60% {
            transform: translate(-3px, -2px);
          }
          75% {
            transform: translate(0, 2px);
          }
        }
        @keyframes loading-ui-wandering-eyes-2 {
          0%, 100% {
            transform: translate(0, 0);
          }
          15% {
            transform: translate(-3px, 0);
          }
          30% {
            transform: translate(3px, 0);
          }
          45% {
            transform: translate(3px, -2px);
          }
          60% {
            transform: translate(-3px, -2px);
          }
          75% {
            transform: translate(0, 2px);
          }
        }
      `}</style>
      <svg
        viewBox="0 0 48 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("w-12 h-6", className)}
        {...props}
      >
        <ellipse cx="13" cy="12" rx="11" ry="9" stroke="currentColor" strokeWidth="2" fill="none" />
        <ellipse cx="35" cy="12" rx="11" ry="9" stroke="currentColor" strokeWidth="2" fill="none" />
        <g style={{ animation: "loading-ui-wandering-eyes-1 4s ease-in-out infinite" }}>
          <circle cx="13" cy="12" r="3.5" fill="currentColor" />
          <circle cx="14.5" cy="10.5" r="1" fill="var(--color-background, #fff)" />
        </g>
        <g style={{ animation: "loading-ui-wandering-eyes-2 4s ease-in-out infinite" }}>
          <circle cx="35" cy="12" r="3.5" fill="currentColor" />
          <circle cx="36.5" cy="10.5" r="1" fill="var(--color-background, #fff)" />
        </g>
      </svg>
    </>
  );
}
