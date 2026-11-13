import type { ReactNode } from "react";

/** Small mono chip with a 1.5px outline in the current text color. */
export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <li
      className={`t-mono border-[1.5px] border-current px-2 py-[3px] text-[0.72rem] leading-[1.35] ${className}`}
    >
      {children}
    </li>
  );
}

export function TagList({
  tags,
  label,
  className = "",
  tagClassName = "",
}: {
  tags: string[];
  label: string;
  className?: string;
  tagClassName?: string;
}) {
  return (
    <ul aria-label={label} className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <Tag key={tag} className={tagClassName}>
          {tag}
        </Tag>
      ))}
    </ul>
  );
}
