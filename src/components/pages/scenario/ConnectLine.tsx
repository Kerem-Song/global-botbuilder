import useElementHelper from '@hooks/useArrowHelper';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { FC, useEffect, useRef } from 'react';

interface IConnectLineProps {
  startId: string;
  endId: string;
  updateKey?: string;
  isNextNode?: boolean;
  active?: boolean;
  onClick?: () => void;
}
export const ConnectLine: FC<IConnectLineProps> = ({
  startId,
  updateKey,
  endId,
  isNextNode,
  active,
  onClick,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const lineMouseRef = useRef<SVGPathElement>(null);

  const stroke = active ? '#003DB2' : '#00B4ED';

  const { addUpdateLines, removeUpdateLines } = useUpdateLines();

  useEffect(() => {
    const canvas = document.querySelector<HTMLDivElement>('.canvasWrapper');
    const start = document.querySelector<HTMLDivElement>(`#${startId}`);
    const end = document.querySelector<HTMLDivElement>(`#${endId}`);
    const startNode = isNextNode
      ? document.querySelector<HTMLDivElement>(`#${updateKey}`)
      : null;
    addUpdateLines(updateKey || startId, endId, () => {
      const { setSvgStyle, setArrowStyle, setLinePath } = useElementHelper(
        canvas,
        start,
        end,
        startNode,
      );
      setSvgStyle(svgRef.current);
      setArrowStyle(arrowRef.current);
      setLinePath(lineRef.current, lineMouseRef.current);
    });
    return () => {
      removeUpdateLines(updateKey || startId, endId);
    };
  }, [svgRef.current, arrowRef.current, lineRef.current, lineMouseRef.current]);

  return (
    <svg
      id={`line-${startId}-${endId}`}
      ref={svgRef}
      style={{
        position: 'absolute',
        zIndex: 0,
        pointerEvents: 'none',
        //      background: '#FF000011',
      }}
    >
      <path
        style={{ position: 'absolute' }}
        ref={arrowRef}
        d={isNextNode ? 'M 0 0 L 6 6 L 0 12' : 'M 0 0 L 6 6 L 12 0'}
        stroke={stroke}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        style={{
          position: 'absolute',
          //transition: 'all 0.01s',
        }}
        ref={lineRef}
        stroke={stroke}
        strokeWidth="3"
        strokeDasharray={isNextNode ? undefined : '6 3'}
        fill="none"
      />
      <path
        onClick={() => onClick?.()}
        style={{
          position: 'absolute',
          //         transition: 'all 0.01s',
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
