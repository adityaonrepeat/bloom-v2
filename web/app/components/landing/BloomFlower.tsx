const CX = 300;
const CY = 310;

const layers = [
  { count: 8,  cy: 178, ry: 132, rx: 52, base: "#A84030", tip: "#C85848", offset: 0 },
  { count: 8,  cy: 196, ry: 114, rx: 45, base: "#BE5845", tip: "#D87060", offset: 22.5 },
  { count: 7,  cy: 213, ry: 97,  rx: 38, base: "#CC6E5B", tip: "#E0886F", offset: 12.9 },
  { count: 6,  cy: 228, ry: 82,  rx: 32, base: "#D88470", tip: "#ECA080", offset: 15 },
  { count: 5,  cy: 242, ry: 68,  rx: 27, base: "#E29680", tip: "#F4B096", offset: 18 },
  { count: 5,  cy: 254, ry: 56,  rx: 22, base: "#ECB096", tip: "#FAC8AD", offset: 0 },
  { count: 4,  cy: 264, ry: 46,  rx: 18, base: "#F2C4A8", tip: "#FFDABE", offset: 22.5 },
  { count: 4,  cy: 273, ry: 37,  rx: 14, base: "#F8D8C4", tip: "#FFECE0", offset: 45 },
  { count: 3,  cy: 281, ry: 29,  rx: 11, base: "#FDEEE5", tip: "#FFFBF8", offset: 30 },
];

export default function BloomFlower({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {layers.map((l, i) => (
          <linearGradient
            key={i}
            id={`bp${i}`}
            x1="0.5"
            y1="0"
            x2="0.5"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor={l.tip} />
            <stop offset="100%" stopColor={l.base} />
          </linearGradient>
        ))}
        {layers.map((_, i) => (
          <filter
            key={i}
            id={`bs${i}`}
            x="-60%"
            y="-60%"
            width="220%"
            height="220%"
          >
            <feDropShadow
              dx="0"
              dy={5 - i * 0.5}
              stdDeviation={4.5 - i * 0.4}
              floodColor="#4A1005"
              floodOpacity={Math.max(0.04, 0.22 - i * 0.022)}
            />
          </filter>
        ))}
      </defs>

      {layers.map((layer, li) => (
        <g key={li} filter={`url(#bs${li})`}>
          {Array.from({ length: layer.count }, (_, i) => {
            const angle = (360 / layer.count) * i + layer.offset;
            return (
              <ellipse
                key={i}
                cx={CX}
                cy={layer.cy}
                rx={layer.rx}
                ry={layer.ry}
                fill={`url(#bp${li})`}
                transform={`rotate(${angle} ${CX} ${CY})`}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}
