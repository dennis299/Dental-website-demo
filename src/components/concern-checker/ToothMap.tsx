import { useMemo } from "react";
import { UPPER_RIGHT, UPPER_LEFT, LOWER_LEFT, LOWER_RIGHT, TOOTH_NAMES } from "./types";

type Props = {
  selected: number[];
  onToggle: (tooth: number) => void;
};

// Arrange 16 teeth across a horseshoe arc.
// upperOrder runs left-to-right visually: patient's upper-right (18..11) then upper-left (21..28)
const upperOrder = [...UPPER_RIGHT, ...UPPER_LEFT]; // 18..11, 21..28
const lowerOrder = [...LOWER_RIGHT.slice().reverse(), ...LOWER_LEFT]; // 41..48 visual? we want 48..41,31..38 left→right
// Visually (patient view, mirrored): left side of screen = patient right.
// Lower row left→right: 48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38
const lowerOrderVisual = [...LOWER_RIGHT, ...LOWER_LEFT];

function arcPosition(index: number, total: number, cx: number, cy: number, rx: number, ry: number, startDeg: number, endDeg: number) {
  const t = total === 1 ? 0.5 : index / (total - 1);
  const deg = startDeg + (endDeg - startDeg) * t;
  const rad = (deg * Math.PI) / 180;
  return { x: cx + rx * Math.cos(rad), y: cy + ry * Math.sin(rad), deg };
}

export const ToothMap = ({ selected, onToggle }: Props) => {
  const upperPositions = useMemo(
    () =>
      upperOrder.map((tooth, i) => ({
        tooth,
        ...arcPosition(i, upperOrder.length, 200, 130, 170, 95, 200, 340),
      })),
    [],
  );
  const lowerPositions = useMemo(
    () =>
      lowerOrderVisual.map((tooth, i) => ({
        tooth,
        ...arcPosition(i, lowerOrderVisual.length, 200, 200, 170, 95, 20, 160),
      })),
    [],
  );

  const isSel = (t: number) => selected.includes(t);

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 400 340"
        className="w-full h-auto max-h-[340px]"
        role="img"
        aria-label="Tooth selector"
      >
        {/* Arches (subtle guides) */}
        <path
          d="M 30 130 Q 200 30 370 130"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <path
          d="M 30 200 Q 200 300 370 200"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <text x="200" y="20" textAnchor="middle" className="fill-muted-foreground" fontSize="10">
          Upper
        </text>
        <text x="200" y="335" textAnchor="middle" className="fill-muted-foreground" fontSize="10">
          Lower
        </text>

        {[...upperPositions, ...lowerPositions].map(({ tooth, x, y, deg }) => {
          const sel = isSel(tooth);
          // Rotate the tooth so its long axis points radially outward.
          const rotation = deg + 90;
          return (
            <g
              key={tooth}
              transform={`translate(${x} ${y}) rotate(${rotation})`}
              onClick={() => onToggle(tooth)}
              tabIndex={0}
              role="button"
              aria-label={`${TOOTH_NAMES[tooth]} (${tooth})${sel ? ", selected" : ""}`}
              aria-pressed={sel}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onToggle(tooth);
                }
              }}
              style={{ cursor: "pointer", outline: "none" }}
            >
              <rect
                x={-7}
                y={-10}
                width={14}
                height={20}
                rx={4}
                ry={5}
                fill={sel ? "hsl(var(--primary))" : "hsl(var(--card))"}
                stroke={sel ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth={1.5}
                className="transition-colors"
              />
              <text
                y={3}
                textAnchor="middle"
                fontSize="7"
                fontWeight={600}
                fill={sel ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))"}
                transform={`rotate(${-rotation})`}
                style={{ pointerEvents: "none" }}
              >
                {tooth}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
