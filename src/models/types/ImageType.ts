import { ValueOf } from '@models';

export const IMAGE_CTRL_TYPES = {
  IMAGE_CTRL: 'ImageCtrl',
  CAROUSEL_IMAGE_CTRL: 'CarouselImageCtrl',
  LIST_ITEM_IMAGE_CTRL: 'ListItemImageCtrl',
};

export type TImageTypes = ValueOf<typeof IMAGE_CTRL_TYPES>;
