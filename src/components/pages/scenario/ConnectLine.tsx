import useElementHelper from '@hooks/useArrowHelper';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { FC, useEffect, useRef } from 'react';

interface IConnectLineProps {
  startId: string;
  endId: string;
  active?: boolean;
  onClick?: () => void;
}
export const ConnectLine: FC<IConnectLineProps> = ({
  startId,
  endId,
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
    addUpdateLines(startId, endId, () => {
      const { setSvgStyle, setArrowStyle, setLinePath } = useElementHelper(
        startId,
        endId,
      );
      setSvgStyle(svgRef.current);
      setArrowStyle(arrowRef.current);
      setLinePath(lineRef.current);
      setLinePath(lineMouseRef.current);
    });
    return () => {
      removeUpdateLines(startId, endId);
    };
  }, [svgRef.current, arrowRef.current, lineRef.current, lineMouseRef.current]);

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
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
          //transition: 'all 0.01s ease',
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
          //transition: 'all 0.01s ease',
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
