import { Col, Input, ItemType, Row } from '@components';
import { useRootState } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { getNodeKind, INode, NODE_TYPES } from '@models';
import { ID_GEN, ID_TYPES, NODE_PREFIX } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { GuideInfo } from '@store/botbuilderSlice';
import { addArrow, appendNode } from '@store/makingNode';
import {
  otherFlowScenariosPopupStatus,
  setIsClickHeaderBtn,
} from '@store/otherFlowScenarioPopupSlice';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

export const OtherFlowScenariosPopup = () => {
  const dispatch = useDispatch();
  const otherflowPopupRef = useRef<HTMLDivElement | null>(null);
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
  const popUpPosition = useRootState(
    (state) => state.otherFlowScenariosPopupStatusReducer.popupPosition,
  );
  const isOpen = useRootState(
    (state) => state.otherFlowScenariosPopupStatusReducer.isOpen,
  );
  const isClickHeaderBtn = useRootState(
    (state) => state.otherFlowScenariosPopupStatusReducer.isClickHeaderBtn,
  );
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
  const guideStart = useRootState((state) => state.botBuilderReducer.savedGuideInfo);

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

    dispatch(otherFlowScenariosPopupStatus(false));
  };

  useOutsideClick(otherflowPopupRef, () => {
    if (isClickHeaderBtn) {
      dispatch(setIsClickHeaderBtn(false));
      return;
    }

    dispatch(otherFlowScenariosPopupStatus(false));
  });

  useEffect(() => {
    console.log('@data, guide', data, guideStart);
    if (data) {
      setScenarioList(
        data?.map((item) => ({
          id: item.id,
          name: item.alias,
          type: 'search' as ItemType,
          data: {
            action: handleMakingOtherFlow,
            start: undefined,
            firstNodeId: item.firstNodeId,
          },
        })),
      );
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setItems(scenarioList);
      console.log('@scenariolist useeffect');
    }
  }, [scenarioList]);

  const [items, setItems] = useState(scenarioList);
  const [userInput, setUserInput] = useState<string | null>('');

  const onSearch = (data: string) => {
    const input = data.toLowerCase();

    const filtered = scenarioList?.filter((item) =>
      item.name.toLowerCase().includes(input),
    );

    setItems(filtered);
    setUserInput(input);

    if (!data) {
      setItems(scenarioList);
    }
  };

  useEffect(() => {
    if (!otherflowPopupRef.current) {
      return;
    } else {
      otherflowPopupRef.current.style.left = `${popUpPosition.x}px`;
      otherflowPopupRef.current.style.top = `${popUpPosition.y}px`;
    }
  }, []);

  return (
    <div
      className="luna-node luna-node-bordered border-radious-small luna-popup-container"
      ref={otherflowPopupRef}
      role="presentation"
      onWheel={(e) => e.stopPropagation()}
    >
      <>
        <Input
          placeholder="Input search text"
          search
          onSearch={(data) => onSearch(data as string)}
          onChange={(e) => setUserInput(e.currentTarget.value)}
          value={userInput || ''}
        />
      </>
      {items?.map((item, i) => (
        <Row justify="flex-start" align="center" gap={8} className="btnRow" key={i}>
          <Col span={24}>
            <div
              className="luna-chatbot-list luna-popup-list"
              onClick={() => item.data.action(item.name, item.data.firstNodeId)}
              role="presentation"
              style={{ width: '100%' }}
            >
              <div className="items-name">{item.name}</div>
            </div>
          </Col>
        </Row>
      ))}
    </div>
  );
};
