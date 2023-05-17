import { Button } from '@components/general/Button';
import { Col } from '@components/layout/Col';
import { Tooltip } from '@components/navigation/Tooltip';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePage, useRootState, useScenarioClient, useSystemModal } from '@hooks';
import { useYupValidation } from '@hooks/useYupValidation';
import { INode, INodeEditModel, NODE_TYPES, NodeKind, TNodeTypes } from '@models';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';
import { lunaToast } from '@modules/lunaToast';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { setInvalidateNode } from '@store/botbuilderSlice';
import editNodeAsync from '@store/editNodeAsync';
import { appendNode } from '@store/makingNode';
import {
  otherFlowScenariosPopupStatus,
  setIsClickHeaderBtn,
  setOtherFlowPopupPosition,
} from '@store/otherFlowScenarioPopupSlice';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { ID_GEN, ID_TYPES, useAppDispatch } from '../../../modules';
import { NodeEditDrawer } from './edit/NodeEditDrawer';

const singleNodes = [
  { className: 'icText', value: NODE_TYPES.TEXT_NODE, nodeName: '텍스트' },
  {
    className: 'icBtnTemple',
    value: NODE_TYPES.BASIC_CARD_NODE,
    nodeName: '기본 카드',
  },
  { className: 'icList', value: NODE_TYPES.LIST_CARD_NODE, nodeName: '리스트' },
  { className: 'icCommerce', value: NODE_TYPES.PRODUCT_CARD_NODE, nodeName: '커머스' },
];

const carousleNodes = [
  {
    className: 'icCaroImg',
    value: NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
    nodeName: '기본 카드 캐로셀',
  },
  {
    className: 'icCaroList',
    value: NODE_TYPES.LIST_CARD_CAROUSEL_NODE,
    nodeName: '리스트 캐로셀',
  },
  {
    className: 'icCaroCommerce',
    value: NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE,
    nodeName: '커머스 캐로셀',
  },
];

const buttonNodes = [
  { className: 'icQuickBtn', value: NODE_TYPES.ANSWER_NODE, nodeName: '퀵리플라이' },
  { className: 'icCondition', value: NODE_TYPES.CONDITION_NODE, nodeName: '컨디션' },
  { className: 'icCount', value: NODE_TYPES.RETRY_CONDITION_NODE, nodeName: '카운트' },
  {
    className: 'icSetParameter',
    value: NODE_TYPES.PARAMETER_SET_NODE,
    nodeName: '파라미터',
  },
  {
    className: 'icOtherFlowRedirect',
    value: NODE_TYPES.OTHER_FLOW_REDIRECT_NODE,
    nodeName: '시나리오',
  },
];

const apiNodes = [
  {
    className: 'icJsonRequest',
    value: NODE_TYPES.JSON_REQUEST_NODE,
    nodeName: 'Api Request',
  },
  {
    className: 'icDataBasic',
    value: NODE_TYPES.DATA_BASIC_CARD_NODE,
    nodeName: 'Data 기본 카드',
  },
  {
    className: 'icDataList',
    value: NODE_TYPES.DATA_LIST_CARD_NODE,
    nodeName: 'Data 리스트',
  },
  {
    className: 'icDataProduct',
    value: NODE_TYPES.DATA_PRODUCT_CARD_NODE,
    nodeName: 'Data 커머스',
  },
];

export const BotBuilderHeader = () => {
  const { t, tc } = usePage();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const changed = useRootState((state) => state.makingNodeSliceReducer.present.changed);
  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const isEditDrawOpen = useRootState(
    (state) => state.botBuilderReducer.isEditDrawerOpen,
  );

  const cardNum = nodes.length;
  const [tempNodeNames, setTempNodeNames] = useState<number[]>([]);
  const dispatch = useDispatch();
  const { scenarioSaveAsync, scenarioSaving } = useScenarioClient();

  const { schema } = useYupValidation();
  console.log(selectedScenario);

  const { error } = useSystemModal();

  const checkFallbackStart = async () => {
    await error({
      title: t(`VALIDATION_CHECK_FALLBACK_START_TITLE`),
      description: (
        <>
          <span style={{ whiteSpace: 'pre-line' }}>
            {t(`VALIDATION_CHECK_FALLBACK_START_DESC`)}
          </span>
        </>
      ),
    });
  };

  const appDispatch = useAppDispatch();
  const handleScenarioSave = async () => {
    if (isEditDrawOpen) {
      await appDispatch(editNodeAsync(formMethods.getValues()));
    }
    if (selectedScenario) {
      const results = await Promise.all(
        nodes.map(async (n) => {
          try {
            await schema.validate(n);
            dispatch(setInvalidateNode({ id: n.id, isValid: true }));
            return true;
          } catch (e) {
            // 챗봇 도움말일 경우 얼럿
            if (n.option === 20) {
              checkFallbackStart();
            }

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

    if (cardType === 'OtherFlowRedirectNode') {
      dispatch(
        setOtherFlowPopupPosition({
          x:
            canvasRect && viewRect
              ? Math.round(viewRect.width / 2 - 108 + (viewRect.x - canvasRect.x))
              : 0,
          y:
            canvasRect && viewRect
              ? Math.round(viewRect.height / 2 - 130 + (viewRect.y - canvasRect.y))
              : 0,
        }),
      );
      dispatch(otherFlowScenariosPopupStatus(true));
      dispatch(setIsClickHeaderBtn(true));
      return;
    }

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
      id: ID_GEN.generate(ID_TYPES.NODE),
      type: cardType,
      title: `${nodeName} ` + `${index}`.padStart(2, '0'),
      view: nodeView,
      nodeKind: nodeFactory.getFactory(cardType)?.nodeKind || NodeKind.Unkonown,
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

  const [isTutorial, setIsTutorial] = useState<boolean>(true);

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData('cardType', e.currentTarget.value);

    const data = e.currentTarget.getAttribute('data') as string;
    e.dataTransfer.setData('nodeName', data);
  };

  useEffect(() => {
    setTempNodeNames([]);
  }, [nodes]);

  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const selectedNode = nodes.find((x) => x.id === selected);

  const formMethods = useForm<INodeEditModel>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      ...selectedNode,
      title: undefined,
      view: { id: undefined, typeName: undefined },
    },
    resolver: yupResolver(schema),
  });

  return (
    <>
      <div className="botBuilderHeader">
        <span className="cardNumWrapper">
          {t(`CHAT_BUBBLE`)} <span className="cardNum">{cardNum}</span>
        </span>
        <div className="makingBtnWrapper">
          <div className="makingBtn" data-tutorial={isTutorial}>
            <span className="btnCategory">{t(`SINGLE`)}</span>
            <Col className="btnWrapper">
              {singleNodes.map((item, i) => (
                <Tooltip tooltip={item.nodeName} key={i}>
                  <Button
                    className={`${item.nodeName} icon ${item.className}`}
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
          <div className="makingBtn" data-tutorial={isTutorial}>
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
          <div className="makingBtn" data-tutorial={isTutorial}>
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
          <div className="makingBtn" data-tutorial={isTutorial}>
            <span className="btnCategory">API</span>
            <Col className="btnWrapper">
              {apiNodes.map((item, i) => (
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
          <Button
            small
            type="primary"
            onClick={handleScenarioSave}
            disabled={scenarioSaving || (!changed && !isEditDrawOpen)}
          >
            {tc(`SAVE`)}
          </Button>
        </div>
      </div>
      <FormProvider {...formMethods}>
        <form onSubmit={(e) => e.preventDefault()}>
          <NodeEditDrawer />
        </form>
      </FormProvider>
    </>
  );
};
