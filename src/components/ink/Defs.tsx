/**
 * Shared halftone dot patterns for every inline SVG on the page (C's comic
 * shading). Rendered once; other SVGs reference them as url(#ht-1) etc.
 * Kept at 0×0 instead of display:none so browsers still paint the patterns.
 */
export function InkDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <pattern id="ht-1" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="3.5" cy="3.5" r="1.05" fill="#141414" />
        </pattern>
        <pattern id="ht-2" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="3" cy="3" r="1.55" fill="#141414" />
        </pattern>
        <pattern id="ht-3" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <circle cx="2.5" cy="2.5" r="1.95" fill="#141414" />
        </pattern>
      </defs>
    </svg>
  );
}
