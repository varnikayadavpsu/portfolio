/** Infinite pixel-font marquee (A). Pure CSS; pauses on hover and under reduced motion. */
export function Marquee({ word, href, label, className = "" }: { word: string; href: string; label: string; className?: string }) {
  const items = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="marquee-item">
      {word} <span className="text-red">·˚✧</span>
    </span>
  ));
  return (
    <a href={href} className={`marquee ${className}`}>
      <span className="sr-only">{label}</span>
      <span className="marquee-track" aria-hidden="true">
        {items}
      </span>
      <span className="marquee-track" aria-hidden="true">
        {items}
      </span>
    </a>
  );
}
