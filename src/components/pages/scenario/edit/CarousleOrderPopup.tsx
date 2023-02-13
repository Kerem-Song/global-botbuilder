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
import { FC } from 'react';
import { useForm } from 'react-hook-form';
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
  const { t } = usePage();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const onSubmit = async (data: any) => {
    await handleSave(data);
  };

  const handleClose = () => {
    handleIsOpen(false);
  };

  const dispatch = useDispatch();

  const HandleAddCarousel = () => {
    const type = nodeView.typeName;

    const view = node.view as
      | IBasicCardCarouselView
      | IListCardCarouselView
      | IProductCardCarouselView;

    const defaultView = () => {
      switch (type) {
        case 'BasicCardCarouselView':
          return nodeHelper.createDefaultBasicCardView();
        case 'ListCardCarouselView':
          return nodeHelper.createDefaultListCardView();
        case 'ProductCardCarouselView':
          return nodeHelper.createCommerceCarouselView();
        default:
          return nodeHelper.createDefaultBasicCardView();
      }
    };
    const childrenViews: IHasChildrenView['childrenViews'] = [
      ...view.childrenViews,
      defaultView(),
      // defaultView(),
    ];
    const upNode = {
      ...node,
      view: { ...view, childrenViews } as
        | IBasicCardCarouselView
        | IListCardCarouselView
        | IProductCardCarouselView,
    };

    dispatch(updateNode(upNode));
    // switch (type) {
    //   case VIEW_TYPES.BASIC_CARD_CAROUSEL_VIEW:
    //     return () => {
    //       const view = node.view as IBasicCardCarouselView;
    //       const childrenViews: IBasicCardView[] = [
    //         ...view.childrenViews,
    //         nodeHelper.createDefaultBasicCardView(),
    //       ];
    //       const upNode = {
    //         ...node,
    //         view: { ...view, childrenViews } as IBasicCardCarouselView,
    //       };

    //       dispatch(updateNode(upNode));
    //     };

    // case VIEW_TYPES.LIST_CARD_CAROUSEL_VIEW:
    //   return () => {
    //     const view = node.view as IListCardCarouselView;
    //     const childrenViews: IListCardView[] = [
    //       ...view.childrenViews,
    //       nodeHelper.createDefaultListCardView(),
    //     ];
    //     const upNode = {
    //       ...node,
    //       view: { ...view, childrenViews } as IListCardCarouselView,
    //     };

    //     dispatch(updateNode(upNode));
    //   };

    // case VIEW_TYPES.PRODUCT_CARD_CAROUSEL_VIEW:
    //   return () => {
    //     const view = node.view as IProductCardCarouselView;
    //     const childrenViews: IProductCardView[] = [
    //       ...view.childrenViews,
    //       nodeHelper.createCommerceView(),
    //     ];
    //     const upNode = {
    //       ...node,
    //       view: { ...view, childrenViews } as IProductCardCarouselView,
    //     };

    //     dispatch(updateNode(upNode));
    //   };
    // }
  };

  console.log('nodeView', nodeView);
  console.log('node', node);

  const carouselType = 'List';
  const carouselName = ' Carousel Name 02';

  // useEffect(() => {
  //   console.log('life cycle');
  // }, [HandleAddCarousel]);
  return (
    <ReactModal
      isOpen={isOpen}
      className="carouselOrderPopupWrapper node-draggable-ignore"
    >
      <div onWheel={(e) => e.stopPropagation()}>
        <Row justify="space-between" align="center" className="titleWrapper">
          <Col>
            <p className="carouselTitle">{node.type}</p>
          </Col>
          <Col>
            <Button shape="ghost" onClick={handleClose} className="closeBtn">
              <img src={icClosed} alt="icClosed" />
            </Button>
          </Col>
        </Row>

        <Divider />
        <div className="carouselWrapper">
          <p className="carouselName">{node.title}</p>
          <Row justify="space-between" align="center">
            <Col className="warning">
              <p>{t('CAROUSEL_WARNING_FIRST')}</p>
              <p>{t('CAROUSEL_WARNING_SECOND')}</p>
            </Col>
            <Col className="buttonWrapper">
              {nodeView.childrenViews?.length < 10 && (
                <Button
                  shape="ghost"
                  className="carouselBtn add"
                  onClick={() => HandleAddCarousel()}
                >
                  + {t('ADD_CAHTBUBBLE_BTN')}
                </Button>
              )}
              <Button shape="ghost" className="carouselBtn confirm">
                {t('CONFIRM_CAROUSEL_POPUP')}
              </Button>
            </Col>
          </Row>
          <div>
            <SoratbleCarouselCtrlContainer nodeId={nodeId} nodeView={nodeView} />
          </div>
        </div>
      </div>
    </ReactModal>
  );
};
