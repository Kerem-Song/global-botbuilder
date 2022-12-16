import { icDeploy } from '@assets';
import { Node } from '@components/data-display';
import { ICanvasValue } from '@models/interfaces/IDraggable';
import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import { IBasicCard } from 'src/models/interfaces/ICard';
import { CommerceCard } from 'src/pages/scenario/cards/CommerceCard';

import img from '../../../assets/react.svg';
import { dummy2 } from '../../../dummy';
import { useCardList } from '../../../hooks/client/cardList';
import { BotBuilderZoomBtn } from './BotBuilderZoomBtn';
import { ConnectLine, LineContainer, updateLine } from './ConnectLine';

interface IBotbuilderRect {
  rect: DOMRect;
}

const cards: IBasicCard[] = [
  {
    title: '',
    thumbnail: { imageUrl: '' },
    description: 'asdfasdfasfasdfasdfasdfasdf',
    // buttons: [{ label: '버튼1', action: 'message' }],
  },
  {
    title: 'title2',
    thumbnail: { imageUrl: img },
    description:
      '설명2asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfadfasdfasdfasdfasdfasdfasdfasdfsd',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  { title: 'title3', thumbnail: { imageUrl: img }, description: '설명3' },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },

  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    title: 'title4',
    thumbnail: { imageUrl: img },
    description: '설명4',
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
];

const testNodes = [
  {
    id: '1',
    title: '1번',
    cards: cards,
  },
  {
    id: '2',
    title: '2번',
    cards: cards,
  },
];

for (let i = 3; i < 4; i++) {
  testNodes.push({ id: `${i}`, title: `${i}번`, cards: cards });
}

const testArrows: { start: string; end: string }[] = [];
for (let i = 1; i < 2; i++) {
  testArrows.push({ start: `node-${i}`, end: `node-${i + 1}` });
}

export const Botbuilder = () => {
  const { getCardListQuery } = useCardList();
  const { data } = getCardListQuery;
  const updateXarrow = useXarrow();
  // const [canvasValue, setCanvasValue] = useState<ICanvasValue>({
  //   x: 0,
  //   y: 0,
  //   scale: 1.0,
  // });

  // const canvasValue = {
  //   x: 0,
  //   y: 0,
  //   scale: 1.0,
  // };
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<string>('');
  const [scale, setScale] = useState(1.0);
  const [arrows, setArrows] = useState<{ start: string; end: string }[]>([]);
  // const canvasStyle: CSSProperties = {
  //   top: canvasValue.y,
  //   left: canvasValue.x,
  //   zoom: `${canvasValue.scale * 100}%`,
  // };

  const transformOptions = {
    limitToBounds: true,
    minScale: 0.25,
    maxScale: 2,
  };

  const testCard: IBasicCard[] = [
    {
      title: 'title4',
      thumbnail: { imageUrl: img },
      description: '설명4',
      buttons: [
        { label: '버튼1', action: 'message' },
        { label: '버튼1', action: 'message' },
      ],
    },
  ];

  const zoomOut = () => {
    const ratio = scale * 0.25;
    let v = scale - ratio;

    if (transformOptions.minScale > v) {
      v = transformOptions.minScale;
    }
    setScale(v);

    // setCanvasValue({
    //   x: canvasValue.x,
    //   y: canvasValue.y,
    //   scale: v,
    // });
  };

  const zoomIn = () => {
    let v = scale + 0.1;

    if (transformOptions.maxScale < v) {
      v = transformOptions.maxScale;
    }
    setScale(v);
    // setCanvasValue({
    //   x: canvasValue.x,
    //   y: canvasValue.y,
    //   scale: v,
    // });
  };

  const panning = (x: number, y: number) => {
    if (!canvasRef.current) {
      return;
    }

    canvasRef.current.style.left = `${
      parseInt(canvasRef.current.style.left) + x / scale
    }px`;
    canvasRef.current.style.top = `${
      parseInt(canvasRef.current.style.top) + y / scale
    }px`;
    // setCanvasValue({
    //   x: canvasValue.x + x / canvasValue.scale,
    //   y: canvasValue.y + y / canvasValue.scale,
    //   scale: canvasValue.scale,
    // });
  };

  const outterMouseWheelHandler = (e: React.WheelEvent<HTMLDivElement>): void => {
    if (e.nativeEvent.deltaY > 0) {
      zoomOut();
    } else {
      zoomIn();
    }
  };

  const outterMouseMoveHandler = (e: React.MouseEvent): void => {
    e.stopPropagation();
    isPanning && panning(e.movementX, e.movementY);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNode('');
    if (e.buttons === 1) {
      setIsPanning(true);
    } else {
      setIsPanning(false);
    }
  };

  const botbuilderRef = useRef<HTMLDivElement | null>(null);
  const botbuilderRect = botbuilderRef.current?.getBoundingClientRect();
  const nodeRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleNodeClick = (e: React.SyntheticEvent) => {
    setSelectedNode(e.currentTarget.id);
  };

  return (
    <>
      <BotBuilderZoomBtn zoomIn={zoomIn} zoomOut={zoomOut} canvasScale={scale} />

      <div
        className="botBuilderMain"
        onWheel={(e) => outterMouseWheelHandler(e)}
        onMouseDown={(e) => handleCanvasClick(e)}
        onMouseMoveCapture={outterMouseMoveHandler}
        onMouseUp={(e) => handleCanvasClick(e)}
        ref={botbuilderRef}
        role="presentation"
      >
        <Xwrapper>
          <div
            className="canvasWrapper"
            style={{ left: 0, top: 0, zoom: `${scale * 100}%` }}
            ref={canvasRef}
          >
            <LineContainer lines={arrows} />
            {testNodes.map((item, i) => (
              <Draggable
                defaultPosition={{
                  x: (i % 5) * 300 + 100,
                  y: Math.floor(i / 5) * 400 + 100,
                }}
                scale={scale}
                bounds={{ top: -4000, left: -4000, right: 4000 }}
                key={item.id}
                onDrag={(e) => {
                  e.stopPropagation();
                  //updateXarrow();
                  updateLine(`node-${item.id}`);
                }}
                cancel=".node-draggable-ignore"
              >
                <div
                  className="draggableNode"
                  style={{
                    // display: 'block',
                    position: 'absolute',
                    // width: '100%',
                    // height: "100%",
                  }}
                >
                  <Node
                    id={item.id}
                    key={item.id}
                    title={item.title}
                    cards={item.cards}
                    active={selectedNode === item.id}
                    onClick={(e) => handleNodeClick(e)}
                    addArrow={(from, to) => {
                      setArrows([...arrows, { start: from, end: to }]);
                    }}
                  />
                </div>
              </Draggable>
            ))}

            {/* {arrows.map((x, i) => (
              <Xarrow
                key={i}
                path={'grid'}
                start={x.start}
                end={x.end}
                endAnchor={{ position: 'top', offset: { x: 0, y: 200 } }}
                startAnchor={{ position: 'bottom', offset: { x: 0, y: 0 } }}
                // _cpy1Offset={250}
                // _cpy2Offset={-250}
                // _cpx1Offset={250}
                // _cpx2Offset={-250}
                dashness
                color="#00B4ED"
                strokeWidth={3}
                curveness={0.1}
                headShape={{
                  svgElem: (
                    <path
                      d="M 0 0 L 1 0.5 L 0 1 M 0 0 z"
                      stroke="#00B4ED"
                      strokeWidth={0.1}
                      fill="none"
                      style={{ transform: 'translate(90)' }}
                    />
                  ),
                  offsetForward: 1,
                }}
              />
            ))} */}
          </div>
        </Xwrapper>
      </div>
    </>
  );
};
