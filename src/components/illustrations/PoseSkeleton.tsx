"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Illustration, type IllustrationProps } from "./Illustration";

/**
 * WatchCare-AI: a pose-estimation skeleton inside a detection box.
 * While on screen it loops through standing → leaning → slumped; the box
 * tracks the body, a scan line sweeps it, and the persimmon alert blinks
 * while the figure is down. Under reduced motion it holds the mid-slump pose.
 */
type Pose = Record<string, [number, number]>;

const JOINTS = [
  "nose",
  "lShoulder",
  "rShoulder",
  "lElbow",
  "rElbow",
  "lWrist",
  "rWrist",
  "lHip",
  "rHip",
  "lKnee",
  "rKnee",
  "lAnkle",
  "rAnkle",
] as const;

const STANDING: Pose = {
  nose: [170, 66],
  lShoulder: [140, 108],
  rShoulder: [200, 108],
  lElbow: [128, 160],
  rElbow: [214, 160],
  lWrist: [124, 210],
  rWrist: [220, 210],
  lHip: [152, 206],
  rHip: [190, 206],
  lKnee: [150, 266],
  rKnee: [194, 266],
  lAnkle: [148, 326],
  rAnkle: [196, 326],
};
const LEANING: Pose = {
  nose: [168, 74],
  lShoulder: [132, 118],
  rShoulder: [196, 110],
  lElbow: [106, 166],
  rElbow: [226, 152],
  lWrist: [116, 214],
  rWrist: [252, 194],
  lHip: [138, 218],
  rHip: [184, 214],
  lKnee: [108, 270],
  rKnee: [206, 268],
  lAnkle: [88, 326],
  rAnkle: [234, 318],
};
const SLUMPED: Pose = {
  nose: [118, 214],
  lShoulder: [104, 252],
  rShoulder: [150, 232],
  lElbow: [78, 286],
  rElbow: [190, 254],
  lWrist: [96, 320],
  rWrist: [228, 262],
  lHip: [170, 300],
  rHip: [204, 286],
  lKnee: [222, 322],
  rKnee: [256, 300],
  lAnkle: [270, 338],
  rAnkle: [296, 326],
};

const BONES: [string, string][] = [
  ["lShoulder", "rShoulder"],
  ["lShoulder", "lElbow"],
  ["lElbow", "lWrist"],
  ["rShoulder", "rElbow"],
  ["rElbow", "rWrist"],
  ["lShoulder", "lHip"],
  ["rShoulder", "rHip"],
  ["lHip", "rHip"],
  ["lHip", "lKnee"],
  ["lKnee", "lAnkle"],
  ["rHip", "rKnee"],
  ["rKnee", "rAnkle"],
];

const flat = (pose: Pose) =>
  Object.fromEntries(JOINTS.flatMap((k) => [[`${k}X`, pose[k][0]], [`${k}Y`, pose[k][1]]])) as Record<string, number>;

function geometry(p: Record<string, number>) {
  const at = (k: string): [number, number] => [p[`${k}X`], p[`${k}Y`]];
  const ls = at("lShoulder");
  const rs = at("rShoulder");
  const neck: [number, number] = [(ls[0] + rs[0]) / 2, (ls[1] + rs[1]) / 2];
  const nose = at("nose");
  // head sits just beyond the nose, away from the neck
  const dx = nose[0] - neck[0];
  const dy = nose[1] - neck[1];
  const len = Math.hypot(dx, dy) || 1;
  const head: [number, number] = [nose[0] + (dx / len) * 6, nose[1] + (dy / len) * 6 - 6];
  const xs = [...JOINTS.map((k) => p[`${k}X`]), head[0] - 26, head[0] + 26];
  const ys = [...JOINTS.map((k) => p[`${k}Y`]), head[1] - 26];
  const box = {
    x1: Math.min(...xs) - 22,
    y1: Math.min(...ys) - 16,
    x2: Math.max(...xs) + 22,
    y2: Math.max(...ys) + 16,
  };
  return { at, neck, head, box };
}

const bracket = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }, l = 24) =>
  `M${x1} ${y1 + l} V${y1} H${x1 + l} M${x2 - l} ${y1} H${x2} V${y1 + l} M${x2} ${y2 - l} V${y2} H${x2 - l} M${x1 + l} ${y2} H${x1} V${y2 - l}`;

const START = flat(LEANING);
const g0 = geometry(START);
const f1 = (n: number) => n.toFixed(1);

export function PoseSkeleton(props: IllustrationProps) {
  const boneRefs = useRef<(SVGLineElement | null)[]>([]);
  const jointRefs = useRef<(SVGGElement | null)[]>([]);
  const headRef = useRef<SVGCircleElement>(null);
  const neckRef = useRef<SVGLineElement>(null);
  const boxRef = useRef<SVGGeometryElement>(null);
  const alertRef = useRef<SVGCircleElement>(null);
  const scanRef = useRef<SVGLineElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const state = { ...START, scan: 0, alert: 0 };
    const render = () => {
      const { at, neck, head, box } = geometry(state);
      BONES.forEach(([a, b], i) => {
        const el = boneRefs.current[i];
        if (!el) return;
        const [x1, y1] = at(a);
        const [x2, y2] = at(b);
        el.setAttribute("x1", f1(x1));
        el.setAttribute("y1", f1(y1));
        el.setAttribute("x2", f1(x2));
        el.setAttribute("y2", f1(y2));
      });
      JOINTS.forEach((k, i) => {
        const [x, y] = at(k);
        jointRefs.current[i]?.setAttribute("transform", `translate(${f1(x)} ${f1(y)})`);
      });
      headRef.current?.setAttribute("cx", f1(head[0]));
      headRef.current?.setAttribute("cy", f1(head[1]));
      neckRef.current?.setAttribute("x1", f1(neck[0]));
      neckRef.current?.setAttribute("y1", f1(neck[1]));
      neckRef.current?.setAttribute("x2", f1(head[0]));
      neckRef.current?.setAttribute("y2", f1(head[1] + 26));
      boxRef.current?.setAttribute("d", bracket(box));
      alertRef.current?.setAttribute("cx", f1(box.x2));
      alertRef.current?.setAttribute("cy", f1(box.y1));
      if (alertRef.current) alertRef.current.style.opacity = String(state.alert);
      const y = box.y1 + (box.y2 - box.y1) * state.scan;
      scanRef.current?.setAttribute("x1", f1(box.x1 + 6));
      scanRef.current?.setAttribute("x2", f1(box.x2 - 6));
      scanRef.current?.setAttribute("y1", f1(y));
      scanRef.current?.setAttribute("y2", f1(y));
    };

    const tl = gsap.timeline({ paused: true, repeat: -1, onUpdate: render });
    tl.set(state, { alert: 0 })
      .to(state, { ...flat(STANDING), duration: 1.1, ease: "power2.inOut" })
      .to({}, { duration: 1.2 })
      .to(state, { ...flat(LEANING), duration: 0.9, ease: "power2.in" })
      .to(state, { ...flat(SLUMPED), duration: 0.6, ease: "power3.in" })
      .to(state, { alert: 1, duration: 0.01 })
      .to(state, { alert: 0.15, duration: 0.25, repeat: 5, yoyo: true, ease: "none" })
      .to(state, { alert: 0, duration: 0.2 })
      .to(state, { ...flat(LEANING), duration: 1, ease: "power2.inOut" });
    // scan line sweeps continuously, independent of the pose loop
    const sweeps = Math.max(1, Math.floor(tl.duration() / 1.6));
    tl.to(state, { scan: 1, duration: tl.duration() / sweeps, ease: "none", repeat: sweeps - 1 }, 0);
    tlRef.current = tl;

    return () => {
      tl.kill();
      tlRef.current = null;
      Object.assign(state, START, { scan: 0, alert: 0 });
      render();
    };
  }, []);

  const onLiveChange = (live: boolean) => {
    if (live) tlRef.current?.play();
    else tlRef.current?.pause();
  };

  return (
    <Illustration viewBox="0 0 340 364" onLiveChange={onLiveChange} {...props}>
      {/* detection box + scan line */}
      <path ref={boxRef} className="s d" d={bracket(g0.box)} />
      <line
        ref={scanRef}
        className="s fade"
        x1={g0.box.x1 + 6}
        y1={g0.box.y1}
        x2={g0.box.x2 - 6}
        y2={g0.box.y1}
        opacity="0.35"
      />
      <circle ref={alertRef} className="p" cx={g0.box.x2} cy={g0.box.y1} r="6" style={{ opacity: 0 }} />

      {/* head + neck */}
      <circle ref={headRef} className="s d" cx={g0.head[0]} cy={g0.head[1]} r="26" />
      <line
        ref={neckRef}
        className="s d"
        x1={g0.neck[0]}
        y1={g0.neck[1]}
        x2={g0.head[0]}
        y2={g0.head[1] + 26}
      />

      {/* bones */}
      {BONES.map(([a, b], i) => {
        const [x1, y1] = g0.at(a);
        const [x2, y2] = g0.at(b);
        return (
          <line
            key={`${a}-${b}`}
            ref={(el) => {
              boneRefs.current[i] = el;
            }}
            className="s d"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />
        );
      })}

      {/* ground */}
      <line className="s s-dash fade" x1="20" y1="350" x2="320" y2="350" opacity="0.7" />

      {/* joints */}
      <g className="fade">
        {JOINTS.map((k, i) => {
          const [x, y] = g0.at(k);
          return (
            <g
              key={k}
              ref={(el) => {
                jointRefs.current[i] = el;
              }}
              transform={`translate(${x} ${y})`}
            >
              <circle className="f" r="6.5" />
              <circle className="s" r="6.5" />
            </g>
          );
        })}
      </g>
    </Illustration>
  );
}
