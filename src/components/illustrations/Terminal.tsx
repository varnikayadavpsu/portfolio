"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Illustration, type IllustrationProps } from "./Illustration";

/**
 * MyShell: a terminal window running `$ ./mysh`.
 * While on screen it loops: output lines print one by one, the command types
 * itself out, the persimmon block cursor blinks at 1Hz, then it clears and
 * starts over. Under reduced motion it's a still frame with a steady cursor.
 */
const COMMAND = "$ ./mysh";
const FONT_SIZE = 22;
const ADVANCE = FONT_SIZE * 0.6; // JetBrains Mono advances 0.6em per character
const TEXT_X = 28;
const BASELINE = 168;
const CURSOR_X = TEXT_X + ADVANCE * 9; // after "$ ./mysh "
const RULES = [
  { y: 70, x2: 196 },
  { y: 90, x2: 248 },
  { y: 110, x2: 150 },
  { y: 130, x2: 214 },
];

export function Terminal(props: IllustrationProps) {
  const ruleRefs = useRef<(SVGLineElement | null)[]>([]);
  const textRef = useRef<SVGTextElement>(null);
  const cursorRef = useRef<SVGGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const rules = ruleRefs.current.filter((r): r is SVGLineElement => Boolean(r));
    const text = textRef.current;
    const cursor = cursorRef.current;
    if (!text || !cursor) return;

    const typed = { n: COMMAND.length };
    const render = () => {
      const n = Math.round(typed.n);
      text.textContent = COMMAND.slice(0, n);
      const offset = ADVANCE * (n > 0 ? n + 1 : 0) - ADVANCE * 9;
      cursor.setAttribute("transform", `translate(${offset.toFixed(1)} 0)`);
    };

    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.3 });
    tl.set([...rules, text], { opacity: 1 })
      .set(rules, { scaleX: 0, transformOrigin: "0% 50%" })
      .call(() => {
        typed.n = 0;
        render();
      })
      .to(rules, { scaleX: 1, duration: 0.24, ease: "power2.out", stagger: 0.17 }, 0.25)
      .to(typed, { n: COMMAND.length, duration: 0.85, ease: `steps(${COMMAND.length})`, onUpdate: render }, "+=0.35")
      .to({}, { duration: 2.6 })
      .to([...rules, text], { opacity: 0, duration: 0.3, ease: "power1.in" });
    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
      gsap.set([...rules, text], { clearProps: "all" });
      typed.n = COMMAND.length;
      render();
    };
  }, []);

  const onLiveChange = (live: boolean) => {
    const tl = tlRef.current;
    if (!tl) return;
    if (live) tl.play();
    else tl.pause();
  };

  return (
    <Illustration viewBox="0 0 320 220" onLiveChange={onLiveChange} {...props}>
      {/* window */}
      <rect className="s d" x="4" y="4" width="312" height="212" />
      <line className="s d" x1="4" y1="40" x2="316" y2="40" />
      <circle className="f fade" cx="24" cy="22" r="5.5" />
      <circle className="s d" cx="42" cy="22" r="5.5" />
      <circle className="s d" cx="60" cy="22" r="5.5" />

      {/* earlier output, abstracted to rules */}
      <g opacity="0.55">
        {RULES.map((rule, i) => (
          <line
            key={rule.y}
            ref={(el) => {
              ruleRefs.current[i] = el;
            }}
            className="s"
            x1="28"
            y1={rule.y}
            x2={rule.x2}
            y2={rule.y}
          />
        ))}
      </g>

      {/* prompt */}
      <g className="fade">
        <text ref={textRef} x={TEXT_X} y={BASELINE} fontSize={FONT_SIZE}>
          {COMMAND}
        </text>
      </g>
      <g className="fade">
        <g ref={cursorRef}>
          <g className="cursor-blink">
            <rect
              className="p"
              x={CURSOR_X - 3}
              y={BASELINE - FONT_SIZE + 1}
              width={ADVANCE + 6}
              height={FONT_SIZE + 8}
              opacity="0.28"
            />
            <rect className="p" x={CURSOR_X} y={BASELINE - FONT_SIZE + 4} width={ADVANCE} height={FONT_SIZE + 2} />
          </g>
        </g>
      </g>
    </Illustration>
  );
}
