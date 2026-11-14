import { splash } from "@/content/site";

/**
 * Full white screen with the name in big red serif (D). Pure CSS so it's on
 * the first paint; after ~1.2s it slides away. The boot script in layout.tsx
 * turns it off for repeat visits in the same tab session; reduced motion hides it.
 */
export function Splash() {
  return (
    <div className="splash" aria-hidden="true">
      <div className="px-4">
        {splash.lines.map((line) => (
          <span key={line} className="splash-line">
            <span>{line}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
