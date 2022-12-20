import { Button } from '@components/general/Button';
import { Col } from '@components/layout/Col';
import { useRootState } from '@hooks';
import { IBasicCard, IBotBuilderCardType } from '@models/interfaces/ICard';
import { setBotBuilderCardType } from '@store/botbuilderMaker';
import { INodes, setTempCard } from '@store/makingNode';
import React, { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';

export const BotBuilderHeader = () => {
  const cardNum = 12;
  const dispatch = useDispatch();
  const handleCardType = useCallback(
    (payload: IBotBuilderCardType) => dispatch(setBotBuilderCardType(payload)),
    [dispatch],
  );

  const setTemporaryCard = useCallback(
    (payload: INodes) => dispatch(setTempCard(payload)),
    [dispatch],
  );

  // const handleMakingChatbubbleBtn = (payload: IBotBuilderCardType) => {
  //   console.log('handlemaking btn');
  //   handleCardType(payload);
  // };
  // const handleMakingChatbubbleBtn = (e: HTMLButtonElement) {
  //   e.
  // }
  const cardType = useRootState((state) => state.botBuilderMakerReducer.cardType);
  const nodeLength = useRootState((state) => state.makingNodeSliceReducer.nodeLength);
  const handleMakingChatbubbleClick = () => {
    // const cardType = e.currentTarget.value;
    const addCard: IBasicCard[] = [
      {
        title: '',
        thumbnail: cardType === 'text' ? undefined : { imageUrl: '' },
        description: '',
        buttons:
          cardType === 'text' ? undefined : [{ label: 'add a button', action: 'block' }],
      },
    ];

    const addNode = {
      id: `${nodeLength + 1}`,
      title: cardType,
      cards: addCard,
    };

    setTemporaryCard({ nodes: [addNode] });

    // const canvasRect = canvasRef.current.getBoundingClientRect();
    // const translateX = (canvasRect.width - 310) / 2;
    // const translateY = (canvasRect.height - 300) / 2;
  };

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData('cardType', e.currentTarget.value);
  };

  return (
    <div className="botBuilderHeader">
      <div className="botBuilderMakerWrapper">
        <span className="cardNumWrapper">
          chat bubble <span className="cardNum">{cardNum}</span>
        </span>
        <div className="makingBtn">
          <span className="btnCategory">Single</span>
          <Col className="btnWrapper">
            {/* <button ondro></button> */}
            <Button
              className="icon icText"
              onDragStart={(e) => handleDragStart(e)}
              // onClick={() => handleMakingChatbubbleBtn({ cardType: 'text' })}
              onClick={() => handleMakingChatbubbleClick()}
              draggable={true}
              value="text"
            />
            <Button
              className="icon icImg"
              onDragStart={(e) => handleDragStart(e)}
              // onClick={() => handleMakingChatbubbleBtn({ cardType: 'image' })}
              draggable={true}
              value="image"
            />
            <Button
              className="icon icBtnTemple"
              // onClick={() => handleMakingChatbubbleBtn({ cardType: 'buttonTemplate' })}
              draggable={true}
            />
            <Button
              className="icon icList"
              // onClick={() => handleMakingChatbubbleBtn({ cardType: 'list' })}
              draggable={true}
            />
            <Button
              className="icon icCommerce"
              // onClick={() => handleMakingChatbubbleBtn({ cardType: 'commerce' })}
              draggable={true}
            />
          </Col>
        </div>
        <div className="makingBtn">
          <span className="btnCategory">Carousel</span>
          <Col className="btnWrapper">
            <Button
              className="icon icCaroImg"
              // onClick={() => handleMakingChatbubbleBtn({ cardType: 'imgCarousel' })}
              draggable={true}
            />
            <Button
              className="icon icCaroList"
              // onClick={() => handleMakingChatbubbleBtn({ cardType: 'listCarousel' })}
              draggable={true}
            />
            <Button
              className="icon icCaroCommerce"
              // onClick={() => handleMakingChatbubbleBtn({ cardType: 'commerceCarousel' })}
              draggable={true}
            />
          </Col>
        </div>
        <div className="makingBtn">
          <span className="btnCategory">Button</span>
          <Col className="btnWrapper">
            <Button
              className="icon icQuickBtn"
              // onClick={() => handleMakingChatbubbleBtn({ cardType: 'quickReply' })}
              draggable={true}
            />
            <Button
              className="icon icCondition"
              // onClick={() => handleMakingChatbubbleBtn({ cardType: 'condition' })}
              draggable={true}
            />
          </Col>
        </div>
      </div>
      <div className="saveBtn">
        <Button small type="primary">
          Save
        </Button>
      </div>
    </div>
  );
};
