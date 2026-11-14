/** Ink cards for builds with no live site to screenshot (16:10). */
export function ProjectArt({ kind, className = "" }: { kind: "nod" | "terminal" | "fall-alert"; className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label={labels[kind]}>
      <rect width="320" height="200" className="f-paper" />
      <rect width="320" height="200" className="ht-1" opacity="0.18" />
      {kind === "nod" && <Nod />}
      {kind === "terminal" && <Terminal />}
      {kind === "fall-alert" && <FallAlert />}
    </svg>
  );
}

const labels = {
  nod: "Ink drawing: five agents passing interview quotes to ranked feature cards",
  terminal: "Ink drawing: a terminal running mysh",
  "fall-alert": "Ink drawing: a camera spotting a fall and alerting a nurse’s phone",
};

function Nod() {
  const agents = [
    [52, 52],
    [52, 148],
    [118, 100],
    [184, 52],
    [184, 148],
  ];
  return (
    <g>
      {agents.map(([x, y], i) => (
        <g key={i}>
          <path d={`M${x} ${y} L248 ${70 + i * 15}`} className="ink-2" opacity="0.35" strokeDasharray="4 5" />
        </g>
      ))}
      {agents.map(([x, y], i) => (
        <g key={`a${i}`}>
          <circle cx={x} cy={y} r="22" className="ink f-paper" />
          <circle cx={x} cy={y} r="22" className="ht-2" opacity="0.5" />
          <text x={x} y={y + 6} textAnchor="middle" className="svg-pixel" fontSize="17" fill="#141414">
            {i + 1}
          </text>
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={`c${i}`} transform={`translate(${232 + i * 6} ${46 + i * 34}) rotate(${-4 + i * 4})`}>
          <rect width="70" height="44" rx="4" className="ink-2 f-paper" />
          <path d="M10 14 H52 M10 24 H44 M10 34 H36" className="ink-2" opacity="0.6" />
          <text x="60" y="38" textAnchor="end" className="svg-sans" fontSize="11" fontWeight="800" fill="#141414">
            #{i + 1}
          </text>
        </g>
      ))}
    </g>
  );
}

function Terminal() {
  return (
    <g>
      <rect x="28" y="24" width="264" height="152" rx="10" className="ink f-ink" />
      <circle cx="48" cy="42" r="5" className="f-paper" opacity="0.6" />
      <circle cx="64" cy="42" r="5" className="f-paper" opacity="0.4" />
      <circle cx="80" cy="42" r="5" className="f-paper" opacity="0.25" />
      <g className="svg-pixel" fill="#f5f2eb">
        <text x="46" y="80" fontSize="20">
          $ ./mysh
        </text>
        <text x="46" y="106" fontSize="13">
          mysh&gt; cat log | grep err &gt; out
        </text>
        <text x="46" y="128" fontSize="13">
          mysh&gt; sleep 30 &amp;
        </text>
        <text x="46" y="150" fontSize="13">
          [1] 4182
        </text>
      </g>
      <rect x="120" y="140" width="10" height="14" className="f-yellow" />
    </g>
  );
}

function FallAlert() {
  return (
    <g>
      {/* camera */}
      <path d="M30 34 L86 50 L80 70 L26 54 Z" className="ink f-paper" />
      <path d="M58 64 L54 86" className="ink" />
      <path d="M84 60 L170 130" className="ink-2" strokeDasharray="4 6" opacity="0.5" />
      {/* falling figure */}
      <g transform="translate(150 118) rotate(-62)">
        <circle cx="0" cy="-30" r="10" className="ink f-paper" />
        <path d="M0 -20 V12 M0 -10 L-16 2 M0 -10 L16 -2 M0 12 L-10 34 M0 12 L14 32" className="ink f-none" />
      </g>
      <path d="M110 164 H210" className="ink" />
      {/* phone with alert */}
      <rect x="228" y="44" width="62" height="112" rx="10" className="ink f-paper" />
      <rect x="236" y="58" width="46" height="74" rx="3" className="ht-1" />
      <rect x="236" y="76" width="46" height="30" rx="4" className="ink-2 f-paper" />
      <text x="259" y="96" textAnchor="middle" className="svg-sans" fontSize="11" fontWeight="800" fill="#141414">
        FALL!
      </text>
      <path d="M216 70 Q210 80 216 90 M300 70 Q306 80 300 90" className="ink-2 f-none" />
    </g>
  );
}
