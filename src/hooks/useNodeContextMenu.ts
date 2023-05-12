import { icCardCut, icCardDelete, icCardDuplication, icEditCarousel } from '@assets';
import { IPopperItem } from '@components';
import { INode, NODE_TYPES, TNodeTypes } from '@models';
import { NodeContextMenuKind } from '@models/enum/NodeContextMenuKind';
import { nodeFactory } from '@models/nodeFactory/NodeFactory';
import { lunaToast } from '@modules/lunaToast';
import { setClipBoard, setEditDrawerToggle, setSelected } from '@store/botbuilderSlice';
import { removeItem } from '@store/makingNode';
import { useDispatch } from 'react-redux';

import usePage from './usePage';

export const useNodeContextMenu = ({
  handleIsOpen,
}: {
  handleIsOpen: (value: boolean) => void;
}) => {
  const { tc } = usePage();
  const dispatch = useDispatch();

  const handleDuplicationCard = (node: INode) => {
    dispatch(setClipBoard(node));
  };

  const handleCutCard = (node: INode) => {
    if (node.type === NODE_TYPES.INTENT_NODE) {
      return;
    }
    dispatch(setClipBoard(node));
    dispatch(removeItem(node.id));
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

  const nodeMenu: IPopperItem<{
    kind: NodeContextMenuKind;
    action: (node: INode) => void;
  }>[] = [
    {
      id: 'duplication',
      name: 'Duplication',
      type: 'icon-front',
      icon: icCardDuplication,
      data: {
        kind: NodeContextMenuKind.Duplication,
        action: handleDuplicationCard,
      },
    },
    {
      id: 'cut',
      name: 'Cut',
      type: 'icon-front',
      icon: icCardCut,
      data: {
        kind: NodeContextMenuKind.Cut,
        action: handleCutCard,
      },
    },
    {
      id: 'delete',
      name: 'Delete',
      type: 'icon-front',
      icon: icCardDelete,
      data: {
        kind: NodeContextMenuKind.Delete,
        action: handleDeleteCard,
      },
    },
    {
      id: 'carousel',
      name: 'Carousel',
      type: 'icon-front',
      icon: icEditCarousel,
      data: {
        kind: NodeContextMenuKind.Carousel,
        action: handleChangeCarouselOrder,
      },
    },
    {
      id: 'utterance',
      name: 'Utterance',
      type: 'icon-front',
      icon: icEditCarousel,
      data: {
        kind: NodeContextMenuKind.Utterance,
        action: () => null,
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
  return { handleDuplicationCard, handleCutCard, deleteCard, getNodeMenu, nodeMenu };
};
