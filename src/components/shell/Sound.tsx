"use client";

import { useEffect, useSyncExternalStore } from "react";
import { audioReady, isSfxName, sfx, soundState, unlockAudio } from "@/lib/sound";

/**
 * Wires sound to the whole page:
 *  • the first click/tap/key press unlocks audio (browsers require a gesture);
 *  • clicking anything with data-sfx="name" plays that sound, other links and
 *    buttons get a soft click (data-sfx="none" opts out);
 *  • hovering anything with data-sfx-hover="name" plays that sound once per visit.
 */
export function SoundLayer() {
  useEffect(() => {
    let lastPointer = "mouse";
    const unlock = (e: Event) => {
      lastPointer = e instanceof PointerEvent ? e.pointerType : "keyboard";
      unlockAudio();
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.("[data-sfx], a, button");
      if (!el) return;
      const name = el.getAttribute("data-sfx") ?? undefined;
      if (name === "none") return;
      // a mouse that already heard this object's sound on hover doesn't hear it twice
      if (lastPointer === "mouse" && heard === el && el.getAttribute("data-sfx-hover") === name) return;
      if (isSfxName(name)) sfx[name]();
      else sfx.click();
    };
    let hovered: Element | null = null;
    let heard: Element | null = null;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest?.("[data-sfx-hover]") ?? null;
      if (el === hovered) return;
      hovered = el;
      const name = el?.getAttribute("data-sfx-hover") ?? undefined;
      heard = isSfxName(name) && audioReady() ? el : null;
      if (isSfxName(name)) sfx[name]();
    };
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("pointerover", onOver, true);
    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("pointerover", onOver, true);
    };
  }, []);
  return null;
}

export function useSoundOn() {
  return useSyncExternalStore(soundState.subscribe, soundState.get, soundState.getServer);
}

/** Round ink speaker button for the nav. */
export function SoundToggle({ compact }: { compact: boolean }) {
  const on = useSoundOn();
  return (
    <button
      type="button"
      data-sfx="none"
      aria-pressed={on}
      onClick={() => {
        unlockAudio();
        soundState.set(!on);
        if (!on) window.setTimeout(() => sfx.pop(), 30);
      }}
      className={`pill pill-dark shrink-0 gap-2 px-3 text-[0.9rem] md:px-[1.15em] ${compact ? "min-h-10 py-2" : ""}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
        {on ? (
          <>
            <path d="M15.5 9a4 4 0 0 1 0 6" />
            <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
          </>
        ) : (
          <path d="M16 9.5l5 5M21 9.5l-5 5" />
        )}
      </svg>
      <span className="sr-only md:not-sr-only">{on ? "sound on" : "sound off"}</span>
    </button>
  );
}
