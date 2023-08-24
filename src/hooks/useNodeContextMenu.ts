import { icCardCut, icCardDelete, icCardDuplication, icEditCarousel } from '@assets';
import { IPopperItem } from '@components';
import { useI18n, useRootState } from '@hooks';
import { INode, NODE_TYPES, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';
import { nodeHelper } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import {
  setClipBoard,
  setEditDrawerToggle,
  setIsHandleCutCard,
  setSelected,
} from '@store/botbuilderSlice';
import { appendNode, removeItem } from '@store/makingNode';
import { useDispatch } from 'react-redux';

import usePage from './usePage';

export const useNodeContextMenu = ({
  handleIsOpen,
  handleIsOpenUtterancePopup,
}: {
  handleIsOpen: (value: boolean) => void;
  handleIsOpenUtterancePopup: (value: boolean) => void;
}) => {
  const { t, tc } = usePage();
  const dispatch = useDispatch();
  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const clipBoard = useRootState((state) => state.botBuilderReducer.clipBoard);
  const isHandleCutCard = useRootState(
    (state) => state.botBuilderReducer.isHandleCutCard,
  );
  const handleDuplicationCard = (node: INode) => {
    dispatch(setClipBoard(node));
  };

  const handleCutCard = (node: INode) => {
    if (node.type === NODE_TYPES.INTENT_NODE) {
      return;
    }

    dispatch(setIsHandleCutCard(true));
    dispatch(setClipBoard(node));
    dispatch(removeItem(node.id));
    dispatch(setSelected());
  };

  const handlePasteCard = ({ x, y }: { x: number; y: number }) => {
    if (clipBoard) {
      const clone = nodeHelper.cloneNode(clipBoard);

      const filtered = nodes.filter((node) => {
        return node.title?.includes(clone.title!);
      });

      let index = 1;

      if (filtered) {
        const regex = /[^0-9]/g;
        const results =
          filtered?.map((x) => {
            return Number(x.title?.replace(clone.title!, '').replace(regex, ''));
          }) || [];

        for (const i of results) {
          if (!results.includes(i + 1)) {
            index = Number(i + 1);
            break;
          }
        }
      }

      dispatch(
        appendNode({
          ...clone,
          x: x,
          y: y,
          title: isHandleCutCard ? clone.title : clone.title + `_(${index})`,
        }),
      );
      dispatch(setClipBoard(undefined));
      dispatch(setIsHandleCutCard(false));
    }
  };

  const handleDeleteCard = (node: INode) => {
    deleteCard(node);
  };

  const deleteCard = (node: INode) => {
    if (node.type === NODE_TYPES.INTENT_NODE) {
      return;
    }
    dispatch(removeItem(node.id));
    dispatch(setSelected());
    lunaToast.success(tc('DELETE_MESSAGE'));
  };

  const handleChangeCarouselOrder = () => {
    dispatch(setEditDrawerToggle(false));
    handleIsOpen(true);
  };

  const handleUtterancePopup = () => {
    if (handleIsOpenUtterancePopup) {
      handleIsOpenUtterancePopup(true);
    }
  };

  const nodeMenu: IPopperItem<{
    kind: NodeContextMenuKind;
    action: (node: INode) => void;
  }>[] = [
    {
      id: 'duplication',
      name: t('DUPLICATION'),
      type: 'icon-front',
      icon: icCardDuplication,
      data: {
        kind: NodeContextMenuKind.Duplication,
        action: handleDuplicationCard,
      },
    },
    {
      id: 'cut',
      name: t('CUT'),
      type: 'icon-front',
      icon: icCardCut,
      data: {
        kind: NodeContextMenuKind.Cut,
        action: handleCutCard,
      },
    },
    {
      id: 'delete',
      name: t('DELETE'),
      type: 'icon-front',
      icon: icCardDelete,
      data: {
        kind: NodeContextMenuKind.Delete,
        action: handleDeleteCard,
      },
    },
    {
      id: 'carousel',
      name: t('CAROUSEL_SETTING'),
      type: 'icon-front',
      icon: icEditCarousel,
      data: {
        kind: NodeContextMenuKind.Carousel,
        action: handleChangeCarouselOrder,
      },
    },
    {
      id: 'utterance',
      name: t('UTTERANCE'),
      type: 'icon-front',
      icon: icEditCarousel,
      data: {
        kind: NodeContextMenuKind.Utterance,
        action: handleUtterancePopup,
      },
    },
  ];

  const getNodeMenu = (typeName: TNodeTypes) => {
    const menuKinds = nodeFactory.getFactory(typeName)?.NodeContextMenuKinds;

    if (!menuKinds) {
      return [];
    }

    const result = nodeMenu.filter(
      (x) => x.data && (x.data.kind & menuKinds) === x.data.kind,
    );
    // console.log(typeName, result);
    return result;
  };
  return {
    handleDuplicationCard,
    handleCutCard,
    handlePasteCard,
    deleteCard,
    getNodeMenu,
    nodeMenu,
    handleUtterancePopup,
  };
};
