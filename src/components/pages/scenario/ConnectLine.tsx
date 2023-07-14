import { useElementHelper, useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { FC, useEffect, useRef } from 'react';

interface IConnectLineProps {
  startId: string;
  endId: string;
  updateKey?: string;
  isNextNode?: boolean;
  isSelected?: boolean;
  active?: boolean;
  highlight?: boolean;
  strokeWidth?: number;
  type: 'blue' | 'green' | 'red' | 'yellow';
  onClick?: () => void;
  onDelete?: () => void;
}

const strokes = {
  blue: ['#00B4ED', '#003DB2'],
  green: ['#25CDAF', '#00826A'],
  red: ['#EE7878', '#AE0000'],
  yellow: ['#FFBD70', '#FF8A00'],
};

export const ConnectLine: FC<IConnectLineProps> = ({
  startId,
  updateKey,
  endId,
  isNextNode,
  active,
  type,
  highlight,
  isSelected,
  strokeWidth = 2,
  onClick,
  onDelete,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const lineMouseRef = useRef<SVGPathElement>(null);
  const deleteRef = useRef<SVGGeometryElement>(null);

  //const stroke = strokes[type][active || highlight ? 1 : 0];
  const stroke = strokes[type][active ? 1 : 0];
  const isBezierMode = useRootState((state) => state.botBuilderReducer.isBezierMode);
  const { addUpdateLines, removeUpdateLines } = useUpdateLines();
  const handleDeleteLine = (e: KeyboardEvent) => {
    console.log('@event????');
    console.log('@event', e, e.key);
    if (active && e.key === 'Delete') {
      onDelete?.();
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', (e) => handleDeleteLine(e));

    return () => {
      window.removeEventListener('keydown', (e) => handleDeleteLine(e));
    };
  }, [active]);

  useEffect(() => {
    const canvas = document.querySelector<HTMLDivElement>('.canvasWrapper');
    const end = document.querySelector<HTMLDivElement>(`#${endId}`);
    const startNode = isNextNode
      ? document.querySelector<HTMLDivElement>(`#${updateKey}`)
      : null;
    addUpdateLines(updateKey || startId, startId, endId, () => {
      const { setSvgStyle, setArrowStyle, setLinePath } = useElementHelper(
        canvas,
        startId,
        end,
        startNode,
        isBezierMode,
      );
      setSvgStyle(svgRef.current);
      setArrowStyle(arrowRef.current);
      setLinePath(lineRef.current, lineMouseRef.current, deleteRef.current);
    });
    return () => {
      removeUpdateLines(updateKey || startId, startId, endId);
    };
  }, [
    svgRef.current,
    arrowRef.current,
    lineRef.current,
    lineMouseRef.current,
    deleteRef.current,
    isBezierMode,
  ]);

  return (
    <svg
      id={`line-${startId}-${endId}`}
      ref={svgRef}
      strokeOpacity={isSelected && !active && !highlight ? 0.2 : 1}
      style={{
        position: 'absolute',
        zIndex: active || highlight ? 1 : 0,
        pointerEvents: 'none',
        //background: '#FF000011',
      }}
    >
      <path
        style={{ position: 'absolute', transition: 'opacity 0.3s ease' }}
        ref={arrowRef}
        d={isNextNode ? 'M 0 0 L 6 6 L 0 12' : 'M 0 0 L 6 6 L 12 0'}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        style={{
          position: 'absolute',
          transition: 'opacity 0.3s ease',
        }}
        ref={lineRef}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={isNextNode ? undefined : '6 3'}
        fill="none"
      />
      <path
        onClick={() => onClick?.()}
        style={{
          position: 'absolute',
          transition: 'opacity 0.3s ease',
          cursor: 'pointer',
          pointerEvents: 'stroke',
        }}
        ref={lineMouseRef}
        //strokeOpacity={highlight ? 0.3 : 0}
        strokeOpacity={0}
        stroke={stroke}
        strokeWidth={Math.max(strokeWidth + 7, 20)}
        fill="none"
      />
      <g
        ref={deleteRef}
        opacity={active ? 1 : 0}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (active) {
            onDelete?.();
          } else {
            onClick?.();
          }
        }}
        style={{ pointerEvents: 'all', cursor: 'pointer' }}
      >
        <circle cx={8} cy={8} r={14} fill="#323232" opacity={0.9} />
        <path
          d="M3.33337 4.66669H12.6667V13.3334C12.6667 13.687 12.5261 14.0261 12.2761 14.2761C12.026 14.5262 11.687 14.6667 11.3334 14.6667H4.66671C4.31309 14.6667 3.97388 14.5262 3.72384 14.2761C3.47379 14.0261 3.33337 13.687 3.33337 13.3334V4.66669Z"
          stroke="#FFFFFF"
          fill="transparent"
          strokeWidth="1.2"
          strokeMiterlimit="10"
        />
        <path
          d="M1.33337 4.66666H3.76664C4.03178 4.66612 4.29077 4.58658 4.51046 4.43815C4.73014 4.28971 4.90062 4.07911 5.00004 3.83333L5.66671 2.17333C5.76509 1.9263 5.93505 1.71429 6.15483 1.56461C6.3746 1.41493 6.63404 1.3344 6.89994 1.33333H9.09998C9.36588 1.3344 9.62532 1.41493 9.84509 1.56461C10.0649 1.71429 10.235 1.9263 10.3334 2.17333L11 3.83333C11.0999 4.08017 11.2712 4.2915 11.4922 4.44002C11.7132 4.58854 11.9737 4.66745 12.2399 4.66666H14.6667"
          stroke="#FFFFFF"
          fill="transparent"
          strokeWidth="1.2"
          strokeMiterlimit="10"
        />
      </g>
    </svg>
  );
};
