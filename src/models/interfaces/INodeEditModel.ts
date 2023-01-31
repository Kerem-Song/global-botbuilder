import * as yup from 'yup';

import {
  IButtonType,
  ISortableListItem,
  IThumbnailType,
  Profile,
  TNodeTypes,
} from './ICard';
import { IScenarioModel } from './IScenarioModel';
import { IViewBase } from './res/IGetFlowRes';

export interface IGNodeEditModel<T extends IViewBase> {
  id: string;
  caption: string;
  title: string;
  view?: T;
}
export interface INodeEditModel {
  id: string;
  nodeType: TNodeTypes;
  caption: string;
  title: string;
  view?: IViewBase;
}

export interface ITextViewModel {
  text?: string;
}

export interface IBasicCardViewModel {
  title?: string;
  description?: string;
  buttons?: IButtonType[];
}

export interface IListCardViewModel {
  allowHeadImgField: boolean;
  header?: {
    title?: string;
  };
  items?: ISortableListItem[];
  buttons?: IButtonType[];
}

export interface IProductCardViewModel {
  productName?: string;
  price?: number;
  currency?: string;
  discount?: number;
  discountRate?: number;
  discountPrice?: number;
  thumbnail?: IThumbnailType;
  profile?: Profile;
  buttons?: IButtonType[];
}

export interface IAnswerViewModel {
  allowRes: boolean;
  extra?: Record<string, any>;
  label?: string;
  action?:
    | 'linkWebUrl'
    | 'message'
    | 'block'
    | 'phone'
    | 'operator'
    | 'osLink'
    | 'addChannel';
  connectedScenario?: IScenarioModel;
  messageText?: string;
  url?: string;
}
const FILE_SIZE = 160 * 1024;

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

export const textNodeEditSchema = yup.object().shape({
  text: yup
    .string()
    .trim()
    .max(1000, '1,000자 이상 입력하실 수 없습니다.')
    .required('필수 입력 항목입니다.'),
});

export const basicCardNodeEditSchema = yup.object().shape({
  title: yup.string().nullable().trim().max(20, '20자 이상 입력하실 수 없습니다.'),
  description: yup
    .string()
    .max(230, '230자 이상 입력하실 수 없습니다.')
    .required('필수 입력 항목입니다.'),
  // imageCtrl: yup
  //   .mixed()
  //   .test('fileSize', 'File too large', (value) => value && value.size <= FILE_SIZE)
  //   .test(
  //     'fileFormat',
  //     'Unsupported Format',
  //     (value) => value && SUPPORTED_FORMATS.includes(value.type),
  //   ),
  imageCtrol: yup.object().shape({
    imageUrl: yup.string().matches(/^(http(s?)):\/\//i),
  }),
  imageUrl: yup.string().matches(/^(http(s?)):\/\//i),
  buttons: yup.array().of(
    yup.object().shape({
      label: yup.string().required('필수 입력 항목입니다.'),
    }),
  ),
});

export const listCardNodeEditSchema = yup.object().shape({
  header: yup.string().trim().max(15, '15자를 초과할 수 없습니다.'),
  imageCtrl: yup.object().shape({
    // imageUrl: yup
    //   .mixed()
    //   .required()
    //   .test('fileSize', 'File too large', (value) => value && value.size <= FILE_SIZE)
    //   .test(
    //     'fileFormat',
    //     'Unsupported Format',
    //     (value) => value && SUPPORTED_FORMATS.includes(value.type),
    //   ),
    // imageUrl: yup.string().trim().required(),
    imageUrl: yup.string().matches(/^(http(s?)):\/\//i),
    actionType: yup.string().required(),
    actionValue: yup.string().required(),
  }),

  items: yup.array().of(
    yup.object().shape({
      title: yup.string().trim().max(36, '36자를 초과할 수 없습니다.').required(),
      description: yup.string().max(16, '16자를 초과할 수 없습니다.'),
      // imageUrl: yup
      //   .mixed()
      //   .required()
      //   .test('fileSize', 'File too large', (value) => value && value.size <= FILE_SIZE)
      //   .test(
      //     'fileFormat',
      //     'Unsupported Format',
      //     (value) => value && SUPPORTED_FORMATS.includes(value.type),
      //   ),
      imageUrl: yup.string().matches(/^(http(s?)):\/\//i),
    }),
  ),
  buttons: yup.array().of(
    yup.object().shape({
      label: yup.string().trim().required('필수 입력 항목입니다.'),
      actionType: yup.string().required('필수 입력 항목입니다.'),
    }),
  ),
});

export const conditionNodeEditSchema = yup.object().shape({
  items: yup.array().of(
    yup.object().shape({
      op1: yup.string().trim().required(`필수 입력 항목입니다.`),
      op2: yup.string().trim().required(`필수 입력 항목입니다.`),
      operator: yup.number().required(`필수 입력 항목입니다.`),
    }),
  ),
});
