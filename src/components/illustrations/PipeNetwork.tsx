import { Illustration, type IllustrationProps } from "./Illustration";

/**
 * Blue Grid: a buried water network. A tube-shaped trunk main with flanges,
 * branch lines with junctions, valves and service risers to the street, and
 * one at-risk segment highlighted with the accent fill and a persimmon marker.
 * While on screen, water beads flow through the pipes and the crack drips.
 * Wide and short: it runs along the bottom of the "how I build" panel.
 */
const TRUNK_Y = 118;
const HALF = 7;
const AT_RISK = { x1: 610, x2: 770 };

const flanges = [120, 300, 470, 610, 770, 930, 1110, 1290, 1450];
const junctions = [
  { x: 210, y: TRUNK_Y },
  { x: 520, y: TRUNK_Y },
  { x: 860, y: TRUNK_Y },
  { x: 1200, y: TRUNK_Y },
  { x: 1380, y: TRUNK_Y },
];

// Branches below the main, with rounded 90° elbows.
const branches = [
  "M210 125 L210 176 Q210 188 222 188 L404 188",
  "M520 125 L520 206 Q520 218 508 218 L330 218",
  "M860 125 L860 172 Q860 184 872 184 L1060 184 Q1072 184 1072 196 L1072 226",
  "M1200 125 L1200 208 Q1200 220 1212 220 L1300 220",
  "M1380 125 L1380 186 Q1380 198 1392 198 L1560 198",
];

// Service risers up to the street, each with a valve.
const risers = [
  { x: 360, valveY: 74 },
  { x: 1010, valveY: 74 },
  { x: 1520, valveY: 74 },
];

export function PipeNetwork(props: IllustrationProps) {
  return (
    <Illustration viewBox="0 0 1600 240" preserveAspectRatio="xMidYMax slice" {...props}>
      {/* street */}
      <line className="s s-dash fade" x1="0" y1="40" x2="1600" y2="40" />
      {[80, 460, 700, 1160, 1420].map((x) => (
        <g key={x} className="fade">
          <ellipse className="s" cx={x} cy="40" rx="18" ry="5" />
        </g>
      ))}

      {/* trunk main as a tube */}
      <line className="s d" x1="0" y1={TRUNK_Y - HALF} x2={AT_RISK.x1} y2={TRUNK_Y - HALF} />
      <line className="s d" x1="0" y1={TRUNK_Y + HALF} x2={AT_RISK.x1} y2={TRUNK_Y + HALF} />
      <line className="s d" x1={AT_RISK.x2} y1={TRUNK_Y - HALF} x2="1600" y2={TRUNK_Y - HALF} />
      <line className="s d" x1={AT_RISK.x2} y1={TRUNK_Y + HALF} x2="1600" y2={TRUNK_Y + HALF} />

      {/* the at-risk segment */}
      <rect
        className="f fade"
        x={AT_RISK.x1}
        y={TRUNK_Y - HALF}
        width={AT_RISK.x2 - AT_RISK.x1}
        height={HALF * 2}
      />
      <rect
        className="s d"
        x={AT_RISK.x1}
        y={TRUNK_Y - HALF}
        width={AT_RISK.x2 - AT_RISK.x1}
        height={HALF * 2}
      />
      <path className="s d" d="M668 111 L678 120 L671 124 L684 125" />
      <g className="fade">
        <line className="s" x1="690" y1={TRUNK_Y - HALF - 4} x2="690" y2="84" />
        <circle className="p amb amb-pulse" cx="690" cy="76" r="16" opacity="0.3" />
        <circle className="p" cx="690" cy="76" r="7" />
      </g>

      {/* water flowing through the network (ambient; runs only on screen) */}
      <path className="flow amb" d={`M0 ${TRUNK_Y} L1600 ${TRUNK_Y}`} />
      {branches.map((d) => (
        <path key={`flow-${d}`} className="flow amb" d={d.replace(/^M(\d+) 125/, `M$1 ${TRUNK_Y}`)} />
      ))}
      {risers.map((r) => (
        <path key={`rise-${r.x}`} className="flow amb flow-slow" d={`M${r.x} ${TRUNK_Y} L${r.x} 40`} />
      ))}

      {/* the leak */}
      {[0, 0.45, 0.9].map((delay) => (
        <circle key={delay} className="ink amb amb-drip" cx="678" cy={TRUNK_Y + HALF + 4} r="2.6" style={{ animationDelay: `${delay}s` }} />
      ))}

      {/* flanges */}
      {flanges.map((x) => (
        <line key={x} className="s d" x1={x} y1={TRUNK_Y - HALF - 6} x2={x} y2={TRUNK_Y + HALF + 6} />
      ))}

      {/* branches + junctions */}
      {branches.map((d) => (
        <path key={d} className="s d" d={d} />
      ))}
      {junctions.map((j) => (
        <g key={j.x} className="fade">
          <circle className="bg" cx={j.x} cy={j.y + HALF + 6} r="6" />
          <circle className="s" cx={j.x} cy={j.y + HALF + 6} r="6" />
        </g>
      ))}
      {[404, 330, 1072, 1300, 1560].map((x, i) => (
        <circle key={x} className="s fade" cx={x} cy={[188, 218, 226, 220, 198][i]} r="4" />
      ))}

      {/* risers + valves */}
      {risers.map((r) => (
        <g key={r.x}>
          <line className="s d" x1={r.x} y1={TRUNK_Y - HALF} x2={r.x} y2="40" />
          <path
            className="s d"
            d={`M${r.x - 10} ${r.valveY - 8} L${r.x + 10} ${r.valveY + 8} L${r.x + 10} ${r.valveY - 8} L${r.x - 10} ${r.valveY + 8} Z`}
          />
        </g>
      ))}
    </Illustration>
  );
}
