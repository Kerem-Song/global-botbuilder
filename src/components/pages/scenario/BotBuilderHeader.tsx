import { Button } from '@components/general/Button';
import { Col } from '@components/layout/Col';
import { IBasicCard } from '@models/interfaces/ICard';
import { appendNode } from '@store/makingNode';
import React from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

export const BotBuilderHeader = () => {
  const cardNum = 12;
  const dispatch = useDispatch();

  const handleMakingChatbubbleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const cardType = e.currentTarget.value;
    const addCard: IBasicCard[] = [
      {
        title: '',
        thumbnail: cardType === 'text' ? undefined : { imageUrl: '' },
        description: '',
        buttons:
          cardType === 'text' ? undefined : [{ label: 'add a button', action: 'block' }],
      },
    ];

    const view = document.querySelector('.botBuilderMain');
    const canvas = document.querySelector('.canvasWrapper');
    const canvasRect = canvas?.getBoundingClientRect();
    const viewRect = view?.getBoundingClientRect();

    const addNode = {
      id: uuidv4(),
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
              onClick={(e) => handleMakingChatbubbleClick(e)}
              draggable={true}
              value="text"
            />
            <Button
              className="icon icImg"
              onDragStart={(e) => handleDragStart(e)}
              onClick={(e) => handleMakingChatbubbleClick(e)}
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
