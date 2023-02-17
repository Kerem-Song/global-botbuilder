import { Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { ItemType, Popper } from '@components/navigation';
import { useRootState, useScenarioClient } from '@hooks';
import { useOutsideClick } from '@hooks/useOutsideClick';
import {
  getNodeKind,
  INode,
  NODE_TYPES,
  NodeKind,
  TCardsValues,
  TNodeTypes,
} from '@models';
import { GuideInfo } from '@store/botbuilderSlice';
import { addArrow, appendNode } from '@store/makingNode';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { ID_GEN, ID_TYPES, NODE_PREFIX } from '../../../modules';
import { nodeHelper } from '../../../modules/nodeHelper';

interface INodeLinkPopUpFormValue {
  cardType: TCardsValues;
}

interface INodeLinkPopUpMenuProps {
  popUpPosition: { x: number; y: number };
  handleIsOpen: (value: boolean) => void;
}

const cardTypeValue = [
  {
    className: 'icText',
    value: NODE_TYPES.TEXT_NODE,
    nodeName: 'Text',
    nodeKind: NodeKind.InputNode,
  },
  {
    className: 'icBtnTemple',
    value: NODE_TYPES.BASIC_CARD_NODE,
    nodeName: 'Button Template',
    nodeKind: NodeKind.InputNode,
  },
  {
    className: 'icList',
    value: NODE_TYPES.LIST_CARD_NODE,
    nodeName: 'List',
    nodeKind: NodeKind.InputNode,
  },
  {
    className: 'icCommerce',
    value: NODE_TYPES.PRODUCT_CARD_NODE,
    nodeName: 'Commerce',
    nodeKind: NodeKind.InputNode,
  },
  {
    className: 'icCaroImg',
    value: NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
    nodeName: 'Carousel',
    nodeKind: NodeKind.InputNode,
  },
  {
    className: 'icCaroList',
    value: NODE_TYPES.LIST_CARD_CAROUSEL_NODE,
    nodeName: 'List Carousel',
    nodeKind: NodeKind.InputNode,
  },
  {
    className: 'icCaroCommerce',
    value: NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE,
    nodeName: 'Commerce Carousel',
    nodeKind: NodeKind.InputNode,
  },
  {
    className: 'icQuickBtn',
    value: NODE_TYPES.ANSWER_NODE,
    nodeName: 'Quick Button',
    nodeKind: NodeKind.AnswerNode,
  },
  {
    className: 'icCondition',
    value: NODE_TYPES.CONDITION_NODE,
    nodeName: 'Condition',
    nodeKind: NodeKind.CommandNode,
  },
  {
    className: 'icCount',
    value: NODE_TYPES.RETRY_CONDITION_NODE,
    nodeName: 'Count',
    nodeKind: NodeKind.CommandNode,
  },
  {
    className: 'icSetParameter',
    value: NODE_TYPES.PARAMETER_SET_NODE,
    nodeName: 'Parameter Set',
    nodeKind: NodeKind.CommandNode,
  },
  {
    className: 'icOtherFlowRedirect',
    value: NODE_TYPES.OTHER_FLOW_REDIRECT_NODE,
    nodeName: 'Other Flow Redirect',
    nodeKind: NodeKind.CommandNode,
  },
];

export const NodeLinkPopUpMenu = ({
  popUpPosition,
  handleIsOpen,
}: INodeLinkPopUpMenuProps) => {
  const { botId } = useParams();
  const [userInput, setUserInput] = useState<string>();
  const dispatch = useDispatch();
  //const [cardBtn, setCardBtn] = useState(cardTypeValue);
  const [scenarioList, setScenarioList] = useState<
    {
      id: string;
      name: string;
      type: ItemType;
      data: {
        action: (name: string, firstNodeId: string, start?: GuideInfo) => void;
        start?: GuideInfo;
        firstNodeId: string;
      };
    }[]
  >();
  const nodeLinkPopUpMenuRef = useRef<HTMLDivElement | null>(null);
  const guideStart = useRootState((state) => state.botBuilderReducer.savedGuideInfo);

  const { getCachedScenarioList } = useScenarioClient();
  const data = getCachedScenarioList(botId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<INodeLinkPopUpFormValue>();

  // const onSubmit = () => {
  //   if (!userInput) {
  //     setCardBtn(cardTypeValue);
  //   }
  // };

  const handleMakingChatbubble = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const nodeType = e.currentTarget.dataset.nodetype as TNodeTypes;
    const nodeName = e.currentTarget.dataset.nodename;

    const nodeView = nodeHelper.createDefaultView(nodeType);
    const addNode: INode = {
      id: ID_GEN.generate('node'),
      type: nodeType,
      title: nodeName,
      view: nodeView,
      option: 1,
      seq: 0,
      x: Math.round(popUpPosition.x),
      y: Math.round(popUpPosition.y),
      nodeKind: getNodeKind(nodeType),
    };

    dispatch(appendNode(addNode));

    if (guideStart) {
      dispatch(
        addArrow({
          start: guideStart.startId,
          end: `${NODE_PREFIX}${addNode.id}`,
          isNextNode: guideStart.isNext,
          updateKey: guideStart.nodeId,
          type: guideStart.type,
        }),
      );
    }

    handleIsOpen(false);
  };

  const onSearch = (data?: string) => {
    setUserInput(data?.toLowerCase());
  };

  const filterdBtnList = cardTypeValue
    .filter((b) => b.nodeKind !== NodeKind.CommandNode || guideStart?.isNext)
    .filter((b) => (userInput ? b.nodeName.toLowerCase().includes(userInput) : true));

  const cardBtnResult = classNames('btnWrapper', {
    noResult: !filterdBtnList.length,
  });

  useOutsideClick(nodeLinkPopUpMenuRef, () => {
    handleIsOpen(false);
  });

  useEffect(() => {
    if (!nodeLinkPopUpMenuRef.current) {
      return;
    } else {
      nodeLinkPopUpMenuRef.current.style.left = `${popUpPosition.x}px`;
      nodeLinkPopUpMenuRef.current.style.top = `${popUpPosition.y}px`;
    }
  }, []);

  useEffect(() => {
    if (data && guideStart) {
      setScenarioList(
        data?.map((item) => ({
          id: item.id,
          name: item.alias,
          type: 'search' as ItemType,
          data: {
            action: handleMakingOtherFlow,
            start: guideStart,
            firstNodeId: item.firstNodeId,
          },
        })),
      );
    }
  }, [data, guideStart]);

  const handleMakingOtherFlow = (
    name: string,
    firstNodeId: string,
    guide?: GuideInfo,
  ) => {
    console.log(firstNodeId);
    const nodeType = NODE_TYPES.OTHER_FLOW_REDIRECT_NODE;
    const nodeName = name;

    const view = nodeHelper.createDefaultOtherFlowRedirectView();
    const addNode: INode = {
      id: ID_GEN.generate(ID_TYPES.NODE),
      type: nodeType,
      title: nodeName,
      x: popUpPosition.x,
      y: popUpPosition.y,
      option: 64,
      seq: 0,
      nodeKind: getNodeKind(nodeType),
      view,
      nextNodeId: firstNodeId,
    };

    dispatch(appendNode(addNode));

    if (guide) {
      dispatch(
        addArrow({
          start: guide.startId,
          end: `${NODE_PREFIX}${addNode.id}`,
          isNextNode: guide.isNext,
          updateKey: guide.nodeId,
          type: guide.type,
        }),
      );
    }

    handleIsOpen(false);
  };

  return (
    <div
      className="nodeLinkPopUpMenuWrapper luna-node luna-node-bordered border-radious-small"
      ref={nodeLinkPopUpMenuRef}
      role="presentation"
      onWheel={(e) => e.stopPropagation()}
    >
      <Input placeholder="Input search text" search onSearch={(data) => onSearch(data)} />

      <div className={cardBtnResult}>
        {filterdBtnList.length > 0 ? (
          filterdBtnList.map((item, i) => (
            <div key={i}>
              {item.value === NODE_TYPES.OTHER_FLOW_REDIRECT_NODE && scenarioList ? (
                <div>
                  <Popper
                    placement="right-start"
                    offset={[200, 20]}
                    popperItems={scenarioList}
                    onChange={(m) => {
                      m.data?.action?.(m.name, m.data.firstNodeId, m.data.start);
                    }}
                    popup
                    popupList
                  >
                    <Row justify="flex-start" align="center" gap={8} className="btnRow">
                      <Col>
                        <Button className={`icon ${item.className}`} />
                      </Col>
                      <Col>
                        <span className="cardType">{item.nodeName}</span>
                      </Col>
                    </Row>
                  </Popper>
                </div>
              ) : (
                <div
                  key={i}
                  onClick={(e) => handleMakingChatbubble(e)}
                  role="presentation"
                  data-nodename={item.nodeName}
                  data-nodetype={item.value}
                >
                  <Row justify="flex-start" align="center" gap={8} className="btnRow">
                    <Col>
                      <Button className={`icon ${item.className}`} />
                    </Col>
                    <Col>
                      <span className="cardType">{item.nodeName}</span>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
          ))
        ) : (
          <div>No Results</div>
        )}
      </div>
    </div>
  );
};
