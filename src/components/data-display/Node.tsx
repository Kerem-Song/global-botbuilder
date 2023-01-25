import { icCardDelete, icCardDuplication, icCardPaste, icNodeBottom } from '@assets';
import { Button, IPopperItem, Popper } from '@components';
import { AnswerNode } from '@components/pages/scenario/nodes/AnswerNode';
import { BasicCardCarouselNode } from '@components/pages/scenario/nodes/BasicCardCarouselNode';
import { BasicCardNode } from '@components/pages/scenario/nodes/BasicCardNode';
import { ConditionNode } from '@components/pages/scenario/nodes/ConditionNode';
import { CountNode } from '@components/pages/scenario/nodes/CountNode';
import { IntentNode } from '@components/pages/scenario/nodes/IntentNode';
import { ParameterSetNode } from '@components/pages/scenario/nodes/ParameterSetNode';
import { TextNode } from '@components/pages/scenario/nodes/TextNode';
import { useRootState } from '@hooks';
import { useUpdateLines } from '@hooks/useUpdateLines';
import { IArrow, INode } from '@models';
import { NodeKind } from '@models/enum/NodeKind';
import {
  IAnswerView,
  IBasicCardCarouselView,
  IBasicCardView,
  IConditionView,
  ITextView,
} from '@models/interfaces/res/IGetFlowRes';
import { setGuideStartNode } from '@store/botbuilderSlice';
import { removeItem } from '@store/makingNode';
import classNames from 'classnames';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { IHasChildren } from 'src/models/interfaces/IHasChildren';
import { IHasClassNameNStyle } from 'src/models/interfaces/IHasStyle';
import { SizeType } from 'src/models/types/SizeType';

import useI18n from '../../hooks/useI18n';
import {
  IAnswerNode,
  IBasicCardNode,
  IConditionNode,
  ICountNode,
  IListCardNode,
  IOtherFlowRedirectNode,
  IProductCardNode,
  NODE_TYPES,
} from '../../models/interfaces/ICard';
import {
  BasicCard,
  CommerceCard,
  Condition,
  Count,
  ListCard,
  OtherFlowRedirectCard,
  ParameterSet,
  QuickReply,
} from '../pages/scenario/cards';
import { NextNodeButton } from './NextNodeButton';

export interface INodeProps extends IHasChildren, IHasClassNameNStyle {
  id?: string;
  typeName: string;
  nodekind: NodeKind;
  title?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
  active?: boolean;
  radius?: SizeType;
  cards?:
    | IBasicCardNode[]
    | IProductCardNode[]
    | IListCardNode[]
    | IAnswerNode[]
    | IConditionNode[]
    | ICountNode[]
    | IOtherFlowRedirectNode[];
  node: INode;
  onClick?: (e?: any) => void;
  addArrow?: (arrow: IArrow) => void;
  ref?: React.RefObject<HTMLDivElement | null>[];
}

export const Node: FC<INodeProps> = ({
  id,
  typeName,
  nodekind,
  cards,
  node,
  className,
  style,
  title,
  bordered = true,
  hoverable,
  active,
  radius = 'small',
  onClick,
  addArrow,
}) => {
  const dispatch = useDispatch();
  const scale = useRootState((state) => state.botBuilderReducer.scale);
  const { updateLine } = useUpdateLines();
  const wrapClass = classNames(className, 'luna-node', {
    'luna-node-bordered': bordered,
    'luna-node-hoverble': hoverable,
    [`border-radious-${radius}`]: radius !== 'none',
    'luna-node-active': active,
  });

  const titleClass = classNames('luna-node-head');
  const bodyClass = classNames('luna-node-body');

  const handleDuplicationCard = () => {
    console.log('handle duplication');
  };

  const handlePasteCard = () => {
    console.log('handle Paste');
  };

  const handleDeleteCard = () => {
    console.log('handle delete card');
    dispatch(removeItem(id));
  };

  const handleBottomDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.isTrusted) {
      const guide = document.querySelector<HTMLDivElement>('#icGuide');

      if (guide) {
        const canvas = document.querySelector<HTMLDivElement>('.canvasWrapper');
        const cr = canvas?.getBoundingClientRect() || new DOMRect();
        const newPosition = {
          x: e.clientX / scale - cr.x - 11,
          y: e.clientY / scale - cr.y - 12,
        };
        guide.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
      }
      updateLine(`node-${id}`);
    }
  };

  const nodeMenu: IPopperItem<{ action: () => void }>[] = [
    {
      id: 'duplication',
      name: 'Duplication',
      type: 'icon-front',
      icon: icCardDuplication,
      data: {
        action: handleDuplicationCard,
      },
    },
    {
      id: 'paste',
      name: 'To Paste',
      type: 'icon-front',
      icon: icCardPaste,
      data: {
        action: handlePasteCard,
      },
    },
    {
      id: 'delete',
      name: 'Delete',
      type: 'icon-front',
      icon: icCardDelete,
      data: {
        action: handleDeleteCard,
      },
    },
  ];

  const handleShowingNodesWithoutCards = () => {
    console.log(node);
    switch (typeName) {
      case NODE_TYPES.INTENT_NODE:
        return <IntentNode id={id} />;
      case NODE_TYPES.CONDITION_NODE:
        return <ConditionNode nodeId={`node-${id}`} node={node} />;
      case NODE_TYPES.COUNT:
        return <CountNode nodeId={`node-${id}`} />;
      case NODE_TYPES.PARAMETER_SET_NODE:
        return <ParameterSetNode node={node} />;
      case NODE_TYPES.JSON_REQUEST_NODE:
        return (
          <div className="command-node">
            <NextNodeButton ctrlId={`${id}`} nodeId={`node-${id}`} type="blue" />
          </div>
        );
      case NODE_TYPES.OTHER_FLOW_REDIRECT_NODE:
        return <OtherFlowRedirectCard />;
      case NODE_TYPES.ANSWER_NODE:
        return <AnswerNode nodeId={`node-${id}`} node={node} />;
      case NODE_TYPES.TEXT_NODE:
        return <TextNode node={node} />;
      case NODE_TYPES.BASIC_CARD_NODE:
        return <BasicCardNode node={node} />;
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
        return <BasicCardCarouselNode node={node} />;
      default:
        return handleShowingCards();
    }
  };

  const handleShowingCards = () => {
    if (node.type === NODE_TYPES.TEXT_NODE) {
      const view = node.view as ITextView;

      if (view) {
        const textCards: IBasicCardNode[] = [
          { type: NODE_TYPES.TEXT_NODE, description: view.text },
        ];
        return <BasicCard cards={textCards} nodeId={`node-${id}`} />;
      }
    }

    if (node.type === NODE_TYPES.BASIC_CARD_CAROUSEL_NODE) {
      const view = node.view as IBasicCardCarouselView;
      const basicCards: IBasicCardNode[] = view.childrenViews.map((x) => {
        return {
          type: NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
          title: x.title || '',
          thumbnail: x.imageCtrl
            ? {
                imageUrl: x.imageCtrl?.imageUrl,
              }
            : undefined,
          buttons: x.buttons?.map((b) => {
            return {
              id: b.id,
              label: b.label,
              actionValue: b.actionValue,
              action: b.actionType as 'linkWebUrl',
            };
          }),
        };
      });

      return <BasicCard cards={basicCards} nodeId={`node-${id}`} isCarousel />;
    }

    if (node.type === NODE_TYPES.BASIC_CARD_NODE) {
      const view = node.view as IBasicCardView;
      const basicCards: IBasicCardNode[] = [
        {
          type: NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
          title: view.title,
          description: view.description,
          thumbnail: view.imageCtrl
            ? {
                imageUrl: view.imageCtrl.imageUrl,
              }
            : undefined,
          buttons: view.buttons?.map((b) => {
            return {
              id: b.id,
              label: b.label,
              actionValue: b.actionValue,
              action: b.actionType as 'linkWebUrl',
            };
          }),
        },
      ];

      return <BasicCard cards={basicCards} nodeId={`node-${id}`} />;
    }

    if (!cards) {
      return <div></div>;
    }

    switch (typeName) {
      //case NODE_TYPES.TEXT_NODE:
      case NODE_TYPES.IMAGE_NODE:
      case NODE_TYPES.BASIC_CARD_NODE:
      case NODE_TYPES.BASIC_CARD_CAROUSEL_NODE:
      case NODE_TYPES.BASIC_CARD_CAROUSEL_TEMPLATE_NODE:
        return <BasicCard cards={cards as IBasicCardNode[]} nodeId={`node-${id}`} />;

      case NODE_TYPES.LIST_CARD_NODE:
      case NODE_TYPES.LIST_CAROUSEL:
        return <ListCard cards={cards as IListCardNode[]} nodeId={`node-${id}`} />;

      case NODE_TYPES.PRODUCT_CARD_NODE:
      case NODE_TYPES.PRODUCT_CARD_TEMPLATE_NODE:
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE:
      case NODE_TYPES.PRODUCT_CARD_CAROUSEL_TEMPLATE_NODE:
        return <CommerceCard cards={cards as IProductCardNode[]} nodeId={`node-${id}`} />;
      // case NODE_TYPES.ANSWER_NODE:
      //   return (
      //     <QuickReply
      //       cards={cards as IAnswerNode[]}
      //       nodeId={`node-${id}`}
      //       cardId={+`${id}`}
      //     />
      //   );

      // case NODE_TYPES.CONDITION_NODE:
      //   return <Condition nodeId={`node-${id}`} node={node} />;

      // case NODE_TYPES.COUNT:
      //   return <Count cards={cards as ICountNode[]} nodeId={`node-${id}`} />;

      // case NODE_TYPES.PARAMETER_SET_NODE:
      //   return <ParameterSet id={id} values={node} />;
    }

    return <div></div>;
  };

  const HandleNodeSelect = async (e: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(e);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.stopPropagation();
        e.preventDefault();
        const from = e.dataTransfer.getData('id');
        if (!from || id === from) {
          return;
        }

        const nodeId = e.dataTransfer.getData('nodeId');
        const isNext = e.dataTransfer.getData('isNext');
        const pointType = e.dataTransfer.getData('pointType');

        addArrow?.({
          start: from,
          end: `node-${id}`,
          updateKey: nodeId,
          isNextNode: isNext === '1',
          type: pointType as 'blue',
        });
      }}
      id={`node-${id}`}
      className={wrapClass}
      style={style}
      role="presentation"
      onClick={HandleNodeSelect}
      onMouseUp={(e) => e.stopPropagation()}
    >
      <div className={titleClass}>
        {title ? <p>{title}</p> : undefined}
        <Popper
          placement="right-start"
          // offset={[-10, 15]}
          popup
          popupList
          popperItems={nodeMenu}
          onChange={(m) => {
            m.data?.action?.();
          }}
        >
          <i className="fa-solid fa-ellipsis-vertical" />
        </Popper>
      </div>
      <div className={bodyClass}>{handleShowingNodesWithoutCards()}</div>
      {nodekind === NodeKind.InputNode && (
        <Button shape="ghost" className="icNodeBottom">
          <div
            id={`node-bottom-${id}`}
            role="presentation"
            className="node-draggable-ignore"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('id', `node-${id}`);
              e.dataTransfer.setData('pointType', 'blue');
              dispatch(
                setGuideStartNode({ startId: `node-${id}`, isNext: false, type: 'blue' }),
              );
            }}
            onDragEnd={() => {
              dispatch(setGuideStartNode());
            }}
            onDrag={handleBottomDrag}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <img src={icNodeBottom} alt="icNodeBottom" />
          </div>
        </Button>
      )}
    </div>
  );
};
