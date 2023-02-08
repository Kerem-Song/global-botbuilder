export const useElementHelper = (
  canvas: HTMLDivElement | null,
  startId: string,
  end: HTMLDivElement | null,
  startNode: HTMLDivElement | null,
) => {
  const isNextNode = startNode !== null;
  const start = document.querySelector<HTMLDivElement>(`#${startId}`);

  const cr = canvas?.getBoundingClientRect() || new DOMRect();
  const sr = start?.getBoundingClientRect() || new DOMRect();
  const er = end?.getBoundingClientRect() || new DOMRect();
  const snr = startNode?.getBoundingClientRect() || new DOMRect();

  const lineOffset = 15;
  const minLine = 50;
  const arrowSize = isNextNode ? { width: 6, height: 12 } : { width: 12, height: 6 };
  const outSize = { width: 50, height: 50 };
  const arcSize = 20;

  const ahw = Math.round(arrowSize.width / 2);
  const ahh = Math.round(arrowSize.height / 2);

  const shw = Math.round(sr.width / 2);

  const ehw = Math.round(er.width / 2);
  const ehh = Math.round(er.height / 2);

  const minX = Math.min(
    isNextNode ? snr.left : sr.left,
    isNextNode ? snr.left + 216 : sr.right,
    er.left,
    er.right,
  );
  const maxX = Math.max(
    isNextNode ? snr.left : sr.left,
    isNextNode ? snr.left + 216 : sr.right,
    er.left,
    er.right,
  );
  const minY = Math.min(sr.top, sr.bottom, er.top, er.bottom);
  const maxY = Math.max(sr.top, sr.bottom, er.top, er.bottom, snr.bottom);

  const svgRect = {
    x: minX - cr.x - outSize.width,
    y: minY - cr.y - outSize.height,
    width: Math.max(maxX - minX) + outSize.width * 2,
    height: maxY - minY + outSize.height * 2,
  };

  const offset = { x: cr.x + svgRect.x, y: cr.y + svgRect.y };

  const arrowPoint = {
    x: isNextNode ? er.x - offset.x - arrowSize.width : er.x + ehw - offset.x - ahw,
    y: isNextNode
      ? er.y - offset.y + ehh
      : sr.y < er.y
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
      if (!start || !end) {
        element.style.opacity = '0';
      } else {
        element.style.opacity = '1';
        const translate = `translate(${arrowPoint.x}px, ${arrowPoint.y}px)`;
        element.style.transform = translate;
      }
    }
  };

  const setLinePath = (
    element: SVGPathElement | null,
    mouseElement: SVGPathElement | null,
    deleteElement: SVGGeometryElement | null,
  ) => {
    if (!start || !end) {
      if (element) {
        element.setAttribute('d', '');
        element.style.opacity = '0';
      }

      if (mouseElement) {
        mouseElement.setAttribute('d', '');
        mouseElement.style.opacity = '0';
      }

      return;
    }
    const startPoint = isNextNode
      ? {
          x: snr.right - offset.x + sr.width / 2,
          y: sr.bottom - offset.y + 8,
        }
      : {
          x: sr.x - offset.x + shw,
          y: sr.bottom - offset.y + 8,
        };

    const endPoint = isNextNode
      ? {
          x: arrowPoint.x + ahw,
          y: arrowPoint.y + ahh,
        }
      : {
          x: arrowPoint.x + ahw,
          y: arrowPoint.y,
        };
    let line1 = '';
    let line2 = '';
    let line3 = '';
    let line4 = '';

    console.log(startPoint);
    console.log(endPoint);
    const deletePoint = {
      x: startPoint.x + Math.round((endPoint.x - startPoint.x) / 2) - 8,
      y: startPoint.y + Math.round((endPoint.y - startPoint.y) / 2) - 8,
    };

    console.log(deletePoint);

    if (isNextNode) {
      if (startPoint.x + minLine > endPoint.x) {
        const isDirectionUp = snr.top > er.bottom + minLine;
        const directionFactor = isDirectionUp ? -1 : 1;
        const point1 = {
          x: svgRect.width - lineOffset,
          y: startPoint.y,
        };

        const point2 = {
          x: point1.x,
          y: isDirectionUp
            ? er.bottom + Math.round((snr.top - er.bottom) / 2) - offset.y
            : svgRect.height - lineOffset,
        };

        const point3 = {
          x: Math.max(endPoint.x - minLine, lineOffset),
          y: point2.y,
        };

        const point4 = {
          x: point3.x,
          y: endPoint.y,
        };

        line1 = `L ${point1.x - arcSize} ${point1.y} Q ${point1.x},${point1.y} ${
          point1.x
        },${point1.y + arcSize * directionFactor}`;
        line2 = `L ${point2.x} ${point2.y - arcSize * directionFactor} Q ${point2.x},${
          point2.y
        } ${point2.x - arcSize},${point2.y}`;
        line3 = `L ${point3.x + arcSize} ${point3.y} Q ${point3.x},${point3.y} ${
          point3.x
        },${point3.y - arcSize}`;
        line4 = `L ${point4.x} ${point4.y + arcSize} Q ${point4.x},${point4.y} ${
          point4.x + arcSize
        },${point4.y}`;

        deletePoint.x = point2.x + (point3.x - point2.x) / 2 - 8;
        deletePoint.y = point2.y + (point3.y - point2.y) / 2 - 8;
      } else if (Math.abs(startPoint.y - endPoint.y) > 10) {
        const x =
          Math.min(startPoint.x, endPoint.x) +
          Math.round(Math.abs(startPoint.x - endPoint.x) / 2);
        const point1 = {
          x,
          y: startPoint.y,
        };

        const point2 = {
          x,
          y: endPoint.y,
        };

        const computeArcSize = Math.min(
          Math.round(Math.abs(startPoint.y - endPoint.y) / 2),
          arcSize,
        );

        line1 = `L ${point1.x - computeArcSize} ${point1.y} Q ${point1.x},${point1.y} ${
          point1.x
        },${point1.y + (startPoint.y < endPoint.y ? computeArcSize : -computeArcSize)}`;
        line2 = `L ${point2.x} ${
          point2.y + (startPoint.y < endPoint.y ? -computeArcSize : computeArcSize)
        } Q ${point2.x},${point2.y} ${point2.x + computeArcSize},${point2.y}`;

        deletePoint.x = point1.x + (point2.x - point1.x) / 2 - 8;
        deletePoint.y = point1.y + (point2.y - point1.y) / 2 - 8;
      }
    } else {
      if (startPoint.y + minLine > endPoint.y) {
        const isDirectionLeft = startPoint.x > endPoint.x;
        let directionFactor = isDirectionLeft ? -1 : 1;
        const point1 = {
          x: startPoint.x,
          y: svgRect.height - lineOffset,
        };

        const point2 = {
          x: isDirectionLeft
            ? er.right + minLine > sr.left
              ? lineOffset
              : er.right + Math.round((sr.left - er.right) / 2) - offset.x
            : sr.right + minLine > er.left
            ? svgRect.width - lineOffset
            : sr.right + Math.round((er.left - sr.right) / 2) - offset.x,
          y: point1.y,
        };

        const point3 = {
          x: point2.x,
          y: Math.max(endPoint.y - minLine, lineOffset),
        };

        const point4 = {
          x: endPoint.x,
          y: point3.y,
        };

        line1 = `L ${point1.x} ${point1.y - arcSize} Q ${point1.x},${point1.y} ${
          point1.x + arcSize * directionFactor
        },${point1.y}`;
        line2 = `L ${point2.x - arcSize * directionFactor} ${point2.y} Q ${point2.x},${
          point2.y
        } ${point2.x},${point2.y - arcSize}`;

        directionFactor = point3.x > point4.x ? 1 : -1;

        line3 = `L ${point3.x} ${point3.y + arcSize} Q ${point3.x},${point3.y} ${
          point3.x - arcSize * directionFactor
        },${point3.y}`;
        line4 = `L ${point4.x + arcSize * directionFactor} ${point4.y} Q ${point4.x},${
          point4.y
        } ${point4.x},${point4.y + arcSize}`;

        deletePoint.x = point2.x + (point3.x - point2.x) / 2 - 8;
        deletePoint.y = point2.y + (point3.y - point2.y) / 2 - 8;
      } else if (Math.abs(startPoint.x - endPoint.x) > 10) {
        const y =
          Math.min(startPoint.y, endPoint.y) +
          Math.round(Math.abs(startPoint.y - endPoint.y) / 2);
        const point1 = {
          x: startPoint.x,
          y,
        };

        const point2 = {
          x: endPoint.x,
          y,
        };

        const computeArcSize = Math.min(
          Math.round(Math.abs(startPoint.x - endPoint.x) / 2),
          arcSize,
        );

        line1 = `L ${point1.x} ${point1.y - computeArcSize} Q ${point1.x},${point1.y} ${
          point1.x + (startPoint.x < endPoint.x ? computeArcSize : -computeArcSize)
        },${point1.y}`;
        line2 = `L ${
          point2.x + (startPoint.x < endPoint.x ? -computeArcSize : computeArcSize)
        } ${point2.y} Q ${point2.x},${point2.y} ${point2.x},${point2.y + computeArcSize}`;

        deletePoint.x = point1.x + (point2.x - point1.x) / 2 - 8;
        deletePoint.y = point1.y + (point2.y - point1.y) / 2 - 8;
      }
    }

    if (element) {
      element.style.opacity = '1';
      element.setAttribute(
        'd',
        `M ${startPoint.x} ${startPoint.y} ${line1} ${line2} ${line3} ${line4} L ${endPoint.x} ${endPoint.y}`,
      );
    }

    if (mouseElement) {
      mouseElement.style.opacity = '1';
      mouseElement.setAttribute(
        'd',
        `M ${startPoint.x} ${startPoint.y} ${line1} ${line2} ${line3} ${line4} L ${endPoint.x} ${endPoint.y}`,
      );
    }

    console.log(deletePoint);

    if (deleteElement) {
      deleteElement.style.transform = `translate(${deletePoint.x}px, ${deletePoint.y}px)`;
    }
  };

  return { setSvgStyle, setArrowStyle, setLinePath };
};

export default useElementHelper;
