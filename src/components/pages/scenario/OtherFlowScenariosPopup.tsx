import { icOtherFlowRedirect } from '@assets';
import { Col, Input, ItemType, Row } from '@components';
import { usePage, useRootState } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { useAddArrow } from '@hooks/useAddArrow';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { INode, NODE_TYPES, NodeKind } from '@models';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';
import { ID_GEN, ID_TYPES, NODE_PREFIX } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { GuideInfo } from '@store/botbuilderSlice';
import { appendNode } from '@store/makingNode';
import {
  otherFlowScenariosPopupStatus,
  setIsClickHeaderBtn,
} from '@store/otherFlowScenarioPopupSlice';
import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
export const OtherFlowScenariosPopup = () => {
  const [tempNodeNames, setTempNodeNames] = useState<number[]>([]);
  const { control } = useForm();
  const dispatch = useDispatch();

  const otherflowPopupRef = useRef<HTMLDivElement | null>(null);
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
  const { t } = usePage();
  const deferredData = useDeferredValue(data);
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const { addArrowHandler } = useAddArrow();
  const popUpPosition = useRootState(
    (state) => state.otherFlowScenariosPopupStatusReducer.popupPosition,
  );
  const isOpen = useRootState(
    (state) => state.otherFlowScenariosPopupStatusReducer.isOpen,
  );
  const isClickHeaderBtn = useRootState(
    (state) => state.otherFlowScenariosPopupStatusReducer.isClickHeaderBtn,
  );
  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const { field: searchInput } = useController({ name: 'searchInput', control });
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
    const nodeType = NODE_TYPES.OTHER_FLOW_REDIRECT_NODE;
    const nodeName = t(`CAPTION_OTHERFLOWREDIRECTNODE`);

    const basicNameNodesRegex = new RegExp(`${nodeName}`);
    const filtered = nodes.filter((node) => basicNameNodesRegex.test(node.title!));
    let index = 1;

    if (filtered || tempNodeNames) {
      const regex = /[^0-9]/g;
      const results =
        filtered
          ?.map((x) => Number(x.title?.replace(regex, '')))
          .sort((a: number, b: number) => {
            return a - b;
          }) || [];
      const max = Math.max(...results, ...tempNodeNames);

      for (let i = 1; i <= max + 1; i++) {
        if (!results.includes(i)) {
          index = i;
          break;
        }
      }
    }

    setTempNodeNames([...tempNodeNames, index]);

    const view = nodeDefaultHelper.createDefaultOtherFlowRedirectView();
    const addNode: INode = {
      id: ID_GEN.generate(ID_TYPES.NODE),
      type: nodeType,
      title: `${nodeName} ` + `${index}`.padStart(2, '0'),
      x: popUpPosition.x,
      y: popUpPosition.y,
      option: 64,
      seq: 0,
      nodeKind: nodeFactory.getFactory(nodeType)?.nodeKind || NodeKind.Unkonown,
      view,
      nextNodeId: firstNodeId,
    };

    dispatch(appendNode(addNode));

    if (guide) {
      addArrowHandler(nodes, {
        start: guide.startId,
        end: `${NODE_PREFIX}${addNode.id}`,
        isNextNode: guide.isNext,
        updateKey: guide.nodeId,
        type: guide.type,
      });
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
    if (deferredData) {
      setScenarioList(
        deferredData?.map((item) => ({
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

    // 메모리 관리
    return () => {
      setScenarioList([]);
    };
  }, [deferredData]);

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
    if (deferredData) {
      setItems(scenarioList);
    }

    // 메모리 관리
    return () => {
      setItems([]);
    };
  }, [scenarioList]);

  useEffect(() => {
    if (!otherflowPopupRef.current) {
      return;
    } else {
      otherflowPopupRef.current.style.left = `${popUpPosition.x}px`;
      otherflowPopupRef.current.style.top = `${popUpPosition.y}px`;
      otherflowPopupRef.current.style.transform = `scale(${1 / scale})`;
    }
  }, []);

  return (
    <div
      className="luna-node luna-node-bordered border-radious-small luna-popup-container otherFlowRedirectPopup"
      ref={otherflowPopupRef}
      role="presentation"
      onWheel={(e) => e.stopPropagation()}
    >
      <Row justify="center" align="center" className="otherFlowRedirectPopupLabelWrapper">
        <Col className="otherFlowRedirectPopupImg" span={4}>
          <img src={icOtherFlowRedirect} alt="otherFlowScenarioPopupIcon" />
        </Col>
        <Col className="otherFlowRedirectPopupLabel" span={20}>
          {t(`OTHER_FLOW_REDIRECT_NODE_POPUP_LABEL`)}
        </Col>
      </Row>
      <>
        <Input
          {...searchInput}
          placeholder={t('INPUT_SEARCH_WORD')}
          search
          onSearch={(data) => onSearch(data as string)}
          onChange={(e) => {
            setUserInput(e.currentTarget.value);
            searchInput.onChange();
            onSearch(e.currentTarget.value);
          }}
          value={userInput || ''}
        />
      </>
      {items?.length ? (
        items?.map((item, i) => (
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
        ))
      ) : (
        <div className="noScenarioResult">{t(`NO_SCENARIO_RESULTS`)}</div>
      )}
    </div>
  );
};
