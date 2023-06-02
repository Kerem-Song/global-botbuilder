import { Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { ItemType, Popper } from '@components/navigation';
import { useHistoryViewerMatch, usePage, useRootState } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { INode, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';
import { ID_GEN, ID_TYPES, NODE_PREFIX } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { GuideInfo } from '@store/botbuilderSlice';
import { addArrow, appendNode } from '@store/makingNode';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

interface INodeLinkPopUpMenuProps {
  popUpPosition: { x: number; y: number };
  handleIsOpen: (value: boolean) => void;
}

export const NodeLinkPopUpMenu = ({
  popUpPosition,
  handleIsOpen,
}: INodeLinkPopUpMenuProps) => {
  const { t } = usePage();

  const cardTypeValue = [
    {
      className: 'icText',
      value: NODE_TYPES.TEXT_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_TEXT_CARD_NODE`),
      nodeKind: NodeKind.InputNode,
    },
    {
      className: 'icBtnTemple',
      value: NODE_TYPES.BASIC_CARD_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_BASIC_CARD_NODE`),
      nodeKind: NodeKind.InputNode,
    },
    {
      className: 'icList',
      value: NODE_TYPES.LIST_CARD_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_LIST_CARD_NODE`),
      nodeKind: NodeKind.InputNode,
    },
    {
      className: 'icCommerce',
      value: NODE_TYPES.PRODUCT_CARD_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_PRODUCT_CARD_NODE`),
      nodeKind: NodeKind.InputNode,
    },
    {
      className: 'icCaroImg',
      value: NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_BASIC_CARD_CAROUSEL_CARD_NODE`),
      nodeKind: NodeKind.InputNode,
    },
    {
      className: 'icCaroList',
      value: NODE_TYPES.LIST_CARD_CAROUSEL_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_LIST_CARD_CAROUSEL_CARD_NODE`),
      nodeKind: NodeKind.InputNode,
    },
    {
      className: 'icCaroCommerce',
      value: NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_PRODUCT_CARD_CAROUSEL_CARD_NODE`),
      nodeKind: NodeKind.InputNode,
    },
    {
      className: 'icQuickBtn',
      value: NODE_TYPES.ANSWER_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_ANSWER_NODE`),
      nodeKind: NodeKind.AnswerNode,
    },
    {
      className: 'icCondition',
      value: NODE_TYPES.CONDITION_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_CONDITION_NODE`),
      nodeKind: NodeKind.CommandNode,
    },
    {
      className: 'icCount',
      value: NODE_TYPES.RETRY_CONDITION_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_RETRY_CONDITION_NODE`),
      nodeKind: NodeKind.CommandNode,
    },
    {
      className: 'icSetParameter',
      value: NODE_TYPES.PARAMETER_SET_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_PARAMETER_SET_NODE`),
      nodeKind: NodeKind.CommandNode,
    },
    {
      className: 'icOtherFlowRedirect',
      value: NODE_TYPES.OTHER_FLOW_REDIRECT_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_OTHER_FLOW_REDIRECT_NODE`),
      nodeKind: NodeKind.CommandNode,
    },
    {
      className: 'icJsonRequest',
      value: NODE_TYPES.JSON_REQUEST_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_JSON_REQUEST_NODE`),
      nodeKind: NodeKind.CommandNode,
    },
    {
      className: 'icDataBasic',
      value: NODE_TYPES.DATA_BASIC_CARD_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_DATA_BASIC_CARD_NODE`),
      nodeKind: NodeKind.InputNode,
    },
    {
      className: 'icDataList',
      value: NODE_TYPES.DATA_LIST_CARD_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_DATA_LIST_CARD_NODE`),
      nodeKind: NodeKind.InputNode,
    },
    {
      className: 'icDataProduct',
      value: NODE_TYPES.DATA_PRODUCT_CARD_NODE,
      nodeName: t(`NODE_LINK_POPUP_MENU_DATA_PRODUCT_CARD_NODE`),
      nodeKind: NodeKind.InputNode,
    },
  ];

  const [userInput, setUserInput] = useState<string>();

  const dispatch = useDispatch();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);

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

  const [tempNodeNames, setTempNodeNames] = useState<number[]>([]);
  const nodeLinkPopUpMenuRef = useRef<HTMLDivElement | null>(null);
  const guideStart = useRootState((state) => state.botBuilderReducer.savedGuideInfo);

  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
  const isHistoryViewer = useHistoryViewerMatch();
  const scale = useRootState((state) => state.botBuilderReducer.scale);

  const handleMakingChatbubble = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const nodeType = e.currentTarget.dataset.nodetype as TNodeTypes;
    const nodeName = e.currentTarget.dataset.nodename;

    const nodeView = nodeDefaultHelper.createDefaultView(nodeType);

    const basicNameNodesRegex = new RegExp(`${nodeName}`);
    const filtered = nodes.filter((node) => basicNameNodesRegex.test(node.title!));
    let index = 1;

    if (filtered || tempNodeNames) {
      const regex = /[^0-9]/g;
      const results = filtered?.map((x) => Number(x.title?.replace(regex, ''))) || [];
      const max = Math.max(...results, ...tempNodeNames);

      for (let i = 1; i <= max + 1; i++) {
        if (!results.includes(i)) {
          index = i;
          break;
        }
      }
    }

    setTempNodeNames([...tempNodeNames, index]);

    const addNode: INode = {
      id: ID_GEN.generate('node'),
      type: nodeType,
      title: `${nodeName} ` + `${index}`.padStart(2, '0'),
      view: nodeView,
      seq: 0,
      x: Math.round(popUpPosition.x),
      y: Math.round(popUpPosition.y),
      nodeKind: nodeFactory.getFactory(nodeType)?.nodeKind || NodeKind.Unkonown,
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

  const startNode = nodes.find((x) => x.id === guideStart?.nodeId?.substring(5));
  console.log('guideStart?.nodeId', guideStart?.nodeId?.substring(5));
  console.log('startNode Type', startNode?.type);
  const filterdBtnList = cardTypeValue
    .filter(
      (b) =>
        b.nodeKind !== NodeKind.CommandNode ||
        b.value === NODE_TYPES.CONDITION_NODE ||
        guideStart?.isNext,
    )
    .filter(
      (b) =>
        startNode?.type !== NODE_TYPES.INTENT_NODE ||
        b.value !== NODE_TYPES.OTHER_FLOW_REDIRECT_NODE,
    )
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
      nodeLinkPopUpMenuRef.current.style.transform = `scale(${1 / scale})`;
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

    const view = nodeDefaultHelper.createDefaultOtherFlowRedirectView();
    const addNode: INode = {
      id: ID_GEN.generate(ID_TYPES.NODE),
      type: nodeType,
      title: nodeName,
      x: popUpPosition.x,
      y: popUpPosition.y,
      seq: 0,
      nodeKind: nodeFactory.getFactory(nodeType)?.nodeKind || NodeKind.Unkonown,
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
      <Input
        placeholder={t('INPUT_SEARCH_WORD')}
        search
        value={userInput}
        onSearch={(v) => onSearch(v)}
        onChange={(e) => onSearch(e.target.value)}
      />

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
                    disabled={isHistoryViewer}
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
          <div>{t(`NO_SCENARIO_RESULTS`)}</div>
        )}
      </div>
    </div>
  );
};
