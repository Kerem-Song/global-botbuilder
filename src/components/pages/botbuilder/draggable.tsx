import './draggable.scss';

import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import Xarrow, { useXarrow } from 'react-xarrows';

export type TDraggable = {
  id: string;
  title: string;
  description: string;
  buttons: { buttonId: string; name: string; endPoint: string }[];
  deleteCard?: (id: string) => void;
  cardRef?: MutableRefObject<(HTMLDivElement | null)[]>;
};

export type TButtons = {
  buttonId: string;
  name: string;
  endPoint: string;
};

export const DraggableTemplate = ({
  id,
  title,
  description,
  buttons,
  deleteCard,
  cardRef,
}: TDraggable) => {
  const [startPoint, setStartPoint] = useState<string>('');
  const [lines, setLines] = useState<{ buttonId: string; endPoint: string }[]>([]);

  const template = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [degree, setDegree] = useState<number>(0);
  const [ox1, setOffsetX1] = useState<number>(0);
  const [ox2, setOffsetX2] = useState<number>(0);
  const [oy1, setOffsetY1] = useState<number>(0);
  const [oy2, setOffsetY2] = useState<number>(0);

  const updateXarrow = useXarrow();

  useEffect(() => {
    addEventListener('wheel', () => updateXarrow());
    removeEventListener('wheel', () => updateXarrow());
  }, [lines]);

  const handlePlusBtn = (buttonId: string) => {
    setStartPoint(buttonId);
  };

  const handleConnection = (e: React.MouseEvent) => {
    e.stopPropagation();
    // console.log("handle connection start", startPoint);
    if (startPoint) {
      const target = e.currentTarget.id;

      const line = { ...lines, buttonId: startPoint, endPoint: target };
      setLines([line]);
    }
  };

  // console.log("c:", c);
  // console.log("p:", p);
  // console.log("a:", a);
  const replaceId = Number(id.replace('template', ''));
  // console.log("reaplce", replaceId);

  type TOffset =
    | 0
    | {
        x: number;
        y: number;
      }[];
  const startArr: TOffset = [];
  const endArr: TOffset = [];
  const getOffsetTest = () => {
    buttonsRef.current.forEach((item) => {
      const startRect = item?.getBoundingClientRect();
      const startOffset = startRect && { x: startRect.x, y: startRect.y };

      // console.log("startREct", startRect);

      const endId = Number(item?.value.replace('template', '')) - 1;

      const endRect =
        endId && cardRef?.current[endId]?.lastElementChild?.getBoundingClientRect();

      const endOffset = endRect && { x: endRect.x, y: endRect.y };
      // // console.log("endTestRect", endTestRect);
      if (startOffset && endOffset) {
        startArr.push(startOffset);
        endArr.push(endOffset);
      }
      console.log('startArr', startArr);
      console.log('endArr:', endArr);

      if (startRect && endRect) {
        const startX = startRect.right;
        const startY = startRect.top;

        const endX = endRect.right;
        const endY = endRect.top;

        let xc = (startX - endX) * 0.7;
        const xDistance = endX - startX;
        const yDistance = endY - startY;
        // console.log("start rect, end rect");
        // console.log("distance x: ", xDistance);
        // console.log("distanx y:", yDistance);
        // setXdistance(endX - startX);
        // setYdistance(endY - startY);

        let reverseArrow = false;
        let reverseY = false;

        if (xDistance > 0) {
          if (xc < 100) {
            xc = 100;
          } else if (xc > 300) {
            xc = 300;
          }
        } else {
          if (xc < 200) {
            xc = 200;
          } else if (xc > 300) {
            xc = 300;
          }
        }
        xc = xc * 1;
        if (startX > endX) {
          //     console.log('역방향')
          reverseArrow = true;

          if (startY > endY) {
            reverseY = true;
            // ox1 = xc;
            // ox2 = ox1 * -1;
            setOffsetX1(xc);
            setOffsetX2(ox1 * -1);
          } else if (startY < endY) {
            // ox1 = xc;
            // ox2 = ox1 * -1;
            setOffsetX1(xc);
            setOffsetX2(ox1 * -1);
          } else {
            // ox1 = xc;
            // ox2 = ox1 * -1;
            setOffsetX1(xc);
            setOffsetX2(ox1 * -1);
          }
        } else if (startX < endX) {
          if (startY > endY) {
            reverseY = true;

            // ox1 = xc * 1;
            // ox2 = ox1 * -1;
            setOffsetX1(xc * 1);
            setOffsetX2(ox1 * -1);
          } else if (startY < endY) {
            // if (_color === 'hotpink')
            //     console.log('-45')

            // ox1 = xc * 1;
            // ox2 = ox1 * -1;
            setOffsetX1(xc * 1);
            setOffsetX2(ox1 * -1);
          } else {
            // if (_color === 'hotpink')
            //     console.log('0')

            // ox1 = xc * 1;
            // ox2 = ox1 * -1;
            setOffsetX1(xc * 1);
            setOffsetX2(ox1 * -1);
          }
          const xlen = endX - startX;
          const ylen = endY - startY;
          const r = Math.atan2(ylen, xlen);
          const t = (r * 180) / Math.PI;
          setDegree(t * -1);
        }
        console.log('inside x,y', ox1, oy1, ox2, oy2);
      }
    });
  };
  console.log('x,y', ox1, oy1, ox2, oy2);

  let absdgree = Math.abs(degree);
  // console.log("absdgree:", absdgree);
  if (absdgree > 90) {
    absdgree = 180 - absdgree;
  }

  //엑셀에서 열심히 테스트해서 구한 값
  //화살표 크기나 offset값이 변경되면 수정되어야 함
  const magic_number = 45;

  //화살표와 라인 y좌표 오차 수정식
  const c = Math.log2(absdgree);
  const p = Math.log2((absdgree + magic_number) / absdgree);
  const a = 1;

  console.log('cpa', c, p, a);

  // if (yDistance < 0) {
  //   a = -1;
  // }
  // let yy = (c / p) * a;

  // let xx = 0;

  // if (xDistance < 150) {
  //   xx = -10;
  //   if (xDistance < 0) {
  //     xx = xx - xDistance / 100;
  //   }
  // }

  return (
    <>
      {template && (
        <Draggable
          bounds={{ top: 0, right: 1000, bottom: 1000 }}
          // bounds="parent"
          onDrag={() => {
            updateXarrow();
            // getPosition(replaceId);
            getOffsetTest();
          }}
          onStop={() => {
            updateXarrow();
          }}
          nodeRef={template}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onStart={updateXarrow}
        >
          <div
            id={id}
            className="card"
            ref={template}
            // onClick={(e) => {
            //   e.stopPropagation();
            //   handleConnection(e);
            // }}
          >
            {deleteCard && (
              <button
                onClick={() => {
                  deleteCard(id);
                }}
              >
                카드 삭제
              </button>
            )}

            <h2>{title}</h2>
            <p>{description}</p>

            <div>
              {buttons.map((item, i) => (
                <div key={item.buttonId} className="buttons">
                  <button
                    className="button"
                    id={item.buttonId}
                    value={item.endPoint}
                    ref={(el) => (buttonsRef.current[i] = el)}
                  >
                    {item.name}
                  </button>

                  <button
                    className="plusBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlusBtn(item.buttonId);
                    }}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
            {buttons.map((item, i) =>
              item.endPoint && buttonsRef.current[i] ? (
                <>
                  <Xarrow
                    start={item.buttonId}
                    end={item.endPoint}
                    strokeWidth={2}
                    startAnchor={{
                      position: 'right',
                      offset: {
                        x: buttonsRef.current[i]!.getBoundingClientRect().width / 5.3,
                        y: buttonsRef.current[i]!.getBoundingClientRect().height / 20,
                      },
                    }}
                    curveness={0}
                    endAnchor={'left'}
                    divContainerStyle={{ zIndex: -1 }}
                    path={'smooth'}
                    gridBreak={'100%'}
                    _cpx1Offset={ox1}
                    _cpx2Offset={ox2}
                    _cpy1Offset={oy1}
                    _cpy2Offset={oy2}
                  />
                </>
              ) : null,
            )}
          </div>
        </Draggable>
      )}
    </>
  );
};
