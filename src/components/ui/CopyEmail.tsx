"use client";

import { useEffect, useRef, useState } from "react";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts / older browsers.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/** Small icon button that copies the email address and shows a "copied ✓" toast. */
export function CopyEmail({ email, label, toast }: { email: string; label: string; toast: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async () => {
    if (await copyText(email)) {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="grid h-full min-h-12 w-12 place-items-center sm:w-14 border-[1.5px] border-ice text-ice transition-colors duration-200 hover:bg-ice hover:text-plum"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" focusable="false">
          <g fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round">
            <rect x="8" y="8" width="12" height="12" />
            <path d="M16 8V4H4v12h4" />
          </g>
        </svg>
      </button>
      <p
        role="status"
        aria-live="polite"
        className={`t-mono pointer-events-none absolute top-full left-1/2 mt-3 -translate-x-1/2 bg-wasabi px-3 py-1.5 text-[0.75rem] whitespace-nowrap text-plum transition-opacity duration-200 ${
          copied ? "opacity-100" : "opacity-0"
        }`}
      >
        {copied ? toast : ""}
      </p>
    </div>
  );
}
