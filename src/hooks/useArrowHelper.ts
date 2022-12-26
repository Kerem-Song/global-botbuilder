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
  const arrowSize = { width: 12, height: 6 };

  const ahw = Math.round(arrowSize.width / 2);

  const shw = Math.round(sr.width / 2);
  const ehw = Math.round(er.width / 2);

  const minX = Math.min(sr.left, sr.right, er.left, er.right);
  const maxX = Math.max(sr.left, sr.right, er.left, er.right);
  const minY = Math.min(sr.top, sr.bottom, er.top, er.bottom);
  const maxY = Math.max(sr.top, sr.bottom, er.top, er.bottom);

  const svgRect = {
    x: minX - cr.x - outSize.width,
    y: minY - cr.y - outSize.height,
    width: Math.max(maxX - minX) + outSize.width * 2,
    height: maxY - minY + outSize.height * 2,
  };

  const offset = { x: cr.x + svgRect.x, y: cr.y + svgRect.y };

  const arrowPoint = {
    x: er.x + ehw - offset.x - ahw,
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
      //const halfRectX = Math.round(svgRect.width / 2);
      const ls = {
        x: sr.x - offset.x + shw,
        y: sr.bottom - offset.y + 8,
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
          : ls.x < arrowPoint.x + ahw
          ? sr.right < er.left
            ? Math.round((er.left - sr.right) / 2) + sr.right - offset.x
            : svgRect.width - lineOffset
          : er.right < sr.left
          ? Math.round((sr.left - er.right) / 2) + er.right - offset.x
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

      const arcSize2 = Math.min(Math.round(Math.abs(end.x - l3.x) / 2), arcSize);
      const q3Path =
        l3.y === l4.y && l2.y === l3.y
          ? ''
          : `Q ${l3.x} ${l3.y}, ${l3.x + (l3.x < end.x ? arcSize2 : -arcSize2)} ${l3.y}`;

      const l4Path =
        l3.x === l4.x && l3.y === l4.y
          ? ``
          : `L ${l4.x - (l3.x < end.x ? arcSize2 : -arcSize2)} ${l4.y}`;

      const q4Path =
        l3.x === l4.x && l3.y === l4.y
          ? ''
          : `Q ${l4.x} ${l4.y}, ${l4.x} ${l4.y + arcSize2}`;

      element.setAttribute(
        'd',
        `M ${ls.x} ${ls.y} ${l1Path} ${q1Path} ${l2Path} ${q2Path} ${l3Path} ${q3Path} ${l4Path} ${q4Path} L ${end.x} ${end.y}`,
      );
    }
  };
  return { setSvgStyle, setArrowStyle, setLinePath };
};

export default useElementHelper;
