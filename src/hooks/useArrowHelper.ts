export const useElementHelper = (startId: string, endId: string) => {
  const canvas = document.querySelector<HTMLDivElement>('.canvasWrapper');
  const start = document.querySelector<HTMLDivElement>(`#${startId}`);
  const end = document.querySelector<HTMLDivElement>(`#${endId}`);

  const cr = canvas?.getBoundingClientRect() || new DOMRect();
  const sr = start?.getBoundingClientRect() || new DOMRect();
  const er = end?.getBoundingClientRect() || new DOMRect();

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

  const arrowPoint = {
    x:
      sr.x < er.x ? svgRect.width - outSize.width - ehw - ahw : outSize.width + ehw - ahw,
    y:
      sr.y < er.y
        ? er.y - sr.y + outSize.height - arrowSize.height
        : outSize.height - arrowSize.height,
  };

  const setSvgStyle = (element: SVGSVGElement | null) => {
    if (element) {
      const translate = `translate(${svgRect.x}px,${svgRect.y}px)`;
      element.style.transform = translate;
      element.style.width = `${svgRect.width}px`;
      element.style.height = `${svgRect.height}px`;
      element.style.zIndex = `${Math.min(
        Number(start?.parentElement?.style.zIndex),
        Number(end?.parentElement?.style.zIndex),
      )}`;
    }
  };

  const setArrowStyle = (element: SVGPathElement | null) => {
    if (element) {
      const translate = `translate(${arrowPoint.x}px, ${arrowPoint.y}px)`;
      element.style.transform = translate;
    }
  };
  const isTreeLine = sr.bottom + minLine < er.top;

  const setLinePath = (element: SVGPathElement | null) => {
    if (element) {
      const halfRectX = Math.round(svgRect.width / 2);
      const ls = {
        x: sr.x - svgRect.x - offset.x + shw,
        y: sr.bottom - svgRect.y - offset.y + 8,
      };

      const l1 = {
        x: ls.x,
        y: isTreeLine
          ? ls.y + Math.round((er.top - sr.bottom) / 2)
          : svgRect.height - lineOffset,
      };

      const l2 = {
        x: isTreeLine
          ? l1.x
          : sr.x < er.x
          ? sr.right < er.left
            ? halfRectX
            : svgRect.width - lineOffset
          : er.right < sr.left
          ? halfRectX
          : lineOffset,
        y: l1.y,
      };

      const l3 = {
        x: l2.x,
        y: isTreeLine ? l2.y : arrowPoint.y - minLine + lineOffset + arrowSize.height,
      };

      const l4 = {
        x: arrowPoint.x + ahw,
        y: l3.y,
      };

      const end = {
        x: l4.x,
        y: arrowPoint.y,
      };

      const arcSize = isTreeLine ? Math.min(20, Math.abs(ls.x - end.x) / 2) : 20;

      const l1Path = l1.x === end.x ? `L ${l1.x} ${l1.y}` : `L ${l1.x} ${l1.y - arcSize}`;

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

      const l3Path = l2.x === l3.x && l2.y === l3.y ? `` : `L ${l3.x} ${l3.y + arcSize}`;

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

      element.setAttribute(
        'd',
        `M ${ls.x} ${ls.y} ${l1Path} ${q1Path} ${l2Path} ${q2Path} ${l3Path} ${q3Path} ${l4Path} ${q4Path} L ${end.x} ${end.y}`,
      );
    }
  };
  return { setSvgStyle, setArrowStyle, setLinePath };
};

export default useElementHelper;
