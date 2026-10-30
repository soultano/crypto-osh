// Hand-drawn Uzbek scenes: Registan-style madrasa, chust doppi, plov on a
// lagan, cotton-pattern choynak, obi-non, pomegranate, minaret and a city
// skyline. Purely presentational, hidden from assistive tech. Fixed craft
// colours (sand, clay, rice) sit next to the theme tokens so both themes work.

const SAND = "#ecd8b0";
const SAND_DARK = "#d6b882";
const CLAY = "#b8733d";
const INK = "#1b1e26";

// Deterministic scatter so the server and the client draw the same grains.
function scatter(n: number, seed: number) {
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: n }, () => [rnd(), rnd(), rnd()] as const);
}

type ArtProps = { className?: string };

export function Madrasa({ className }: ArtProps) {
  const wingArches = [34, 146];
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="100" cy="186" rx="92" ry="6" fill="var(--lapis-900)" opacity=".12" />
      {/* ribbed turquoise dome behind the portal */}
      <rect x="68" y="80" width="64" height="14" rx="3" fill="var(--majolica)" />
      <path d="M64 84 C62 46 84 30 100 28 C116 30 138 46 136 84Z" fill="var(--turquoise)" />
      {[-26, -14, 0, 14, 26].map((dx) => (
        <path key={dx} d={`M100 29 C${100 + dx * 1.2} 44 ${100 + dx * 1.4} 64 ${100 + dx * 1.3} 84`} stroke="#fff" strokeOpacity=".35" strokeWidth="1.6" fill="none" />
      ))}
      <path d="M100 28V16" stroke="var(--saffron)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="100" cy="14" r="3.5" fill="var(--saffron)" />
      {/* main body */}
      <rect x="22" y="100" width="156" height="84" rx="4" fill={SAND} />
      {wingArches.map((x) => (
        <g key={x}>
          <path d={`M${x} 140V122C${x} 112 ${x + 10} 106 ${x + 10} 106C${x + 10} 106 ${x + 20} 112 ${x + 20} 122V140Z`} fill="var(--lapis-700)" />
          <path d={`M${x} 176V160C${x} 152 ${x + 10} 146 ${x + 10} 146C${x + 10} 146 ${x + 20} 152 ${x + 20} 160V176Z`} fill="var(--lapis-700)" />
          <path d={`M${x + 4} 140V125C${x + 4} 118 ${x + 10} 113 ${x + 10} 113C${x + 10} 113 ${x + 16} 118 ${x + 16} 125V140Z`} fill="var(--majolica)" />
        </g>
      ))}
      {/* minarets */}
      {[8, 178].map((x) => (
        <g key={x}>
          <path d={`M${x} 184L${x + 2} 70H${x + 12}L${x + 14} 184Z`} fill={SAND_DARK} />
          {[90, 118, 146].map((y) => (
            <rect key={y} x={x + 1} y={y} width="12" height="6" fill="var(--majolica)" />
          ))}
          <rect x={x - 1} y="62" width="16" height="9" rx="2" fill="var(--turquoise)" />
          <path d={`M${x} 62C${x} 52 ${x + 7} 48 ${x + 7} 48C${x + 7} 48 ${x + 14} 52 ${x + 14} 62Z`} fill="var(--turquoise)" />
          <circle cx={x + 7} cy="45" r="2" fill="var(--saffron)" />
        </g>
      ))}
      {/* pishtaq portal */}
      <rect x="62" y="66" width="76" height="118" rx="3" fill={SAND_DARK} />
      <rect x="66" y="70" width="68" height="10" fill="var(--turquoise)" />
      {[72, 82, 92, 102, 112, 122].map((x) => (
        <circle key={x} cx={x + 3} cy="75" r="2" fill="#fff" opacity=".85" />
      ))}
      <path d="M74 184V124C74 102 100 88 100 88C100 88 126 102 126 124V184Z" fill="var(--majolica)" />
      <path d="M80 184V126C80 108 100 96 100 96C100 96 120 108 120 126V184Z" fill="var(--lapis-700)" />
      {/* muqarnas hint */}
      {[0, 1, 2].map((r) =>
        [-1, 0, 1].map((c) => <circle key={`${r}${c}`} cx={100 + c * (8 + r * 3)} cy={110 + r * 7} r="2" fill="var(--saffron)" opacity={0.9 - r * 0.2} />),
      )}
      <path d="M90 184V150C90 142 100 136 100 136C100 136 110 142 110 150V184Z" fill={CLAY} />
      <path d="M100 138V184" stroke={INK} strokeOpacity=".35" strokeWidth="1.2" />
      <circle cx="96" cy="164" r="1.5" fill="var(--saffron)" />
      <circle cx="104" cy="164" r="1.5" fill="var(--saffron)" />
    </svg>
  );
}

export function Doppi({ className }: ArtProps) {
  // Chust doppi: black four-sided cap, one corner towards us, white qalampir
  // (pepper) motifs on each face and a thin stitched band at the rim.
  const qalampir = "M0 -22C11 -16 14 -2 8 10C4 18 -4 20 -8 14C-4 14 -1 10 -2 4C-4 -6 -6 -14 0 -22Z";
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="100" cy="164" rx="74" ry="9" fill="var(--lapis-900)" opacity=".14" />
      <path d="M28 136C30 112 38 92 50 78L100 92V154C72 152 46 146 28 136Z" fill={INK} />
      <path d="M100 92L150 78C162 92 170 112 172 136C154 146 128 152 100 154Z" fill="#2a2f3b" />
      <path d="M50 78C64 66 82 60 100 58C118 60 136 66 150 78C134 86 116 90 100 92C84 90 66 86 50 78Z" fill="#363c4b" />
      {/* top: four small peppers meeting in the middle */}
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d={qalampir} fill="#fff" opacity=".9" transform={`translate(100 75) scale(.9 .32) rotate(${a + 45}) translate(0 -20) scale(.5)`} />
      ))}
      <circle cx="100" cy="75" r="2.2" fill="#fff" />
      {/* faces */}
      <path d={qalampir} fill="#fff" transform="translate(66 112) rotate(-8) skewY(14) scale(1.15)" />
      <path d={qalampir} fill="#fff" transform="translate(134 112) rotate(8) skewY(-14) scale(-1.15 1.15)" />
      <path d="M100 92V154" stroke="#fff" strokeOpacity=".22" strokeWidth="1.4" />
      {/* rim band with stitching */}
      <path d="M28 136C46 146 72 152 100 154C128 152 154 146 172 136L171 126C152 136 128 142 100 144C72 142 48 136 29 126Z" fill="#0f1116" />
      <path d="M29 131C48 141 72 147 100 149C128 147 152 141 171 131" stroke="#fff" strokeWidth="1.6" strokeDasharray="3 4" fill="none" opacity=".85" />
      <path d="M58 70C70 64 84 61 96 60" stroke="#fff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Plov({ className }: ArtProps) {
  const rim = Array.from({ length: 22 }, (_, i) => (i / 22) * Math.PI * 2);
  const grains = scatter(90, 7);
  const carrots = scatter(14, 31);
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      {/* steam */}
      <g className="art-steam" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round" opacity=".55">
        <path d="M78 58c-6-8 6-14 0-22s6-14 0-20" />
        <path d="M100 50c-6-8 6-14 0-22s6-14 0-20" />
        <path d="M122 58c-6-8 6-14 0-22s6-14 0-20" />
      </g>
      <ellipse cx="100" cy="176" rx="90" ry="10" fill="var(--lapis-900)" opacity=".12" />
      {/* lagan */}
      <ellipse cx="100" cy="146" rx="90" ry="32" fill="var(--majolica)" />
      {rim.map((a) => (
        <circle key={a} cx={100 + Math.cos(a) * 82} cy={146 + Math.sin(a) * 27} r="2.6" fill="#fff" opacity=".85" />
      ))}
      <ellipse cx="100" cy="144" rx="72" ry="22" fill="var(--cream)" />
      {/* rice mound */}
      <path d="M36 142C46 104 70 84 100 82C130 84 154 104 164 142C130 156 70 156 36 142Z" fill="#f2d48f" />
      {grains.map(([x, y, r], i) => {
        const gx = 46 + x * 108;
        const top = 142 - Math.sin(((gx - 36) / 128) * Math.PI) * 54;
        const gy = top + 6 + y * (142 - top - 4);
        return <ellipse key={i} cx={gx} cy={gy} rx="2.6" ry="1.1" transform={`rotate(${r * 180} ${gx} ${gy})`} fill="#fff8e6" opacity=".9" />;
      })}
      {carrots.map(([x, y, r], i) => {
        const cx = 50 + x * 100;
        const top = 142 - Math.sin(((cx - 36) / 128) * Math.PI) * 54;
        const cy = top + 10 + y * (138 - top - 10);
        return <rect key={i} x={cx - 7} y={cy - 1.8} width="14" height="3.6" rx="1.8" transform={`rotate(${r * 140 - 70} ${cx} ${cy})`} fill="#ea7a2a" />;
      })}
      {/* meat */}
      <rect x="66" y="100" width="20" height="14" rx="6" fill="#7a3b1e" transform="rotate(-12 76 107)" />
      <rect x="112" y="98" width="22" height="14" rx="6" fill="#86441f" transform="rotate(10 123 105)" />
      <rect x="88" y="118" width="18" height="13" rx="6" fill="#6d331a" />
      {/* quail eggs */}
      <ellipse cx="60" cy="126" rx="6" ry="4.5" fill="#fff" />
      <circle cx="60" cy="126" r="2.4" fill="var(--saffron)" />
      <ellipse cx="142" cy="124" rx="6" ry="4.5" fill="#fff" />
      <circle cx="142" cy="124" r="2.4" fill="var(--saffron)" />
      {/* garlic head on top */}
      <path d="M100 66C88 68 84 80 88 88C92 94 108 94 112 88C116 80 112 68 100 66Z" fill="#fbf3e4" />
      <path d="M100 66V92M93 70C90 78 92 88 96 92M107 70C110 78 108 88 104 92" stroke="#d9c7a6" strokeWidth="1.2" fill="none" />
      <path d="M100 66V60" stroke="#a88f62" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Choynak({ className }: ArtProps) {
  const boll = (x: number, y: number, s = 1) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 5} cy={Math.sin((a * Math.PI) / 180) * 5} r="4.2" fill="#fff" stroke="var(--majolica)" strokeWidth="1.6" />
      ))}
      <circle r="2.6" fill="var(--majolica)" />
    </g>
  );
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="96" cy="180" rx="84" ry="8" fill="var(--lapis-900)" opacity=".12" />
      {/* spout and handle */}
      <path d="M50 120C36 114 28 96 22 80C30 80 36 86 40 92C44 100 50 104 58 106Z" fill="#f4f6fb" stroke="var(--majolica)" strokeWidth="2" />
      <path d="M134 98C158 96 162 132 136 142" fill="none" stroke="#f4f6fb" strokeWidth="10" strokeLinecap="round" />
      <path d="M134 98C158 96 162 132 136 142" fill="none" stroke="var(--majolica)" strokeWidth="2" strokeLinecap="round" />
      {/* body */}
      <path d="M56 92C46 112 48 150 62 168H132C146 150 148 112 138 92Z" fill="#f4f6fb" />
      <path d="M56 92H138" stroke="var(--majolica)" strokeWidth="4" />
      <path d="M62 168H132" stroke="var(--majolica)" strokeWidth="4" strokeLinecap="round" />
      {boll(80, 122)}
      {boll(114, 122)}
      {boll(97, 148, 0.8)}
      <path d="M86 122C92 112 106 112 108 122M88 140C94 150 100 150 106 140" stroke="#4b8a3a" strokeWidth="1.6" fill="none" />
      {/* lid */}
      <path d="M66 92C70 78 124 78 128 92Z" fill="#f4f6fb" stroke="var(--majolica)" strokeWidth="2" />
      <circle cx="97" cy="76" r="6" fill="var(--saffron)" />
      {/* piala */}
      <path d="M140 160C140 176 150 182 166 182C182 182 192 176 192 160Z" fill="#f4f6fb" stroke="var(--majolica)" strokeWidth="2" />
      <path d="M144 166H188" stroke="var(--majolica)" strokeWidth="2" />
      <circle cx="158" cy="172" r="2" fill="var(--majolica)" />
      <circle cx="174" cy="172" r="2" fill="var(--majolica)" />
      <ellipse cx="166" cy="160" rx="26" ry="4" fill="#c9893a" />
      <g className="art-steam" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" opacity=".5">
        <path d="M160 150c-4-6 4-10 0-16s4-10 0-14" />
        <path d="M172 152c-4-6 4-10 0-16s4-10 0-14" />
      </g>
    </svg>
  );
}

export function Non({ className }: ArtProps) {
  const ring = (r: number, n: number) => Array.from({ length: n }, (_, i) => (i / n) * Math.PI * 2).map((a) => [100 + Math.cos(a) * r, 100 + Math.sin(a) * r * 0.9]);
  const seeds = scatter(40, 13);
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="100" cy="176" rx="78" ry="8" fill="var(--lapis-900)" opacity=".12" />
      <ellipse cx="100" cy="100" rx="84" ry="76" fill="#c7813c" />
      <ellipse cx="100" cy="96" rx="80" ry="72" fill="#e3a95a" />
      {seeds.map(([a, d, r], i) => {
        const ang = a * Math.PI * 2;
        const rr = 56 + d * 18;
        const x = 100 + Math.cos(ang) * rr;
        const y = 96 + Math.sin(ang) * rr * 0.9;
        return <ellipse key={i} cx={x} cy={y} rx="2.2" ry="1.1" transform={`rotate(${r * 180} ${x} ${y})`} fill="#fff5dc" />;
      })}
      <ellipse cx="100" cy="96" rx="46" ry="41" fill="#f0c98a" />
      {ring(34, 18).map(([x, y], i) => (
        <circle key={`a${i}`} cx={x} cy={y - 4} r="2.2" fill="#b86f2c" />
      ))}
      {ring(22, 12).map(([x, y], i) => (
        <circle key={`b${i}`} cx={x} cy={y - 4} r="2" fill="#b86f2c" />
      ))}
      {ring(10, 6).map(([x, y], i) => (
        <circle key={`c${i}`} cx={x} cy={y - 4} r="1.8" fill="#b86f2c" />
      ))}
      <circle cx="100" cy="92" r="2.4" fill="#b86f2c" />
      <path d="M40 70C56 44 84 32 116 34" stroke="#fff" strokeOpacity=".35" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Anor({ className }: ArtProps) {
  const seeds = scatter(26, 5);
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="104" cy="182" rx="76" ry="8" fill="var(--lapis-900)" opacity=".12" />
      {/* whole fruit */}
      <path d="M60 52L66 36L74 48L82 34L86 50L94 40L92 56Z" fill="#9e2a1f" />
      <circle cx="78" cy="104" r="54" fill="var(--pomegranate)" />
      <path d="M44 84C50 66 66 56 82 56" stroke="#fff" strokeOpacity=".35" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* leaf */}
      <path d="M96 48C112 30 136 30 146 38C130 52 112 54 96 48Z" fill="#3f8a4a" />
      <path d="M98 47C114 42 128 40 144 38" stroke="#2c6a36" strokeWidth="1.4" fill="none" />
      {/* half, showing arils */}
      <ellipse cx="146" cy="148" rx="42" ry="32" fill="#a33223" />
      <ellipse cx="146" cy="146" rx="36" ry="26" fill="#f6d5c6" />
      {seeds.map(([x, y], i) => {
        const a = x * Math.PI * 2;
        const d = Math.sqrt(y);
        return <ellipse key={i} cx={146 + Math.cos(a) * d * 28} cy={146 + Math.sin(a) * d * 19} rx="4" ry="3.4" fill="#d1332a" stroke="#ff8b7d" strokeWidth=".8" />;
      })}
    </svg>
  );
}

export function Minaret({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 120 240" aria-hidden="true">
      <ellipse cx="60" cy="232" rx="44" ry="5" fill="var(--lapis-900)" opacity=".12" />
      <path d="M40 230L46 74H74L80 230Z" fill={SAND_DARK} />
      {[96, 126, 156, 186, 212].map((y, i) => (
        <g key={y}>
          <path d={`M${44.6 - i * 0.9} ${y}H${75.4 + i * 0.9}V${y + 8}H${44.4 - i * 0.9}Z`} fill={i % 2 ? "var(--turquoise)" : "var(--majolica)"} />
          {[0, 1, 2, 3].map((k) => (
            <circle key={k} cx={50 + k * 6.7} cy={y + 4} r="1.4" fill="#fff" opacity=".8" />
          ))}
        </g>
      ))}
      {/* lantern with arched windows */}
      <rect x="38" y="52" width="44" height="24" rx="3" fill={SAND} />
      {[44, 56, 68].map((x) => (
        <path key={x} d={`M${x} 74V62C${x} 58 ${x + 4} 56 ${x + 4} 56C${x + 4} 56 ${x + 8} 58 ${x + 8} 62V74Z`} fill="var(--lapis-700)" />
      ))}
      <path d="M34 54H86L82 46H38Z" fill="var(--turquoise)" />
      <path d="M44 46C44 32 60 26 60 26C60 26 76 32 76 46Z" fill="var(--turquoise)" />
      <path d="M60 26V14" stroke="var(--saffron)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="60" cy="12" r="3" fill="var(--saffron)" />
    </svg>
  );
}

/* A wide old-city silhouette: portals, ribbed domes and minarets. */
export function Skyline({ className }: ArtProps) {
  const dome = (x: number, w: number, h: number, base: number) =>
    `M${x} ${base}C${x} ${base - h * 0.7} ${x + w * 0.25} ${base - h} ${x + w / 2} ${base - h}C${x + w * 0.75} ${base - h} ${x + w} ${base - h * 0.7} ${x + w} ${base}Z`;
  const minaret = (x: number, h: number) => `M${x} 120L${x + 3} ${120 - h}H${x + 13}L${x + 16} 120Z M${x - 2} ${116 - h}H${x + 18}V${122 - h}H${x - 2}Z`;
  const portal = (x: number, w: number, h: number) => `M${x} 120V${120 - h}H${x + w}V120Z`;
  const blocks = [
    [portal(0, 120, 30), dome(20, 60, 36, 92), minaret(130, 70)],
    [portal(160, 200, 46), dome(210, 90, 50, 76), minaret(166, 92), minaret(338, 92), portal(170, 40, 22)],
    [portal(380, 90, 24), dome(392, 60, 30, 96)],
    [portal(480, 240, 58), dome(540, 120, 56, 64), minaret(486, 108), minaret(698, 108)],
    [portal(740, 110, 28), dome(752, 70, 40, 92), minaret(860, 64)],
    [portal(890, 190, 44), dome(935, 90, 46, 76), minaret(896, 86), minaret(1058, 86)],
    [portal(1090, 110, 26), dome(1110, 60, 32, 94)],
  ];
  return (
    <svg className={className} viewBox="0 0 1200 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <g fill="currentColor">
        {blocks.flat().map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}

const registry = { madrasa: Madrasa, doppi: Doppi, plov: Plov, choynak: Choynak, non: Non, anor: Anor, minaret: Minaret };
export type ArtName = keyof typeof registry;

export function Art({ name, className }: { name: ArtName; className?: string }) {
  const C = registry[name];
  return <C className={`art art-${name} ${className ?? ""}`} />;
}

/* A row of everyday Uzbek things laid out like a dastarkhan, for the footer. */
export function Dastarkhan() {
  const row: ArtName[] = ["madrasa", "non", "plov", "doppi", "choynak", "anor", "minaret"];
  return (
    <div className="dastarkhan" aria-hidden="true">
      {row.map((n, i) => (
        <span key={n} className="dastarkhan-item" style={{ "--i": i } as React.CSSProperties}>
          <Art name={n} />
        </span>
      ))}
    </div>
  );
}
