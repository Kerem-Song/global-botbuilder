import { FC, useEffect, useRef, useState } from 'react';

export interface ILineContainerProps {
  lines: { start: string; end: string }[];
}

let updateStack: { (): void }[] = [];
let updateLines: { start: string; end: string; update: () => void }[] = [];
export const updateLine = (id: string) => {
  updateStack = [];
  const filtered = updateLines.filter((f) => f.start === id || f.end === id);
  filtered.map((f) => updateStack.push(f.update));
  setTimeout(() => {
    updateStack.map((f) => {
      f();
    });
    updateStack = [];
  }, 10);
};

export const LineContainer: FC<ILineContainerProps> = ({ lines }) => {
  const [selectedLine, setSelectedLine] = useState<{ start: string; end: string }>();
  updateLines = [];
  const addUpdateLines = (start: string, end: string, update: () => void) => {
    updateLines.push({ start, end, update });
  };

  useEffect(() => {
    updateLines.map((ul) => ul.update());
  }, [lines]);
  return (
    <>
      {lines.map((l, i) => (
        <ConnectLine
          onClick={() => {
            console.log(l);
            setSelectedLine(l);
          }}
          key={i}
          startId={l.start}
          endId={l.end}
          addUpdateLines={addUpdateLines}
          active={selectedLine === l}
        />
      ))}
    </>
  );
};

interface IConnectLineProps {
  startId: string;
  endId: string;
  active: boolean;
  onClick: () => void;
  addUpdateLines: (start: string, end: string, update: () => void) => void;
}

const ConnectLine: FC<IConnectLineProps> = ({
  startId,
  endId,
  active,
  onClick,
  addUpdateLines,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const lineMouseRef = useRef<SVGPathElement>(null);

  const stroke = active ? '#003DB2' : '#00B4ED';

  addUpdateLines(startId, endId, () => {
    const start = document.querySelector<HTMLDivElement>(`#${startId}`);
    const end = document.querySelector<HTMLDivElement>(`#${endId}`);
    const canvas = document.querySelector<HTMLDivElement>('.canvasWrapper');

    if (start && end && canvas) {
      const cr = canvas.getBoundingClientRect();
      const sr = start.getBoundingClientRect();
      const er = end.getBoundingClientRect();

      const lineOffset = 5;
      const minLine = 50;
      const outSize = { width: 50, height: 50 };
      const offset = { x: cr.x, y: cr.y };
      const arrowSize = { width: 12, height: 6 };

      const ahw = Math.round(arrowSize.width / 2);

      const shw = Math.round(sr.width / 2);
      const ehw = Math.round(er.width / 2);

      const minX = Math.min(sr.left, sr.right, er.left, er.right);
      const maxX = Math.max(sr.left, sr.right, er.left, er.right);
      const minY = Math.min(sr.top, sr.bottom, er.top, er.bottom);
      const maxY = Math.max(sr.top, sr.bottom, er.top, er.bottom);

      const svgRect = {
        x: minX - offset.x - outSize.width,
        y: minY - offset.y - outSize.height,
        width: Math.max(maxX - minX) + outSize.width * 2,
        height: maxY - minY + outSize.height * 2,
      };
      if (svgRef.current) {
        const translate = `translate(${svgRect.x}px,${svgRect.y}px)`;
        svgRef.current.style.transform = translate;
        svgRef.current.style.width = `${svgRect.width}px`;
        svgRef.current.style.height = `${svgRect.height}px`;
        svgRef.current.style.zIndex = `${Math.min(
          Number(start.parentElement?.style.zIndex),
          Number(end.parentElement?.style.zIndex),
        )}`;
      }

      const arrowPoint = {
        x:
          sr.x < er.x
            ? svgRect.width - outSize.width - ehw - ahw
            : outSize.width + ehw - ahw,
        y:
          sr.y < er.y
            ? er.y - sr.y + outSize.height - arrowSize.height
            : outSize.height - arrowSize.height,
      };

      if (arrowRef.current) {
        const translate = `translate(${arrowPoint.x}px, ${arrowPoint.y}px)`;
        arrowRef.current.style.transform = translate;
      }

      if (lineRef.current && lineMouseRef.current) {
        const ls = {
          x: sr.x - svgRect.x - offset.x + shw,
          y: sr.bottom - svgRect.y - offset.y + 8,
        };

        const l1 = {
          x: ls.x,
          y:
            sr.bottom + minLine < er.top
              ? ls.y + (er.top - sr.bottom) / 2
              : svgRect.height - lineOffset,
        };

        const l2 = {
          x:
            sr.bottom + minLine < er.top
              ? l1.x
              : sr.x < er.x
              ? sr.right < er.left
                ? svgRect.width / 2
                : svgRect.width - lineOffset
              : er.right < sr.left
              ? svgRect.width / 2
              : lineOffset,
          y: l1.y,
        };

        const l3 = {
          x: l2.x,
          y:
            sr.bottom + minLine < er.top
              ? l2.y
              : arrowPoint.y - minLine + lineOffset + arrowSize.height,
        };

        const l4 = {
          x: arrowPoint.x + ahw,
          y: l3.y,
        };

        const end = {
          x: l4.x,
          y: arrowPoint.y,
        };

        const arcSize = Math.min(20, Math.abs(ls.x - end.x) / 2);

        const l1Path =
          l1.x === end.x ? `L ${l1.x} ${l1.y}` : `L ${l1.x} ${l1.y - arcSize}`;

        const q1Path =
          l1.x === end.x
            ? ''
            : `Q ${l1.x} ${l1.y}, ${l1.x - (l1.x < end.x ? -arcSize : arcSize)} ${l1.y}`;

        const l2Path =
          l1.x === l2.x && l1.y === l2.y
            ? ``
            : `L ${l2.x + (l1.x < end.x ? -arcSize : arcSize)} ${l2.y}`;

        const q2Path =
          l1.x === l2.x && l1.y === l2.y
            ? ''
            : `Q ${l2.x} ${l2.y}, ${l2.x} ${l2.y - arcSize}`;

        const l3Path =
          l2.x === l3.x && l2.y === l3.y ? `` : `L ${l3.x} ${l3.y + arcSize}`;

        const q3Path =
          l3.y === l4.y && l2.y === l3.y
            ? ''
            : `Q ${l3.x} ${l3.y}, ${l3.x + (l3.x < end.x ? arcSize : -arcSize)} ${l3.y}`;

        const l4Path =
          l3.x === l4.x && l3.y === l4.y
            ? ``
            : `L ${l4.x - (l3.x < end.x ? arcSize : -arcSize)} ${l4.y}`;

        const q4Path =
          l3.x === l4.x && l3.y === l4.y
            ? ''
            : `Q ${l4.x} ${l4.y}, ${l4.x} ${l4.y + arcSize}`;

        lineRef.current.setAttribute(
          'd',
          //`M ${ls.x} ${ls.y} ${l1Path} ${q1Path} ${l2Path} ${q2Path} L ${l3.x} ${l3.y} L ${l4.x} ${l4.y} L ${end.x} ${end.y}`,
          `M ${ls.x} ${ls.y} ${l1Path} ${q1Path} ${l2Path} ${q2Path} ${l3Path} ${q3Path} ${l4Path} ${q4Path} L ${end.x} ${end.y}`,
        );

        lineMouseRef.current.setAttribute(
          'd',
          //`M ${ls.x} ${ls.y} ${l1Path} ${q1Path} ${l2Path} ${q2Path} L ${l3.x} ${l3.y} L ${l4.x} ${l4.y} L ${end.x} ${end.y}`,
          `M ${ls.x} ${ls.y} ${l1Path} ${q1Path} ${l2Path} ${q2Path} ${l3Path} ${q3Path} ${l4Path} ${q4Path} L ${end.x} ${end.y}`,
        );
      }
    }
  });

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        //transition: 'all 0.15s ease',
        //background: '#FF000011',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <path
        style={{ position: 'absolute' }}
        ref={arrowRef}
        d="M 0 0 L 6 6 L 12 0"
        stroke={stroke}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        style={{
          position: 'absolute',
          transition: 'all 0.01s ease',
        }}
        ref={lineRef}
        stroke={stroke}
        strokeWidth="3"
        strokeDasharray="6 3"
        fill="none"
      />
      <path
        onClick={() => onClick?.()}
        style={{
          position: 'absolute',
          transition: 'all 0.01s ease',
          cursor: 'pointer',
          pointerEvents: 'stroke',
        }}
        ref={lineMouseRef}
        stroke="#FFFFFF01"
        strokeWidth="10"
        fill="none"
      />
    </svg>
  );
};
