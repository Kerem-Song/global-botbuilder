import { icClosed } from '@assets';
import { Button, Col, Divider, Row } from '@components';
import { SoratbleCarouselCtrlContainer } from '@components/data-display/SortableCarouselCtrlContainer';
import { usePage, useSystemModal } from '@hooks';
import { INode, INodeEditModel } from '@models';
import {
  IBasicCardCarouselView,
  IHasChildrenView,
  IListCardCarouselView,
  IProductCardCarouselView,
} from '@models/interfaces/res/IGetFlowRes';
import { NODE_PREFIX } from '@modules';
import { lunaToast } from '@modules/lunaToast';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { setCarouselIndex } from '@store/botbuilderSlice';
import { editNode } from '@store/makingNode';
import { FC, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';

export const CarouselOrderPopup: FC<{
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
  handleSave: (model: any) => void;
  nodeId: string;
  nodeView: IHasChildrenView;
  node: INode;
}> = ({ isOpen, handleIsOpen, handleSave, nodeId, nodeView, node }) => {
  const [carouselNode, setCarouselNode] = useState<IHasChildrenView['childrenViews']>([]);
  const [closeOnEsc, setCloseOnEsc] = useState<boolean>(true);
  const { t, tc } = usePage();
  const dispatch = useDispatch();
  const { confirm } = useSystemModal();

  useEffect(() => {
    setCarouselNode(nodeView.childrenViews || []);
  }, [nodeView.childrenViews]);

  const handleClose = async () => {
    if (nodeView.childrenViews !== carouselNode) {
      setCloseOnEsc(false);
      const checkSaving = await confirm({
        title: t(`CAROUSEL_POPUP_SAVE_SYSTEM_ALERT_TITLE`),
        description: t(`CAROUSEL_POPUP_SAVE_SYSTEM_ALERT_DESCRIPTION`),
      });
      if (checkSaving) {
        setCarouselNode(nodeView.childrenViews);
        handleIsOpen(false);
        setCloseOnEsc(true);
      } else {
        handleIsOpen(true);
        setCloseOnEsc(true);
      }
    } else {
      handleIsOpen(false);
    }
  };

  const defaultView = (type: string) => {
    const useImageCtrl = nodeView.useImageCtrl;
    const aspectRatio = nodeView.childrenViews[0].imageCtrl?.aspectRatio;
    switch (type) {
      case 'BasicCardCarouselView':
        return nodeDefaultHelper.createDefaultBasicCardView(useImageCtrl, aspectRatio);
      case 'ListCardCarouselView':
        return nodeDefaultHelper.createDefaultListCardView(useImageCtrl, aspectRatio);
      case 'ProductCardCarouselView':
        return nodeDefaultHelper.createDefaultCommerceView(useImageCtrl, aspectRatio);
      default:
        return nodeDefaultHelper.createDefaultBasicCardView(useImageCtrl, aspectRatio);
    }
  };

  const HandleAddCarousel = () => {
    const type = nodeView.typeName;
    setCarouselNode([...carouselNode, defaultView(type)]);
  };

  const handleConfirm = () => {
    const view = node.view as
      | IBasicCardCarouselView
      | IListCardCarouselView
      | IProductCardCarouselView;

    const upNode = {
      ...node,
      view: { ...view, childrenViews: carouselNode },
    };

    const editedNode: INodeEditModel = {
      ...upNode,
      title: node.title || '',
      caption: t(`CAPTION_${node.type.toUpperCase()}`),
      nextNodeId: node.nextNodeId,
    };

    dispatch(editNode(editedNode));

    dispatch(
      setCarouselIndex({
        id: `${NODE_PREFIX}${upNode.id}`,
        index: upNode.view?.childrenViews?.length - 1,
      }),
    );
    handleIsOpen(false);

    lunaToast.success(tc(`ACCEPTED`));
  };

  return (
    <ReactModal
      isOpen={isOpen}
      className="carouselOrderPopupWrapper node-draggable-ignore"
      overlayClassName="carouselPopupOverlay"
      shouldCloseOnEsc={closeOnEsc}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={false}
    >
      <div
        onWheel={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <Row justify="space-between" align="center" className="titleWrapper">
          <Col>
            <p className="carouselTitle">{node.title}</p>
          </Col>
          <Col>
            <Button shape="ghost" onClick={handleClose} className="closeBtn">
              <img src={icClosed} alt="icClosed" />
            </Button>
          </Col>
        </Row>

        <Divider />
        <div className="carouselWrapper">
          <Row justify="space-between" align="center" className="warningRow">
            <Col className="warning">
              <p>{t('CAROUSEL_WARNING_FIRST')}</p>
              <p>{t('CAROUSEL_WARNING_SECOND')}</p>
            </Col>
            <Col className="buttonWrapper">
              <Button
                shape="ghost"
                className="carouselBtn add"
                onClick={HandleAddCarousel}
                disabled={carouselNode?.length >= 10}
              >
                + {t('ADD_CAHTBUBBLE_BTN')}
              </Button>

              <Button
                shape="ghost"
                className="carouselBtn confirm"
                onClick={handleConfirm}
                disabled={nodeView.childrenViews === carouselNode}
              >
                {t('CONFIRM_CAROUSEL_POPUP')}
              </Button>
            </Col>
          </Row>
          <div>
            <SoratbleCarouselCtrlContainer
              nodeId={nodeId}
              nodeView={nodeView}
              carouselNode={carouselNode}
              setCarouselNode={setCarouselNode}
            />
          </div>
        </div>
      </div>
    </ReactModal>
  );
};
