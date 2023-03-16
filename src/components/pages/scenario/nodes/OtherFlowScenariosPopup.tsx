import { Button, Col, ItemType, Row } from '@components';
import { useRootState } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { getNodeKind, INode, NODE_TYPES } from '@models';
import { ID_GEN, ID_TYPES, NODE_PREFIX } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { GuideInfo } from '@store/botbuilderSlice';
import { addArrow, appendNode } from '@store/makingNode';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

interface INodeLinkPopUpMenuProps {
  popUpPosition: { x: number; y: number };
  // handleIsOpen: (value: boolean) => void;
}

export const OtherFlowScenariosPopup = ({ popUpPosition }: INodeLinkPopUpMenuProps) => {
  const dispatch = useDispatch();
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
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
  };

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

  console.log('scenario list other', scenarioList);
  return (
    <>
      {scenarioList?.map((item, i) => (
        <Row justify="flex-start" align="center" gap={8} className="btnRow" key={i}>
          <Col>
            <Button className={`icon ${item.name}`} />
          </Col>
        </Row>
      ))}
    </>
  );
};
