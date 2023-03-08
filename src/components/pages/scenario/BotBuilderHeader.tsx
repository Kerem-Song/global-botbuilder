import { Button } from '@components/general/Button';
import { Col } from '@components/layout/Col';
import { Tooltip } from '@components/navigation/Tooltip';
import { usePage, useRootState, useScenarioClient } from '@hooks';
import { useYupValidation } from '@hooks/useYupValidation';
import { getNodeKind, INode, NODE_TYPES, TNodeTypes } from '@models';
import { lunaToast } from '@modules/lunaToast';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { setInvalidateNode } from '@store/botbuilderSlice';
import { appendNode } from '@store/makingNode';
import React from 'react';
import { useDispatch } from 'react-redux';

import { ID_GEN, ID_TYPES } from '../../../modules';

const singleNodes = [
  { className: 'icText', value: NODE_TYPES.TEXT_NODE, nodeName: 'Text' },
  {
    className: 'icBtnTemple',
    value: NODE_TYPES.BASIC_CARD_NODE,
    nodeName: '기본카드',
  },
  { className: 'icList', value: NODE_TYPES.LIST_CARD_NODE, nodeName: 'List' },
  { className: 'icCommerce', value: NODE_TYPES.PRODUCT_CARD_NODE, nodeName: 'Commerce' },
];

const carousleNodes = [
  {
    className: 'icCaroImg',
    value: NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
    nodeName: 'Carousel',
  },
  {
    className: 'icCaroList',
    value: NODE_TYPES.LIST_CARD_CAROUSEL_NODE,
    nodeName: 'List Carousel',
  },
  {
    className: 'icCaroCommerce',
    value: NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE,
    nodeName: 'Commerce Carousel',
  },
];

const buttonNodes = [
  { className: 'icQuickBtn', value: NODE_TYPES.ANSWER_NODE, nodeName: 'Quick Button' },
  { className: 'icCondition', value: NODE_TYPES.CONDITION_NODE, nodeName: 'Condition' },
  { className: 'icCount', value: NODE_TYPES.RETRY_CONDITION_NODE, nodeName: 'Count' },
  {
    className: 'icSetParameter',
    value: NODE_TYPES.PARAMETER_SET_NODE,
    nodeName: 'Parameter Set',
  },
  {
    className: 'icOtherFlowRedirect',
    value: NODE_TYPES.OTHER_FLOW_REDIRECT_NODE,
    nodeName: 'Other Flow Redirect',
  },
];

export const BotBuilderHeader = () => {
  const { t, tc } = usePage();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );

  const cardNum = nodes.length;

  const dispatch = useDispatch();
  const { scenarioSaveAsync } = useScenarioClient();

  const { schema } = useYupValidation();

  const handleScenarioSave = async () => {
    if (selectedScenario) {
      const results = await Promise.all(
        nodes.map(async (n) => {
          try {
            await schema.validate(n);
            dispatch(setInvalidateNode({ id: n.id, isValid: true }));
            return true;
          } catch (e) {
            dispatch(setInvalidateNode({ id: n.id, isValid: false }));
            return false;
          }
        }),
      );

      if (results.includes(false)) {
        lunaToast.error('저장에 실패하였습니다.');
        return;
      }

      scenarioSaveAsync({ scenarioId: selectedScenario.id });
    }
  };

  const handleMakingChatbubbleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const cardType = e.currentTarget.value as TNodeTypes;
    const nodeName = e.currentTarget.getAttribute('data') as string;

    const nodeView = nodeDefaultHelper.createDefaultView(cardType);

    const view = document.querySelector('.botBuilderMain');
    const canvas = document.querySelector('.canvasWrapper');
    const canvasRect = canvas?.getBoundingClientRect();
    const viewRect = view?.getBoundingClientRect();

    const addNode: INode = {
      id: ID_GEN.generate(ID_TYPES.NODE),
      type: cardType,
      title: nodeName,
      view: nodeView,
      nodeKind: getNodeKind(cardType),
      option: 1,
      seq: 0,
      x:
        canvasRect && viewRect
          ? Math.round(viewRect.width / 2 - 108 + (viewRect.x - canvasRect.x))
          : 0,
      y:
        canvasRect && viewRect
          ? Math.round(viewRect.height / 2 - 130 + (viewRect.y - canvasRect.y))
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
      <span className="cardNumWrapper">
        {t(`CHAT_BUBBLE`)} <span className="cardNum">{cardNum}</span>
      </span>
      <div className="makingBtnWrapper">
        <div className="makingBtn">
          <span className="btnCategory">{t(`SINGLE`)}</span>
          <Col className="btnWrapper">
            {singleNodes.map((item, i) => (
              <Tooltip tooltip={item.nodeName} key={i}>
                <Button
                  className={`${item.nodeName} icon ${item.className} `}
                  onDragStart={(e) => handleDragStart(e)}
                  onClick={(e) => {
                    handleMakingChatbubbleClick(e);
                  }}
                  draggable={true}
                  value={item.value}
                  data={item.nodeName}
                />
              </Tooltip>
            ))}
          </Col>
        </div>
        <div className="makingBtn">
          <span className="btnCategory">{t(`CAROUSEL`)}</span>
          <Col className="btnWrapper">
            {carousleNodes.map((item, i) => (
              <Tooltip tooltip={item.nodeName} key={i}>
                <Button
                  key={i}
                  className={`${item.nodeName} icon ${item.className} `}
                  onDragStart={(e) => handleDragStart(e)}
                  onClick={(e) => handleMakingChatbubbleClick(e)}
                  draggable={true}
                  value={item.value}
                  data={item.nodeName}
                />
              </Tooltip>
            ))}
          </Col>
        </div>
        <div className="makingBtn">
          <span className="btnCategory">{t(`FUNCTION`)}</span>
          <Col className="btnWrapper">
            {buttonNodes.map((item, i) => (
              <Tooltip tooltip={item.nodeName} key={i}>
                <Button
                  className={`${item.nodeName} icon ${item.className} `}
                  onDragStart={(e) => handleDragStart(e)}
                  onClick={(e) => handleMakingChatbubbleClick(e)}
                  draggable={true}
                  value={item.value}
                  data={item.nodeName}
                />
              </Tooltip>
            ))}
          </Col>
        </div>
      </div>
      <div className="saveBtn">
        <Button small type="primary" onClick={handleScenarioSave}>
          {tc(`SAVE`)}
        </Button>
      </div>
    </div>
  );
};
