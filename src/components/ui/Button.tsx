import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  /** The small icon on the right. */
  icon?: ReactNode;
};

/**
 * Square, mono, uppercase CTA. Colors come from the panel theme:
 * plum fill + wasabi text on light panels, wasabi fill + plum text on dark ones.
 * The arrow nudges 4px on hover/focus.
 */
export function Button({ href, children, className = "", external, icon = "→" }: ButtonProps) {
  return (
    <a
      href={href}
      className={`btn ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
    >
      <span>{children}</span>
      <span className="btn-arrow" aria-hidden="true">
        {icon}
      </span>
    </a>
  );
}
