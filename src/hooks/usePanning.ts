import { CANVAS_LIMIT } from '@modules';

import { useRootState } from './useRootState';

export const usePanning = () => {
  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const factor = { x: 0, y: 0 };
  const canvas = document.querySelector('.canvasWrapper') as HTMLDivElement;
  const panning = (x: number, y: number) => {
    if (
      !canvas ||
      parseInt(canvas.style.left) + x / scale > CANVAS_LIMIT ||
      parseInt(canvas.style.top) + y / scale > CANVAS_LIMIT
    ) {
      return;
    }

    factor.x += x / scale;
    factor.y += y / scale;

    const distance = Math.sqrt(Math.pow(factor.x, 2) + Math.pow(factor.y, 2));

    if (distance > 20) {
      canvas.style.left = `${parseInt(canvas.style.left) + factor.x}px`;

      factor.x = 0;

      canvas.style.top = `${parseInt(canvas.style.top) + factor.y}px`;

      factor.y = 0;
    }
  };

  const dragPanning = (e: React.DragEvent<HTMLDivElement>) => {
    const element = document.querySelector('.botBuilderMain') as HTMLDivElement;
    const botbuilderRect = element?.getBoundingClientRect() || new DOMRect();

    const factor = 5;

    const panningValue = { x: 0, y: 0 };

    if (botbuilderRect.right < e.clientX + 109) {
      panningValue.x = -factor;
    }

    if (botbuilderRect.bottom < e.clientY + 109) {
      panningValue.y = -factor;
    }

    if (botbuilderRect.left > e.clientX - 109) {
      panningValue.x = factor;
    }

    if (botbuilderRect.top > e.clientY - 109) {
      panningValue.y = factor;
    }

    panning(panningValue.x, panningValue.y);
  };
  return { panning, dragPanning };
};
