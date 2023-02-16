import { icClosed } from '@assets';
import { SoratbleCarouselCtrlContainer } from '@components/data-display/SortableCarouselCtrlContainer';
import { Button } from '@components/general';
import { Col, Divider, Row } from '@components/layout';
import { usePage } from '@hooks';
import { INode } from '@models';
import {
  IBasicCardCarouselView,
  IHasChildrenView,
  IListCardCarouselView,
  IProductCardCarouselView,
} from '@models/interfaces/res/IGetFlowRes';
import { nodeHelper } from '@modules';
import { updateNode } from '@store/makingNode';
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
  const { t } = usePage();
  const dispatch = useDispatch();

  useEffect(() => {
    setCarouselNode(nodeView.childrenViews || []);
  }, [nodeView.childrenViews]);

  const handleClose = () => {
    handleIsOpen(false);
  };

  const defaultView = (type: string) => {
    switch (type) {
      case 'BasicCardCarouselView':
        return nodeHelper.createDefaultBasicCardView();
      case 'ListCardCarouselView':
        return nodeHelper.createDefaultListCardView();
      case 'ProductCardCarouselView':
        return nodeHelper.createCommerceView();
      default:
        return nodeHelper.createDefaultBasicCardView();
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

    dispatch(updateNode(upNode));
    handleIsOpen(false);
  };

  // console.log('nodeView', nodeView);
  // console.log('node', node);

  return (
    <ReactModal
      isOpen={isOpen}
      className="carouselOrderPopupWrapper node-draggable-ignore"
    >
      <div onWheel={(e) => e.stopPropagation()}>
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
              {nodeView.childrenViews?.length < 10 && (
                <Button
                  shape="ghost"
                  className="carouselBtn add"
                  onClick={HandleAddCarousel}
                >
                  + {t('ADD_CAHTBUBBLE_BTN')}
                </Button>
              )}
              <Button
                shape="ghost"
                className="carouselBtn confirm"
                onClick={handleConfirm}
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
