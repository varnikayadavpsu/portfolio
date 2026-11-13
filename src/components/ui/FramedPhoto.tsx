import Image from "next/image";
import { withBase } from "@/lib/assets";
import { Frame } from "./Frame";

type FramedPhotoProps = {
  /** /public path, or null to show the placeholder. */
  src: string | null;
  alt: string;
  objectPosition: string;
  sizes: string;
  preload?: boolean;
  /** Shown on the placeholder when the photo file is missing. */
  placeholderPath: string;
  placeholderTone?: "plum" | "wasabi";
  className?: string;
  /** Extra attributes for the wrapper, e.g. data-wipe for a reveal. */
  wrapperProps?: Record<`data-${string}`, string>;
};

/**
 * A photo with concave ticket-stub corners and a 1.5px frame line, matching
 * the panel frames (the line uses currentColor: plum on light panels, ice on dark).
 * Full color, no filters. If the file is missing, a labeled placeholder stands in.
 * The image drifts inside its frame as you scroll ([data-parallax-img]) and
 * zooms a touch on hover.
 */
export function FramedPhoto({
  src,
  alt,
  objectPosition,
  sizes,
  preload,
  placeholderPath,
  placeholderTone = "plum",
  className = "",
  wrapperProps,
}: FramedPhotoProps) {
  return (
    <div className={`photo-zoom relative ${className}`} {...wrapperProps}>
      <div className="concave absolute inset-0 overflow-hidden">
        {src ? (
          <Image
            src={withBase(src)}
            alt={alt}
            fill
            preload={preload}
            fetchPriority={preload ? "high" : undefined}
            sizes={sizes}
            className="object-cover"
            style={{ objectPosition }}
            data-parallax-img=""
          />
        ) : (
          <div
            className={`grid h-full w-full place-items-center p-8 ${
              placeholderTone === "plum" ? "bg-plum text-wasabi" : "bg-wasabi text-plum"
            }`}
          >
            <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden="true" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1.5" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <p className="t-mono relative max-w-[18rem] bg-inherit px-3 py-2 text-center text-[0.8rem] uppercase">
              Add photo:
              <br />
              <span className="normal-case">public{placeholderPath}</span>
            </p>
          </div>
        )}
      </div>
      <Frame inset={0.75} radius={28} />
    </div>
  );
}
