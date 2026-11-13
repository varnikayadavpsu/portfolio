"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { scrollState } from "@/lib/scroll";
import { Illustration, type IllustrationProps } from "./Illustration";

/**
 * Terrametric: a live wireframe globe.
 *
 * Orthographic projection, recomputed every frame while on screen:
 *  • spins on its own, faster while you scroll (Lenis velocity)
 *  • tilts and turns toward the cursor
 *  • field dots ride the surface and fade at the horizon; hot ones pulse
 *  • a satellite orbits (hidden as it passes behind) and beams down to a hot field
 *  • first time it appears, it spins up from a standstill
 * Under reduced motion it's a still drawing.
 */

const CX = 200;
const CY = 200;
const R = 150;
const rad = (deg: number) => (deg * Math.PI) / 180;
const r1 = (n: number) => Math.round(n * 10) / 10;

const BASE_SPIN = rad(28);
const BASE_TILT = rad(22);
const LATS = [-60, -30, 0, 30, 60];
const LONS = Array.from({ length: 12 }, (_, i) => i * 30);
const FIELDS = [
  { lat: 38, lon: 10, hot: true },
  { lat: 30, lon: 40 },
  { lat: 18, lon: 22 },
  { lat: 8, lon: 58, hot: true },
  { lat: -4, lon: 12 },
  { lat: -18, lon: 46 },
  { lat: 46, lon: 52 },
  { lat: 22, lon: -14 },
  { lat: -30, lon: 20, hot: true },
  { lat: 2, lon: 84 },
  { lat: 12, lon: 150, hot: true },
  { lat: -40, lon: 120 },
  { lat: 52, lon: 200 },
  { lat: -8, lon: 230, hot: true },
  { lat: 28, lon: 280 },
  { lat: -22, lon: 310 },
];
const ORBIT = { rx: 186, ry: 62, rot: rad(-24) };

function project(latDeg: number, lonDeg: number, spin: number, tilt: number) {
  const lat = rad(latDeg);
  const lon = rad(lonDeg) - spin;
  const x = Math.cos(lat) * Math.sin(lon);
  const y = Math.sin(lat);
  const z = Math.cos(lat) * Math.cos(lon);
  const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
  const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
  return { X: CX + R * x, Y: CY - R * y2, z: z2 };
}

/** One path string per grid line: only the front-facing runs, joined with M. */
function line(sample: (t: number) => { X: number; Y: number; z: number }, steps: number) {
  let d = "";
  let open = false;
  for (let i = 0; i <= steps; i++) {
    const p = sample(i / steps);
    if (p.z > 0.02) {
      d += `${open ? "L" : "M"}${r1(p.X)} ${r1(p.Y)}`;
      open = true;
    } else open = false;
  }
  return d || "M0 0";
}

const latPath = (lat: number, spin: number, tilt: number) => line((t) => project(lat, t * 360, spin, tilt), 120);
const lonPath = (lon: number, spin: number, tilt: number) => line((t) => project(-90 + t * 180, lon, spin, tilt), 60);
const fade = (z: number) => Math.round(Math.min(1, Math.max(0, (z - 0.02) / 0.18)) * 100) / 100;

function orbitPoint(a: number) {
  const lx = ORBIT.rx * Math.cos(a);
  const ly = ORBIT.ry * Math.sin(a);
  const c = Math.cos(ORBIT.rot);
  const s = Math.sin(ORBIT.rot);
  return { X: CX + lx * c - ly * s, Y: CY + lx * s + ly * c, behind: Math.sin(a) < 0 };
}

// Server-rendered starting frame (identical on the client, so hydration matches).
const START_SAT = rad(-30);
const initialLats = LATS.map((lat) => latPath(lat, BASE_SPIN, BASE_TILT));
const initialLons = LONS.map((lon) => lonPath(lon, BASE_SPIN, BASE_TILT));
const initialFields = FIELDS.map((f) => project(f.lat, f.lon, BASE_SPIN, BASE_TILT));
const initialSat = orbitPoint(START_SAT);

export function Globe({ className }: IllustrationProps) {
  const bodyRef = useRef<SVGGElement>(null);
  const latRefs = useRef<(SVGGeometryElement | null)[]>([]);
  const lonRefs = useRef<(SVGGeometryElement | null)[]>([]);
  const dotRefs = useRef<(SVGGElement | null)[]>([]);
  const satRef = useRef<SVGGElement>(null);
  const beamRef = useRef<SVGLineElement>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const enteredRef = useRef(false);
  const stateRef = useRef({ spin: BASE_SPIN, tilt: BASE_TILT, turn: 0, sat: START_SAT, boost: 0, beamT: 1.2, beamTarget: -1 });

  const start = () => {
    if (stopRef.current) return;
    const st = stateRef.current;
    let raf = 0;
    let last = performance.now();
    let targetTilt = BASE_TILT;
    let targetTurn = 0;

    if (!enteredRef.current) {
      enteredRef.current = true;
      st.boost = rad(560); // spin-up entrance
      if (bodyRef.current) {
        gsap.fromTo(
          bodyRef.current,
          { scale: 0.78, opacity: 0, svgOrigin: `${CX} ${CY}` },
          { scale: 1, opacity: 1, duration: 1.1, ease: "power3.out" },
        );
      }
    }

    const onPointer = (e: PointerEvent) => {
      const svg = bodyRef.current?.ownerSVGElement;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const px = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      const py = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
      targetTurn = px * rad(38);
      targetTilt = BASE_TILT + py * rad(16);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const velocity = scrollState.lenis?.velocity ?? 0;
      st.boost *= Math.exp(-dt / 0.65);
      const scrollSpin = Math.max(-rad(420), Math.min(rad(420), velocity * rad(2.2)));
      st.spin += (rad(18) + st.boost + scrollSpin) * dt;
      const k = Math.min(1, dt * 3.5);
      st.tilt += (targetTilt - st.tilt) * k;
      st.turn += (targetTurn - st.turn) * k;
      const spin = st.spin + st.turn;
      const tilt = st.tilt;

      for (let i = 0; i < LATS.length; i++) latRefs.current[i]?.setAttribute("d", latPath(LATS[i], spin, tilt));
      for (let i = 0; i < LONS.length; i++) lonRefs.current[i]?.setAttribute("d", lonPath(LONS[i], spin, tilt));

      const positions = FIELDS.map((f) => project(f.lat, f.lon, spin, tilt));
      positions.forEach((p, i) => {
        const g = dotRefs.current[i];
        if (!g) return;
        g.setAttribute("transform", `translate(${r1(p.X)} ${r1(p.Y)})`);
        g.style.opacity = String(fade(p.z));
      });

      // satellite
      st.sat += dt * 0.6;
      const sp = orbitPoint(st.sat);
      const inside = Math.hypot(sp.X - CX, sp.Y - CY) < R + 6;
      const hidden = sp.behind && inside;
      if (satRef.current) {
        const ahead = orbitPoint(st.sat + 0.01);
        const angle = (Math.atan2(ahead.Y - sp.Y, ahead.X - sp.X) * 180) / Math.PI;
        satRef.current.setAttribute("transform", `translate(${r1(sp.X)} ${r1(sp.Y)}) rotate(${r1(angle)})`);
        satRef.current.style.opacity = hidden ? "0" : "1";
      }

      // downlink beam: every ~2.4s, to a hot field on the visible side
      st.beamT += dt;
      if (st.beamT > 2.4) {
        st.beamT = 0;
        const hot = FIELDS.map((f, i) => ({ f, i, p: positions[i] })).filter(
          (o) => o.f.hot && o.p.z > 0.25,
        );
        st.beamTarget = hidden || !hot.length ? -1 : hot[Math.floor(Math.random() * hot.length)].i;
      }
      const beam = beamRef.current;
      if (beam) {
        const target = st.beamTarget >= 0 ? positions[st.beamTarget] : null;
        const on = target && !hidden && target.z > 0.1 && st.beamT < 1.1;
        if (on && target) {
          beam.setAttribute("x1", String(r1(sp.X)));
          beam.setAttribute("y1", String(r1(sp.Y)));
          beam.setAttribute("x2", String(r1(target.X)));
          beam.setAttribute("y2", String(r1(target.Y)));
          beam.style.opacity = String(Math.sin((st.beamT / 1.1) * Math.PI));
        } else beam.style.opacity = "0";
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    stopRef.current = () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      stopRef.current = null;
    };
  };

  const onLiveChange = (live: boolean) => {
    if (live) start();
    else stopRef.current?.();
  };

  return (
    <Illustration viewBox="0 0 400 400" draw={false} onLiveChange={onLiveChange} className={className}>
      {/* far half of the orbit, behind the globe */}
      <path
        className="s amb amb-orbit"
        d={`M${-ORBIT.rx} 0 A${ORBIT.rx} ${ORBIT.ry} 0 0 1 ${ORBIT.rx} 0`}
        transform={`translate(${CX} ${CY}) rotate(-24)`}
        opacity="0.8"
      />
      <g ref={bodyRef}>
        {/* the one flat fill */}
        <circle className="f" cx={CX} cy={CY} r={R} />
        <circle className="s" cx={CX} cy={CY} r={R} />
        {initialLats.map((d, i) => (
          <path
            key={`lat${i}`}
            ref={(el) => {
              latRefs.current[i] = el;
            }}
            className="s"
            d={d}
          />
        ))}
        {initialLons.map((d, i) => (
          <path
            key={`lon${i}`}
            ref={(el) => {
              lonRefs.current[i] = el;
            }}
            className="s"
            d={d}
          />
        ))}

        {/* field dots */}
        {FIELDS.map((f, i) => {
          const p = initialFields[i];
          return (
            <g
              key={i}
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              transform={`translate(${r1(p.X)} ${r1(p.Y)})`}
              style={{ opacity: fade(p.z) }}
            >
              {f.hot ? (
                <>
                  <circle className="p amb amb-pulse" r="12" opacity="0.3" style={{ animationDelay: `${(i % 4) * 0.35}s` }} />
                  <circle className="p" r="6.5" opacity="0.35" />
                  <circle className="p" r="4" />
                </>
              ) : (
                <>
                  <circle className="ink" r="7" opacity="0.14" />
                  <circle className="ink" r="3.2" />
                </>
              )}
            </g>
          );
        })}
      </g>

      {/* near half of the orbit, in front of the globe */}
      <path
        className="s amb amb-orbit"
        d={`M${ORBIT.rx} 0 A${ORBIT.rx} ${ORBIT.ry} 0 0 1 ${-ORBIT.rx} 0`}
        transform={`translate(${CX} ${CY}) rotate(-24)`}
        opacity="0.8"
      />

      {/* downlink beam */}
      <line ref={beamRef} className="p-stroke amb amb-beam" x1="0" y1="0" x2="0" y2="0" style={{ opacity: 0 }} />

      {/* satellite */}
      <g ref={satRef} transform={`translate(${r1(initialSat.X)} ${r1(initialSat.Y)}) rotate(-24)`}>
        <rect className="bg" x="-9" y="-7" width="18" height="14" />
        <rect className="s" x="-9" y="-7" width="18" height="14" />
        <rect className="s" x="-31" y="-5" width="16" height="10" />
        <rect className="s" x="15" y="-5" width="16" height="10" />
        <line className="s" x1="-15" y1="0" x2="-9" y2="0" />
        <line className="s" x1="9" y1="0" x2="15" y2="0" />
        <circle className="p amb amb-blink" cx="0" cy="0" r="2.4" />
      </g>
    </Illustration>
  );
}
