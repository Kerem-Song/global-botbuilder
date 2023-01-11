import { defaultNode } from '@components/data-display/DefaultCards';
import { Button } from '@components/general/Button';
import { Col } from '@components/layout/Col';
import { useRootState } from '@hooks';
import { getNodeKind, NODE_TYPES, TNodeTypes } from '@models';
import { appendNode } from '@store/makingNode';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { idGen } from '../../../modules';

const singleNodes = [
  { className: 'icText', value: NODE_TYPES.TEXT_NODE, nodeName: 'Text' },
  {
    className: 'icBtnTemple',
    value: NODE_TYPES.BASIC_CARD_NODE,
    nodeName: 'Button Template',
  },
  { className: 'icList', value: NODE_TYPES.LIST, nodeName: 'List' },
  { className: 'icCommerce', value: NODE_TYPES.PRODUCT_CARD_NODE, nodeName: 'Commerce' },
];

const carousleNodes = [
  {
    className: 'icCaroImg',
    value: NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
    nodeName: 'Carousel',
  },
  { className: 'icCaroList', value: NODE_TYPES.LIST_CAROUSEL, nodeName: 'List Carousel' },
  {
    className: 'icCaroCommerce',
    value: NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE,
    nodeName: 'Commerce Carousel',
  },
];

const buttonNodes = [
  { className: 'icQuickBtn', value: NODE_TYPES.ANSWER_NODE, nodeName: 'Quick Button' },
  { className: 'icCondition', value: NODE_TYPES.CONDITION_NODE, nodeName: 'Condition' },
  { className: 'icCount', value: NODE_TYPES.COUNT, nodeName: 'Count' },
];

export const BotBuilderHeader = () => {
  const [nodeName, setNodeName] = useState<string>();
  const cardNum = useRootState(
    (state) => state.makingNodeSliceReducer.present.nodes,
  ).length;

  const dispatch = useDispatch();

  const handleMakingChatbubbleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const cardType = e.currentTarget.value as TNodeTypes;
    const nodeName = e.currentTarget.getAttribute('data') as string;

    const addCard = defaultNode(cardType);

    const view = document.querySelector('.botBuilderMain');
    const canvas = document.querySelector('.canvasWrapper');
    const canvasRect = canvas?.getBoundingClientRect();
    const viewRect = view?.getBoundingClientRect();

    const addNode = {
      id: idGen.generate('node'),
      type: cardType,
      title: nodeName,
      cards: addCard,
      nodeKind: getNodeKind(cardType),
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

    const data = e.currentTarget.getAttribute('data') as string;
    e.dataTransfer.setData('nodeName', data);
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
            {singleNodes.map((item, i) => (
              <Button
                key={i}
                className={`${item.nodeName} icon ${item.className} `}
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => {
                  handleMakingChatbubbleClick(e);
                }}
                draggable={true}
                value={item.value}
                data={item.nodeName}
              />
            ))}
          </Col>
        </div>
        <div className="makingBtn">
          <span className="btnCategory">Carousel</span>
          <Col className="btnWrapper">
            {carousleNodes.map((item, i) => (
              <Button
                key={i}
                className={`${item.nodeName} icon ${item.className} `}
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value={item.value}
                data={item.nodeName}
              />
            ))}
          </Col>
        </div>
        <div className="makingBtn">
          <span className="btnCategory">Button</span>
          <Col className="btnWrapper">
            {buttonNodes.map((item, i) => (
              <Button
                key={i}
                className={`${item.nodeName} icon ${item.className} `}
                onDragStart={(e) => handleDragStart(e)}
                onClick={(e) => handleMakingChatbubbleClick(e)}
                draggable={true}
                value={item.value}
                data={item.nodeName}
              />
            ))}
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
