import * as yup from 'yup';

import { TNodeTypes } from './ICard';
import { ACTION_TYPES, IProductCardView, IViewBase } from './res/IGetFlowRes';

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

const FILE_SIZE = 2 * 1024; //2mb제한

const SUPPORTED_FORMATS = ['image/jpg', 'image/png']; //jpb, png가능(Line 기준)

export const textNodeEditSchema = yup.object().shape({
  text: yup
    .string()
    .trim()
    .max(1000, '1,000자 이상 입력하실 수 없습니다.')
    .required('필수 입력 항목입니다.'),
});

export const buttonsEditSchema = yup
  .array()
  .max(3, '버튼은 3개까지만 가능합니다.')
  .of(
    yup.object().shape({
      label: yup.string().trim().required('필수 입력 항목입니다.'),
      actionValue: yup.string().when('actionType', {
        is: ACTION_TYPES.URL,
        then: yup
          .string()
          .url('http, https 형식으로 입력해 주세요')
          .required('필수 입력 항목입니다.'),
      }),
    }),
  );
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
    imageUrl: yup.string().url(),
  }),
  imageUrl: yup.string().url(),
  buttons: buttonsEditSchema,
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
    imageUrl: yup.string().url(),
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
      imageUrl: yup.string().url(),
    }),
  ),
  buttons: buttonsEditSchema,
});

export const productCardNodeEditSchema = yup.object().shape({
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
    imageUrl: yup.string().url(),
    actionType: yup.string().required(),
    actionValue: yup.string().required(),
  }),
  profileIconUrl: yup.string().url(),
  profileName: yup
    .string()
    .trim()
    .max(15, '15자를 초과할 수 없습니다.')
    .required(`필수 입력 항목입니다.`),
  description: yup.string().trim().required(`필수 입력 항목입니다.`),
  retailPrice: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .typeError('숫자만 입력하실 수 있습니다.')
    .required(`필수 입력 항목입니다.`),
  salePrice: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    })
    .typeError('숫자만 입력하실 수 있습니다.')
    .required(`필수 입력 항목입니다.`),
  currencyUnit: yup.mixed().oneOf(['USD', 'KRW', 'JPY']),
  buttons: buttonsEditSchema,
});

export const conditionNodeEditSchema = yup.object().shape({
  items: yup.array().of(
    yup.object().shape({
      op1: yup.string().trim().required(`필수 입력 항목입니다.`),
      op2: yup.string().trim().required(`필수 입력 항목입니다.`),
    }),
  ),
});
