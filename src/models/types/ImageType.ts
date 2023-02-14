import { ValueOf } from '@models';

export const IMAGE_CTRL_TYPES = {
  IMAGE_CTRL: 'ImageCtrl',
  LIST_ITEM_IMAGE_CTRL: 'ListItemImageCtrl',
  CAROUSEL_IMAGE_CTRL: 'CarouselImageCtrl',
  LIST_CAROUSEL_ITEM_IMAGE_CTRL: 'ListCarouselItemImageCtrl',
};

export type TImageTypes = ValueOf<typeof IMAGE_CTRL_TYPES>;
