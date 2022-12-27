import { defaultCards } from '@components/data-display/DefaultCards';
import { Button } from '@components/general/Button';
import { Col } from '@components/layout/Col';
import { useRootState } from '@hooks';
import { useModalOpen } from '@hooks/useModalOpen';
import { TDefaultCard } from '@models/interfaces/ICard';
import { appendNode } from '@store/makingNode';
import React from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { BotTester } from './BotTester/BotTester';

export const BotBuilderHeader = () => {
  const cardNum = useRootState(
    (state) => state.makingNodeSliceReducer.present.nodes,
  ).length;
  const { isOpen, handleIsOpen } = useModalOpen();

  const dispatch = useDispatch();

  const handleMakingChatbubbleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const cardType = e.currentTarget.value as TDefaultCard;

    const addCard = defaultCards(cardType);

    const view = document.querySelector('.botBuilderMain');
    const canvas = document.querySelector('.canvasWrapper');
    const canvasRect = canvas?.getBoundingClientRect();
    const viewRect = view?.getBoundingClientRect();

    const addNode = {
      id: uuidv4(),
      type: cardType,
      title: cardType,
      cards: addCard,
      x:
        canvasRect && viewRect
          ? viewRect.width / 2 - 108 + (viewRect.x - canvasRect.x)
          : 0,
      y:
        canvasRect && viewRect
          ? viewRect.height / 2 - 130 + (viewRect.y - canvasRect.y)
          : 0,
    };
    dispatch(appendNode(addNode));
  };

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData('cardType', e.currentTarget.value);
  };

  return (
    <>
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
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value="Text"
              />
              <Button
                className="icon icImg"
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value="Image"
              />
              <Button
                className="icon icBtnTemple"
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value="Button Template"
              />
              <Button
                className="icon icList"
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value="List"
              />
              <Button
                className="icon icCommerce"
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value="Commerce"
              />
            </Col>
          </div>
          <div className="makingBtn">
            <span className="btnCategory">Carousel</span>
            <Col className="btnWrapper">
              <Button
                className="icon icCaroImg"
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value="Button Carousel"
              />
              <Button
                className="icon icCaroList"
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value="List Carousel"
              />
              <Button
                className="icon icCaroCommerce"
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value="Commerce Carousel"
              />
            </Col>
          </div>
          <div className="makingBtn">
            <span className="btnCategory">Button</span>
            <Col className="btnWrapper">
              <Button
                className="icon icQuickBtn"
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value="Quick Reply"
              />
              <Button
                className="icon icCondition"
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value="Condition"
              />
              <Button
                className="icon icCount"
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value="Count"
              />
            </Col>
          </div>
        </div>
        <div className="testBtn">
          <Button small type="default" onClick={() => handleIsOpen(true)}>
            Test
          </Button>
        </div>
        <div className="saveBtn">
          <Button small type="primary">
            Save
          </Button>
        </div>
      </div>
      <BotTester isOpen={isOpen} handleIsOpen={handleIsOpen} />
    </>
  );
};
