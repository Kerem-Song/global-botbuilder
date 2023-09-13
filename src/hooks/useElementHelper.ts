const lineSettings = {
  disableAlpha: '0.4',
  minLine: 30,
  outSize: { width: 50, height: 50 },
  arcSize: 20,
} as const;

const designSettings = {
  nextArrowSize: { width: 6, height: 12, hw: 3, hh: 6 },
  ArrowSize: { width: 12, height: 6, hw: 6, hh: 3 },
  nextNodeSize: { width: 32, height: 24, hw: 16, hh: 12 },
  nodeHW: 109,
} as const;

interface IPoint {
  x: number;
  y: number;
}

interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface IOffsetRect {
  x: number;
  y: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

const pointEqual = (p1: IPoint, p2: IPoint): boolean => {
  return p1.x === p2.x && p1.y === p2.y;
};

const getOffsetRect = (rect: DOMRect, offset: IPoint): IOffsetRect => {
  return {
    x: rect.x - offset.x,
    y: rect.y - offset.y,
    bottom: rect.bottom - offset.y,
    right: rect.right - offset.x,
    width: rect.width,
    height: rect.height,
  };
};

const setArrowTransform = (
  style: CSSStyleDeclaration,
  point: IPoint,
  start: HTMLDivElement | null,
  end: HTMLDivElement | null,
) => {
  if (!end) {
    style.opacity = '0';
  } else {
    style.opacity = start ? '1' : lineSettings.disableAlpha;
    const translate = `translate(${point.x}px, ${point.y}px)`;
    style.transform = translate;
  }
};

const initPath = (element: SVGPathElement, end: HTMLDivElement | null) => {
  if (!end) {
    element.setAttribute('d', '');
  }
  element.style.opacity = '0';
};

interface ICalcHelper {
  getArrowPoint: (eor: IOffsetRect) => IPoint;
  getDragElPoint: (svgRect: IRect, point: IPoint) => IPoint;
  getStartPoint: (args: {
    start: HTMLDivElement | null;
    sor: IOffsetRect;
    snor: IOffsetRect;
  }) => IPoint;
  getEndPoint: (point: IPoint) => IPoint;
  getDeletePoint: (sp: IPoint, ep: IPoint) => IPoint;
  getPoint1: (sp: IPoint, ep: IPoint) => IPoint;
  getPoint2: (p1: IPoint, ep: IPoint) => IPoint;
  getPoint3: (p2: IPoint, ep: IPoint) => IPoint;
  getPoint4: (p3: IPoint, ep: IPoint) => IPoint;
  getLine1: (p1: IPoint, p2: IPoint) => string;
  getLine2: (p1: IPoint, p2: IPoint, p3: IPoint) => string;
  getLine3: (p2: IPoint, p3: IPoint, p4: IPoint) => string;
  getLine4: (p3: IPoint, p4: IPoint) => string;
  getBezier: (
    sp: IPoint,
    p1: IPoint,
    p2: IPoint,
    p3: IPoint,
    p4: IPoint,
    ep: IPoint,
  ) => string;
}

const calcHelper: ICalcHelper = {
  getArrowPoint: (eor: IOffsetRect) => {
    return {
      x: eor.x + Math.round(eor.width / 2) - designSettings.ArrowSize.hw,
      y: eor.y - designSettings.ArrowSize.height,
    };
  },
  getDragElPoint: (svgRect: IRect, point: IPoint) => {
    return {
      x: svgRect.x + point.x - 4,
      y: svgRect.y + point.y - 8,
    };
  },
  getStartPoint: ({
    start,
    sor,
    snor,
  }: {
    start: HTMLDivElement | null;
    sor: IOffsetRect;
    snor: IOffsetRect;
  }): IPoint => {
    return {
      x: sor.x + designSettings.nodeHW,
      y: sor.bottom,
    };
  },
  getEndPoint: (point: IPoint) => {
    return {
      x: point.x + designSettings.ArrowSize.hw,
      y: point.y,
    };
  },
  getDeletePoint: (sp: IPoint, ep: IPoint) => {
    return {
      x: sp.x + Math.round((ep.x - sp.x) / 2) - 8,
      y: sp.y + Math.round((ep.y - sp.y) / 2) - 8,
    };
  },
  getPoint1: (sp: IPoint, ep: IPoint) => {
    if (sp.y + lineSettings.minLine > ep.y) {
      return {
        x: sp.x,
        y: sp.y + lineSettings.minLine,
      };
    } else {
      const y = Math.min(sp.y, ep.y) + Math.round(Math.abs(sp.y - ep.y) / 2);
      return {
        x: sp.x,
        y,
      };
    }
  },
  getPoint2: (p1: IPoint, ep: IPoint) => {
    if (p1.y > ep.y) {
      const x = Math.min(p1.x, ep.x) + Math.round(Math.abs(p1.x - ep.x) / 2);
      return {
        x: x,
        y: p1.y,
      };
    } else {
      return {
        x: ep.x,
        y: p1.y,
      };
    }
  },
  getPoint3: (p2: IPoint, ep: IPoint) => {
    if (p2.y > ep.y) {
      return { x: p2.x, y: ep.y - lineSettings.minLine };
    } else {
      return p2;
    }
  },
  getPoint4: (p3: IPoint, ep: IPoint) => {
    return { x: ep.x, y: Math.max(p3.y, ep.y - lineSettings.minLine) };
  },
  getLine1: (p1: IPoint, p2: IPoint) => {
    const calcArcSize = Math.min(
      lineSettings.arcSize,
      Math.round(Math.abs(p1.x - p2.x) / 2),
    );

    const directionFactor = p1.x > p2.x ? -1 : 1;

    return `L ${p1.x} ${p1.y - calcArcSize} Q ${p1.x},${p1.y} ${
      p1.x + calcArcSize * directionFactor
    },${p1.y}`;
  },
  getLine2: (p1: IPoint, p2: IPoint, p3: IPoint) => {
    const calcArcSize = Math.min(
      lineSettings.arcSize,
      Math.round(Math.abs(p1.x - p2.x) / 2),
    );

    const directionFactor = p1.x > p2.x ? -1 : 1;
    const directionFactor2 = pointEqual(p2, p3) ? -1 : 1;

    return `L ${p2.x - calcArcSize * directionFactor} ${p2.y} Q ${p2.x},${p2.y} ${p2.x},${
      p2.y - calcArcSize * directionFactor2
    }`;
  },
  getLine3: (p2: IPoint, p3: IPoint, p4: IPoint) => {
    const calcArcSize = Math.min(
      lineSettings.arcSize,
      Math.round(Math.abs(p3.x - p4.x) / 2),
    );

    const directionFactor = p2.y > p3.y ? -1 : 1;
    const directionFactor2 = p3.x > p4.x ? -1 : 1;

    return `L ${p3.x} ${p3.y - calcArcSize * directionFactor} Q ${p3.x},${p3.y} ${
      p3.x + calcArcSize * directionFactor2
    },${p3.y}`;
  },
  getLine4: (p3: IPoint, p4: IPoint) => {
    const calcArcSize = Math.min(
      lineSettings.arcSize,
      Math.round(Math.abs(p3.x - p4.x) / 2),
    );

    const directionFactor = p3.x > p4.x ? -1 : 1;

    return `L ${p4.x - calcArcSize * directionFactor} ${p4.y} Q ${p4.x},${p4.y} ${p4.x},${
      p4.y + calcArcSize
    }`;
  },
  getBezier: (sp: IPoint, p1: IPoint, p2: IPoint, p3: IPoint, p4: IPoint, ep: IPoint) => {
    if (pointEqual(p2, p3)) {
      return `M ${sp.x} ${sp.y} C ${p1.x},${p1.y} ${p2.x},${p2.y} ${ep.x},${ep.y}`;
    } else {
      const bezierC = {
        x: p2.x,
        y: p3.y + Math.round((p2.y - p3.y) / 2),
      };
      return `M ${sp.x} ${sp.y} C ${p1.x},${p1.y} ${p2.x},${p2.y} ${bezierC.x},${bezierC.y} C ${p3.x},${p3.y} ${p4.x},${p4.y} ${ep.x},${ep.y}`;
    }
  },
};

const nextCalcHelper: ICalcHelper = {
  getArrowPoint: (eor: IOffsetRect) => {
    return {
      x: eor.x - designSettings.nextArrowSize.width,
      y: eor.y + designSettings.nextArrowSize.hh,
    };
  },
  getDragElPoint: (svgRect: IRect, point: IPoint) => {
    return {
      x: svgRect.x + point.x - 8,
      y: svgRect.y + point.y - 4,
    };
  },
  getStartPoint: ({
    start,
    sor,
    snor,
  }: {
    start: HTMLDivElement | null;
    sor: IOffsetRect;
    snor: IOffsetRect;
  }): IPoint => {
    if (start) {
      return {
        x: snor.right,
        y: sor.y + designSettings.nextNodeSize.hh,
      };
    } else {
      return {
        x: snor.right,
        y: snor.y + Math.round(snor.height / 2),
      };
    }
  },
  getEndPoint: (point: IPoint) => {
    return {
      x: point.x + designSettings.nextArrowSize.hw,
      y: point.y + designSettings.nextArrowSize.hh,
    };
  },
  getDeletePoint: (sp: IPoint, ep: IPoint) => {
    return {
      x: sp.x + Math.round((ep.x - sp.x) / 2) - 8,
      y: sp.y + Math.round((ep.y - sp.y) / 2) - 8,
    };
  },
  getPoint1: (sp: IPoint, ep: IPoint) => {
    if (sp.x + lineSettings.minLine > ep.x) {
      return {
        x: sp.x + lineSettings.minLine,
        y: sp.y,
      };
    } else {
      const x = Math.min(sp.x, ep.x) + Math.round(Math.abs(sp.x - ep.x) / 2);
      return {
        x,
        y: sp.y,
      };
    }
  },
  getPoint2: (p1: IPoint, ep: IPoint) => {
    if (p1.x > ep.x) {
      const y = Math.min(p1.y, ep.y) + Math.round(Math.abs(p1.y - ep.y) / 2);
      return {
        x: p1.x,
        y: y,
      };
    } else {
      return {
        x: p1.x,
        y: ep.y,
      };
    }
  },
  getPoint3: (p2: IPoint, ep: IPoint) => {
    if (p2.x > ep.x) {
      return { x: ep.x - lineSettings.minLine, y: p2.y };
    } else {
      return p2;
    }
  },
  getPoint4: (p3: IPoint, ep: IPoint) => {
    return { x: Math.max(p3.x, ep.x - lineSettings.minLine), y: ep.y };
  },
  getLine1: (p1: IPoint, p2: IPoint) => {
    const calcArcSize = Math.min(
      lineSettings.arcSize,
      Math.round(Math.abs(p1.y - p2.y) / 2),
    );

    const directionFactor = p1.y > p2.y ? -1 : 1;

    return `L ${p1.x - calcArcSize} ${p1.y} Q ${p1.x},${p1.y} ${p1.x},${
      p1.y + calcArcSize * directionFactor
    }`;
  },
  getLine2: (p1: IPoint, p2: IPoint, p3: IPoint) => {
    const calcArcSize = Math.min(
      lineSettings.arcSize,
      Math.round(Math.abs(p1.y - p2.y) / 2),
    );

    const directionFactor = p1.y > p2.y ? -1 : 1;
    const directionFactor2 = pointEqual(p2, p3) ? -1 : 1;

    return `L ${p2.x} ${p2.y - calcArcSize * directionFactor} Q ${p2.x},${p2.y} ${
      p2.x - calcArcSize * directionFactor2
    },${p2.y}`;
  },
  getLine3: (p2: IPoint, p3: IPoint, p4: IPoint) => {
    const calcArcSize = Math.min(
      lineSettings.arcSize,
      Math.round(Math.abs(p3.y - p4.y) / 2),
    );

    const directionFactor = p2.x > p3.x ? -1 : 1;
    const directionFactor2 = p3.y > p4.y ? -1 : 1;

    return `L ${p3.x - calcArcSize * directionFactor} ${p3.y} Q ${p3.x},${p3.y} ${p3.x},${
      p3.y + calcArcSize * directionFactor2
    }`;
  },
  getLine4: (p3: IPoint, p4: IPoint) => {
    const calcArcSize = Math.min(
      lineSettings.arcSize,
      Math.round(Math.abs(p3.y - p4.y) / 2),
    );

    const directionFactor = p3.y > p4.y ? -1 : 1;

    return `L ${p4.x} ${p4.y - calcArcSize * directionFactor} Q ${p4.x},${p4.y} ${
      p4.x + calcArcSize
    },${p4.y}`;
  },
  getBezier: (sp: IPoint, p1: IPoint, p2: IPoint, p3: IPoint, p4: IPoint, ep: IPoint) => {
    if (pointEqual(p2, p3)) {
      return `M ${sp.x} ${sp.y} C ${p1.x},${p1.y} ${p2.x},${p2.y} ${ep.x},${ep.y}`;
    } else {
      const bezierC = {
        x: p3.x + Math.round((p2.x - p3.x) / 2),
        y: p2.y,
      };
      return `M ${sp.x} ${sp.y} C ${p1.x},${p1.y} ${p2.x},${p2.y} ${bezierC.x},${bezierC.y} C ${p3.x},${p3.y} ${p4.x},${p4.y} ${ep.x},${ep.y}`;
    }
  },
};

export const useElementHelper = (
  canvas: HTMLDivElement | null,
  startId: string,
  end: HTMLDivElement | null,
  startNode: HTMLDivElement | null,
  isBezierMode?: boolean,
) => {
  const isNextNode = startNode !== null;
  const helper: ICalcHelper = isNextNode ? nextCalcHelper : calcHelper;
  const start = document.querySelector<HTMLDivElement>(`#${startId}`);

  const cr = canvas?.getBoundingClientRect() || new DOMRect();
  const snr = startNode?.getBoundingClientRect() || new DOMRect();
  const sr = start?.getBoundingClientRect() || snr;
  const er = end?.getBoundingClientRect() || new DOMRect();

  const minX = Math.min(isNextNode ? snr.left : sr.left, er.left);
  const maxX = Math.max(isNextNode ? snr.right : sr.right, er.right);
  const minY = Math.min(sr.top, er.top);
  const maxY = Math.max(sr.bottom, er.bottom, snr.bottom);

  const svgRect = {
    x: minX - cr.x - lineSettings.outSize.width,
    y: minY - cr.y - lineSettings.outSize.height,
    width: maxX - minX + lineSettings.outSize.width * 2,
    height: maxY - minY + lineSettings.outSize.height * 2,
  };

  const offset = { x: cr.x + svgRect.x, y: cr.y + svgRect.y };

  const snor = getOffsetRect(snr, offset);
  const sor = getOffsetRect(sr, offset);
  const eor = getOffsetRect(er, offset);

  const arrowPoint = helper.getArrowPoint(eor);

  const dragElPoint: IPoint = helper.getDragElPoint(svgRect, arrowPoint);

  const setSvgStyle = (element: SVGSVGElement | null) => {
    if (element) {
      const translate = `translate(${svgRect.x}px,${svgRect.y}px)`;
      element.style.transform = translate;
      element.style.width = `${svgRect.width}px`;
      element.style.height = `${svgRect.height}px`;
    }
  };

  const setArrowStyle = (
    element: SVGPathElement | null,
    dragEl: HTMLDivElement | null,
  ) => {
    if (element) {
      setArrowTransform(element.style, arrowPoint, start, end);
    }

    if (dragEl) {
      setArrowTransform(dragEl.style, dragElPoint, start, end);
    }
  };

  const setLinePath = (
    element: SVGPathElement | null,
    mouseElement: SVGPathElement | null,
    deleteElement: SVGGeometryElement | null,
  ) => {
    if (element) {
      initPath(element, end);
    }

    if (mouseElement) {
      initPath(mouseElement, end);
    }

    if (!end) {
      return;
    }

    const startPoint = helper.getStartPoint({ start, snor, sor });
    const endPoint = helper.getEndPoint(arrowPoint);
    const deletePoint = helper.getDeletePoint(startPoint, endPoint);

    const point1 = helper.getPoint1(startPoint, endPoint);
    const point2 = helper.getPoint2(point1, endPoint);
    const point3 = helper.getPoint3(point2, endPoint);
    const point4 = helper.getPoint4(point3, endPoint);

    const line1 = helper.getLine1(point1, point2);
    const line2 = helper.getLine2(point1, point2, point3);
    const line3 = pointEqual(point2, point3)
      ? ''
      : helper.getLine3(point2, point3, point4);
    const line4 = pointEqual(point2, point3) ? '' : helper.getLine4(point3, point4);

    if (element) {
      if (start) {
        element.style.opacity = '1';
      } else {
        element.style.opacity = lineSettings.disableAlpha;
      }

      if (isBezierMode) {
        element.setAttribute(
          'd',
          helper.getBezier(startPoint, point1, point2, point3, point4, endPoint),
        );
      } else {
        element.setAttribute(
          'd',
          `M ${startPoint.x} ${startPoint.y} ${line1} ${line2} ${line3} ${line4} L ${endPoint.x} ${endPoint.y}`,
        );
      }
    }

    if (mouseElement) {
      if (start) {
        mouseElement.style.opacity = '1';
      } else {
        mouseElement.style.opacity = lineSettings.disableAlpha;
      }

      if (isBezierMode) {
        mouseElement.setAttribute(
          'd',
          helper.getBezier(startPoint, point1, point2, point3, point4, endPoint),
        );
      } else {
        mouseElement.setAttribute(
          'd',
          `M ${startPoint.x} ${startPoint.y} ${line1} ${line2} ${line3} ${line4} L ${endPoint.x} ${endPoint.y}`,
        );
      }
    }

    if (deleteElement) {
      deleteElement.style.transform = `translate(${deletePoint.x}px, ${deletePoint.y}px)`;
    }
  };

  return { setSvgStyle, setArrowStyle, setLinePath };
};

export default useElementHelper;
