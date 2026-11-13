/**
 * Award stamp: a persimmon disc rotated −8° with plum mono text (5.0:1).
 */
export function Stamp({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span
      data-stamp
      className={`t-mono relative inline-grid size-[5.25rem] shrink-0 -rotate-[8deg] place-items-center rounded-full bg-persimmon text-center text-[0.68rem] leading-tight text-plum uppercase ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-[5px] rounded-full border-[1.5px] border-dashed border-plum" />
      <span className="relative px-2">
        <span aria-hidden="true" className="block text-[0.9rem] leading-none">
          ★
        </span>
        <span className="sr-only">Award: </span>
        {text}
      </span>
    </span>
  );
}
