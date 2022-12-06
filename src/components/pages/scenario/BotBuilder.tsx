import { Carousel } from '@components/data-display/Carousel';
import { ICanvasValue } from '@models/interfaces/IDraggable';
import { CSSProperties, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { Xwrapper } from 'react-xarrows';
import { IBasicCard } from 'src/models/interfaces/ICard';
import { CommerceCard } from 'src/pages/scenario/cards/CommerceCard';

import img from '../../../assets/react.svg';
import { dummy2 } from '../../../dummy';
import { useCardList } from '../../../hooks/client/cardList';
import { BotBuilderZoomBtn } from './BotBuilderZoomBtn';
interface IBotbuilderRect {
  rect: DOMRect;
}
export const Botbuilder = () => {
  const title = '캐로셀1';
  const cardTitle = '카드 타이틀';
  const { getCardListQuery } = useCardList();
  const { data } = getCardListQuery;

  const [canvasValue, setCanvasValue] = useState<ICanvasValue>({
    x: 0,
    y: 0,
    scale: 1.0,
  });

  const canvasStyle: CSSProperties = {
    top: canvasValue.y,
    left: canvasValue.x,
    zoom: `${canvasValue.scale * 100}%`,
  };

  const transformOptions = {
    limitToBounds: false,
    minScale: 0.05,
    maxScale: 2,
  };

  const cards: IBasicCard[] = [
    {
      title: '',
      thumbnail: { imageUrl: img },
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
    const ratio = canvasValue.scale * 0.25;
    let v = canvasValue.scale - ratio;
    if (transformOptions.minScale > v) {
      v = transformOptions.minScale;
    }
    setCanvasValue({
      x: canvasValue.x,
      y: canvasValue.y,
      scale: v,
    });
  };

  const zoomIn = () => {
    let v = canvasValue.scale + 0.1;
    if (transformOptions.maxScale < v) {
      v = transformOptions.maxScale;
    }
    //linkDrawState.current = false;

    setCanvasValue({
      x: canvasValue.x,
      y: canvasValue.y,
      scale: v,
    });
  };

  const panning = (x: number, y: number) => {
    // linkDrawState.current = false;
    setCanvasValue({
      x: canvasValue.x + x / canvasValue.scale,
      y: canvasValue.y + y / canvasValue.scale,
      scale: canvasValue.scale,
    });
  };

  const outterMouseWheelHandler = (e: React.WheelEvent<HTMLDivElement>): void => {
    console.log('outter mouse wheel handler', e.nativeEvent.deltaY);

    if (e.nativeEvent.deltaY > 0) {
      zoomOut();
    } else {
      zoomIn();
    }
  };

  const botbuilderRef = useRef<HTMLDivElement | null>(null);
  const botbuilderRect = botbuilderRef.current?.getBoundingClientRect();
  console.log('rect', botbuilderRect);
  return (
    <>
      <BotBuilderZoomBtn
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        canvasScale={canvasValue.scale}
      />
      <div
        className="botBuilderMain"
        onWheel={(e) => outterMouseWheelHandler(e)}
        ref={botbuilderRef}
      >
        <Xwrapper>
          <div className="canvasWrapper" style={canvasStyle}>
            <Draggable bounds={{ top: 0, left: 0 }}>
              <div
                style={
                  {
                    // display: 'flex',
                    // position: 'absolute',
                    // width: '100%',
                    // height: "100%",
                  }
                }
              >
                <Carousel title={title} cards={cards} className="carouselWrapper" />
              </div>
            </Draggable>
          </div>
        </Xwrapper>
      </div>
    </>
  );
};
