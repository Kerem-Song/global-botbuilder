import { usePage } from '@hooks';
import { NODE_TYPES } from '@models';
import { ACTION_TYPES } from '@models/interfaces/res/IGetFlowRes';
import * as yup from 'yup';

const checkNextNodeIdTypes: string[] = [NODE_TYPES.PARAMETER_SET_NODE];

export const useYupValidation = () => {
  const { t } = usePage();

  const FILE_SIZE = 2 * 1024 * 1024; //2mb제한

  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']; //jpg, png가능(Line 기준)

  const textNodeEditSchema = yup.object().shape({
    text: yup
      .string()
      .trim()
      .max(1000, t(`VALIDATION_STRING_LIMIT_1000`))
      .required(t(`VALIDATION_REQUIRED`)),
  });

  const buttonsEditSchema = yup
    .array()
    .max(3, t(`VALIDATION_BUTTON_MAX`))
    .of(
      yup.object().shape({
        label: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
        actionValue: yup
          .string()
          .when('actionType', {
            is: ACTION_TYPES.URL,
            then: yup
              .string()
              .url(t(`VALIDATION_URL`))
              .required(t(`VALIDATION_REQUIRED`)),
          })
          .when('actionType', {
            is: ACTION_TYPES.LUNA_NODE_REDIRECT,
            then: yup.string().required(t(`VALIDATION_REQUIRED`)),
          }),
      }),
    );

  const imageFileEditSchema = yup
    .mixed()
    .nullable()
    .test(
      'fileSize',
      t(`VALIDATION_FILE_SIZE`),
      (value) => !value || (value && value[0].size <= FILE_SIZE),
    )
    .test(
      'filetype',
      t(`VALIDATION_FILE_TYPE`),
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value[0].type)),
    );

  const basicCardNodeEditSchema = yup.object().shape({
    title: yup.string().nullable().trim().max(20, t(`VALIDATION_STRING_LIMIT_20`)),
    description: yup.string().max(230, t(`VALIDATION_STRING_LIMIT_230`)),
    imageCtrl: yup.object().shape({
      imageFile: imageFileEditSchema,
      imageUrl: yup.string().url(t(`VALIDATION_URL`)),
    }),
    buttons: buttonsEditSchema,
  });

  const listCardNodeEditSchema = yup.object().shape({
    header: yup.string().trim().max(15, t(`VALIDATION_STRING_LIMIT_15`)),
    imageCtrl: yup.object().shape({
      imageFile: imageFileEditSchema,
      imageUrl: yup.string().url(t(`VALIDATION_URL`)),
    }),

    items: yup.array().of(
      yup.object().shape({
        title: yup.string().trim().max(36, t(`VALIDATION_STRING_LIMIT_36`)).required(),
        description: yup.string().max(16, t(`VALIDATION_STRING_LIMIT_16`)),
        imageFile: imageFileEditSchema,
        imageUrl: yup.string().url(t(`VALIDATION_URL`)),
      }),
    ),
    buttons: buttonsEditSchema,
  });

  const productCardNodeEditSchema = yup.object().shape({
    imageCtrl: yup.object().shape({
      imageFile: imageFileEditSchema,
      imageUrl: yup.string().url(t(`VALIDATION_URL`)),
    }),
    profileIconUrl: yup.string().url(t(`VALIDATION_URL`)),
    profileName: yup
      .string()
      .trim()
      .max(15, t(`VALIDATION_STRING_LIMIT_15`))
      .required(t(`VALIDATION_REQUIRED`)),
    description: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
    retailPrice: yup
      .number()
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      })
      .typeError(t(`VALIDATION_TYPE_ERROR_NUMBER`))
      .required(t(`VALIDATION_REQUIRED`)),
    salePrice: yup
      .number()
      .transform((value, originalValue) => {
        return originalValue === '' ? undefined : value;
      })
      .typeError(t(`VALIDATION_TYPE_ERROR_NUMBER`))
      .required(t(`VALIDATION_REQUIRED`)),
    currencyUnit: yup.mixed().oneOf(['USD', 'KRW', 'JPY']),
    buttons: buttonsEditSchema,
  });

  const conditionNodeEditSchema = yup.object().shape({
    items: yup.array().of(
      yup.object().shape({
        op1: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
        op2: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
      }),
    ),
    trueThenNextNodeId: yup.string().required(t(`VALIDATION_REQUIRED`)),
    falseThenNextNodeId: yup.string().required(t(`VALIDATION_REQUIRED`)),
  });

  const retryConditionNodeEditSchema = yup.object().shape({
    trueThenNextNodeId: yup.string().required(t(`VALIDATION_REQUIRED`)),
    falseThenNextNodeId: yup.string().required(t(`VALIDATION_REQUIRED`)),
  });

  const parameterSetNodeEditSchema = yup.object().shape({
    parameters: yup.array().of(
      yup.object().shape({
        name: yup
          .string()
          .trim()
          .matches(/^[a-z0-9_]*$/, t(`VALIDATION_REGEX_MATCH`))
          .required(t(`VALIDATION_REQUIRED`)),
        value: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
      }),
    ),
  });

  const answerNodeEditSchema = yup.object().shape({
    utteranceParam: yup
      .string()
      .nullable()
      .when('useUtteranceParam', {
        is: true,
        then: yup.string().required(t(`VALIDATION_REQUIRED`)),
      }),
    quicks: buttonsEditSchema,
  });

  const answerNodeEditNextNodeIdSchema = yup
    .string()
    .nullable()
    .when('view.useUtteranceParam', {
      is: true,
      then: yup.string().required(t(`VALIDATION_REQUIRED`)),
    });

  const parameterSetNodeEditNextNodeIdSchema = yup
    .string()
    .required(t(`VALIDATION_REQUIRED`));

  const otherFlowRedirectNodeEditSchema = yup.object().shape({
    otherFlowId: yup.string().required(t(`VALIDATION_REQUIRED`)),
  });

  const basicCardCarouselNodeEditSchema = yup.object().shape({
    childrenViews: yup.array().of(basicCardNodeEditSchema),
  });

  const listCardCarouselNodeEditSchema = yup.object().shape({
    childrenViews: yup.array().of(listCardNodeEditSchema),
  });

  const productCardCarouselNodeEditSchema = yup.object().shape({
    header: yup.string().trim().max(15, t(`VALIDATION_STRING_LIMIT_15`)),
    childrenViews: yup.array().of(productCardNodeEditSchema),
  });

  const schema = yup
    .object({
      title: yup.string().required(t(`VALIDATION_REQUIRED`)),
      view: yup
        .object()
        .when('type', {
          is: NODE_TYPES.TEXT_NODE,
          then: textNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.BASIC_CARD_NODE,
          then: basicCardNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.LIST_CARD_NODE,
          then: listCardNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.PRODUCT_CARD_NODE,
          then: productCardNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.BASIC_CARD_CAROUSEL_NODE,
          then: basicCardCarouselNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.LIST_CARD_CAROUSEL_NODE,
          then: listCardCarouselNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE,
          then: productCardCarouselNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.CONDITION_NODE,
          then: conditionNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.RETRY_CONDITION_NODE,
          then: retryConditionNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.PARAMETER_SET_NODE,
          then: parameterSetNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.OTHER_FLOW_REDIRECT_NODE,
          then: otherFlowRedirectNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.ANSWER_NODE,
          then: answerNodeEditSchema,
        }),
      nextNodeId: yup
        .string()
        .nullable()
        .when('type', {
          is: (nodeType: string) => {
            return checkNextNodeIdTypes.includes(nodeType);
          },
          then: parameterSetNodeEditNextNodeIdSchema,
        })
        .when('type', {
          is: NODE_TYPES.ANSWER_NODE,
          then: answerNodeEditNextNodeIdSchema,
        }),
    })
    .required();

  return { schema };
};
