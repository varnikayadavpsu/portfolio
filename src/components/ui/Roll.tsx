/** A rolling odometer number: each digit is a 0–9 strip that slides into place. */
export function Roll({ value, className = "" }: { value: string; className?: string }) {
  return (
    <span className={`roll ${className}`} aria-hidden="true">
      {Array.from(value).map((ch, i) => {
        const d = Number(ch);
        if (Number.isNaN(d)) return <span key={i}>{ch}</span>;
        return (
          <span key={i} className="roll-col" style={{ transform: `translateY(${-d}em)` }}>
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
