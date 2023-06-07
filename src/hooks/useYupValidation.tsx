import { usePage } from '@hooks';
import { NODE_TYPES } from '@models';
import { ACTION_TYPES } from '@models/interfaces/res/IGetFlowRes';
import { CONDITION_PARAMETER_REGEX } from '@modules';
import { is } from 'immer/dist/internal';
import * as yup from 'yup';

const checkNextNodeIdTypes: string[] = [
  NODE_TYPES.PARAMETER_SET_NODE,
  NODE_TYPES.OTHER_FLOW_REDIRECT_NODE,
];

export const useYupValidation = () => {
  const { t } = usePage();

  const FILE_SIZE = 3 * 1024 * 1024; //3mb제한

  const SUPPORTED_FORMATS = ['image/jpeg', 'image/png']; //jpeg, png가능(Line 기준)

  const patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/;

  const textNodeEditSchema = yup.object().shape({
    text: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
  });

  const quicksEditSchema = yup
    .array()
    .max(10, t(`VALIDATION_BUTTON_MAX`))
    .of(
      yup.object().shape({
        label: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
        actionValue: yup
          .string()
          .when('actionType', {
            is: ACTION_TYPES.URL,
            then: yup
              .string()
              // .url(t(`VALIDATION_URL`))
              .required(t(`VALIDATION_REQUIRED`)),
          })
          .when('actionType', {
            is: ACTION_TYPES.LUNA_NODE_REDIRECT,
            then: yup.string().nullable(),
          })
          .when('actionType', {
            is: ACTION_TYPES.ACT_VALUE_IS_UTTR,
            then: yup
              .string()
              .max(14, t(`VALIDATION_STRING_LIMIT`, { maxCount: 14 }))
              .required(t(`VALIDATION_REQUIRED`)),
          }),
      }),
    );

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
              // .url(t(`VALIDATION_URL`))
              .required(t(`VALIDATION_REQUIRED`)),
          })
          .when('actionType', {
            is: ACTION_TYPES.LUNA_NODE_REDIRECT,
            then: yup.string().nullable(),
          })
          .when('actionType', {
            is: ACTION_TYPES.ACT_VALUE_IS_UTTR,
            then: yup
              .string()
              // .max(14, t(`VALIDATION_STRING_LIMIT`, { maxCount: 14 }))
              .required(t(`VALIDATION_REQUIRED`)),
          }),
      }),
    );

  const dataApiButtonsEditSchema = yup
    .array()
    .max(3, t(`VALIDATION_BUTTON_MAX`))
    .of(
      yup.object().shape({
        label: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
        actionValue: yup
          .string()
          .when('actionType', {
            is: ACTION_TYPES.URL,
            then: yup.string().required(t(`VALIDATION_REQUIRED`)),
          })
          .when('actionType', {
            is: ACTION_TYPES.LUNA_NODE_REDIRECT,
            then: yup.string().nullable(),
          })
          .when('actionType', {
            is: ACTION_TYPES.ACT_VALUE_IS_UTTR,
            then: yup.string().required(t(`VALIDATION_REQUIRED`)),
          }),
      }),
    );

  const imageFileEditSchema = yup
    .mixed()
    .nullable()
    .when('useImageCtrl', {
      is: true,
      then: yup.string().required(t(`VALIDATION_REQUIRED`)),
    })
    .test(
      'fileSize',
      t(`VALIDATION_FILE_SIZE`),
      (value) => !value || (value && value[0]?.size <= FILE_SIZE),
    )
    .test(
      'filetype',
      t(`VALIDATION_FILE_TYPE`),
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value[0]?.type)),
    );

  const imageCtrlEditSchema = yup.object().when('useImageCtrl', {
    is: true,
    then: yup.object().shape({
      imageFile: imageFileEditSchema,
      imageUrl: yup
        .string()
        // .url(t(`VALIDATION_URL`))
        .required(t(`VALIDATION_REQUIRED`)),
    }),
  });

  const basicCardCarouselNodeEditSchemaForScript = yup.object().shape({
    title: yup.string().nullable().trim(),

    description: yup
      .string()
      .nullable()
      .when('useImageCtrl', {
        is: true,
        then: yup.string().max(60, t(`VALIDATION_STRING_LIMIT`, { maxCount: 60 })),
      })
      .when('useImageCtrl', {
        is: false,
        then: yup.string().max(120, t(`VALIDATION_STRING_LIMIT`, { maxCount: 120 })),
      })
      .when('title', {
        is: (title: string) => title?.length > 0,
        then: yup.string().max(60, t(`VALIDATION_STRING_LIMIT`, { maxCount: 60 })),
      })
      .when('title', {
        is: (title: string) => !title,
        then: yup.string().max(120, t(`VALIDATION_STRING_LIMIT`, { maxCount: 120 })),
      }),

    imageCtrl: imageCtrlEditSchema,
    buttons: buttonsEditSchema,
  });

  const basicCardNodeEditSchema = yup.object().shape({
    title: yup.string().nullable().trim(),
    description: yup
      .string()
      .nullable()
      .when('useImageCtrl', {
        is: (useImageCtrl: boolean) => useImageCtrl,
        then: yup.string().max(230, t(`VALIDATION_STRING_LIMIT`, { maxCount: 230 })),
      })
      .when('useImageCtrl', {
        is: (useImageCtrl: boolean) => !useImageCtrl,
        then: yup.string().max(400, t(`VALIDATION_STRING_LIMIT`, { maxCount: 400 })),
      }),
    imageCtrl: imageCtrlEditSchema,
    buttons: buttonsEditSchema,
  });

  const listCardNodeEditSchema = yup.object().shape({
    header: yup
      .string()
      .trim()
      .max(15, t(`VALIDATION_STRING_LIMIT`, { maxCount: 15 }))
      .required(t(`VALIDATION_REQUIRED`)),
    imageCtrl: imageCtrlEditSchema,
    items: yup.array().of(
      yup.object().shape({
        title: yup
          .string()
          .trim()
          .max(36, t(`VALIDATION_STRING_LIMIT`, { maxCount: 36 }))
          .required(t(`VALIDATION_REQUIRED`)),
        description: yup.string().max(16, t(`VALIDATION_STRING_LIMIT`, { maxCount: 16 })),
        imageFile: imageFileEditSchema,
        imageUrl: yup
          .string()
          // .url(t(`VALIDATION_URL`))
          .required(t(`VALIDATION_REQUIRED`)),
      }),
    ),
    buttons: buttonsEditSchema,
  });

  const productCardNodeEditSchema = yup.object().shape({
    imageCtrl: yup.object().shape({
      imageFile: yup
        .mixed()
        .nullable()
        .test(
          'fileSize',
          t(`VALIDATION_FILE_SIZE`),
          (value) => !value || (value && value[0]?.size <= FILE_SIZE),
        )
        .test(
          'filetype',
          t(`VALIDATION_FILE_TYPE`),
          (value) => !value || (value && SUPPORTED_FORMATS.includes(value[0]?.type)),
        ),
      imageUrl: yup
        .string()
        // .url(t(`VALIDATION_URL`))
        .required(t(`VALIDATION_REQUIRED`)),
    }),
    profileIconUrl: yup
      .string()
      // .url(t(`VALIDATION_URL`))
      .required(t(`VALIDATION_REQUIRED`)),
    profileName: yup
      .string()
      .trim()
      .max(15, t(`VALIDATION_STRING_LIMIT`, { maxCount: 15 }))
      .required(t(`VALIDATION_REQUIRED`)),
    description: yup
      .string()
      .trim()
      .max(30, t(`VALIDATION_STRING_LIMIT`, { maxCount: 30 }))
      .required(t(`VALIDATION_REQUIRED`)),
    retailPrice: yup
      .number()
      .typeError(t(`VALIDATION_TYPE_ERROR_NUMBER`))
      // .positive()
      .test('is-decimal', t(`PRODUCT_NODE_SET_PRICE_DECIMAL`), (val: any) => {
        if (val != undefined) {
          return patternTwoDigisAfterComma.test(val);
        }
        return true;
      })
      .max(99999999, t(`PRODUCT_NODE_SET_PRICE_MAX_LIMIT`, { max: 99999999 }))
      .transform((value, originalValue) => {
        return Number.isNaN(originalValue) ? '' : Number(value);
      })
      .required(t(`VALIDATION_REQUIRED`)),
    discountAmount: yup
      .number()
      .typeError(t(`VALIDATION_TYPE_ERROR_NUMBER`))
      .nullable()
      .min(0, t(`PRODUCT_NODE_SET_POSITIVE_SALE_PRICE`))
      .test('is-decimal', t(`PRODUCT_NODE_SET_PRICE_DECIMAL`), (val: any) => {
        if (val != undefined) {
          return patternTwoDigisAfterComma.test(val);
        }
        return true;
      })
      .max(
        yup.ref('retailPrice'),
        t(`PRODUCT_NODE_SET_PRICE_MAX_LIMIT`, { max: yup.ref('retailPrice') }),
      )
      .transform((value, originalValue) => {
        return Number.isNaN(originalValue) ? '' : Number(value);
      }),
    salePrice: yup
      .number()
      .typeError(t(`VALIDATION_TYPE_ERROR_NUMBER`))
      .nullable()
      .min(0, t(`PRODUCT_NODE_SET_POSITIVE_SALE_PRICE`))
      .test('is-decimal', t(`PRODUCT_NODE_SET_PRICE_DECIMAL`), (val: any) => {
        if (val != undefined) {
          return patternTwoDigisAfterComma.test(val);
        }
        return true;
      })
      .max(
        yup.ref('retailPrice'),
        t(`PRODUCT_NODE_SET_PRICE_MAX_LIMIT`, { max: yup.ref('retailPrice') }),
      )

      .transform((value, originalValue) => {
        return Number.isNaN(originalValue) ? '' : Number(value);
      }),
    buttons: buttonsEditSchema,
  });

  const conditionNodeEditSchema = yup.object().shape({
    items: yup.array().of(
      yup.object().shape({
        op1: yup
          .string()
          .nullable()
          .trim()
          .matches(CONDITION_PARAMETER_REGEX, t('VALIDATION_REGEX_MATCH'))
          .required(t(`VALIDATION_REQUIRED`)),
        operator: yup
          .number()
          .not([0], t(`VALIDATION_REQUIRED`))
          .required(t(`VALIDATION_REQUIRED`)),
        op2: yup
          .string()
          .nullable()
          .trim()
          .matches(CONDITION_PARAMETER_REGEX, t('VALIDATION_REGEX_MATCH'))
          .required(t(`VALIDATION_REQUIRED`)),
      }),
    ),
    // trueThenNextNodeId: yup.string().required(t(`VALIDATION_REQUIRED`)),
    // falseThenNextNodeId: yup.string().required(t(`VALIDATION_REQUIRED`)),
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
        then: yup
          .string()
          .trim()
          .matches(/^[\\{a-z0-9_\\}]*$/, t(`VALIDATION_REGEX_MATCH`))
          .required(t(`VALIDATION_REQUIRED`)),
      }),
    quicks: quicksEditSchema,
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
    //otherFlowId: yup.string().required(t(`VALIDATION_REQUIRED`)),
  });

  const intentNodeEditSchema = yup.string().nullable().required(t(`VALIDATION_REQUIRED`));

  const basicCardCarouselNodeEditSchema = yup.object().shape({
    childrenViews: yup.array().of(basicCardCarouselNodeEditSchemaForScript),
  });

  const listCardCarouselNodeEditSchema = yup.object().shape({
    childrenViews: yup.array().of(listCardNodeEditSchema),
  });

  const productCardCarouselNodeEditSchema = yup.object().shape({
    header: yup
      .string()
      .trim()
      .max(15, t(`VALIDATION_STRING_LIMIT`, { maxCount: 15 })),
    childrenViews: yup.array().of(productCardNodeEditSchema),
  });

  const jsonRequestNodeEdtiSchema = yup.object().shape({
    url: yup.string().url(t(`VALIDATION_URL`)).required(t(`VALIDATION_REQUIRED`)),
  });

  const dataBasicCardNodeEditSchema = yup.object().shape({
    itemsRefName: yup
      .string()
      .trim()
      .matches(/^[a-z0-9_]*$/, t(`VALIDATION_REGEX_MATCH`))
      .required(t(`VALIDATION_REQUIRED`)),
    imageCtrl: imageCtrlEditSchema,
    buttons: dataApiButtonsEditSchema,
  });

  const dataListCardNodeEditSchema = yup.object().shape({
    header: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
    imageCtrl: imageCtrlEditSchema,
    items: yup.array().of(
      yup.object().shape({
        title: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
        imageFile: imageFileEditSchema,
        imageUrl: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
      }),
    ),
    buttons: dataApiButtonsEditSchema,
  });

  const dataProductCardNodeEditSchema = yup.object().shape({
    imageCtrl: yup.object().shape({
      imageFile: yup
        .mixed()
        .nullable()
        .test(
          'fileSize',
          t(`VALIDATION_FILE_SIZE`),
          (value) => !value || (value && value[0]?.size <= FILE_SIZE),
        )
        .test(
          'filetype',
          t(`VALIDATION_FILE_TYPE`),
          (value) => !value || (value && SUPPORTED_FORMATS.includes(value[0]?.type)),
        ),
      imageUrl: yup.string().required(t(`VALIDATION_REQUIRED`)),
    }),
    profileIconUrl: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
    profileName: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
    description: yup.string().trim().required(t(`VALIDATION_REQUIRED`)),
    buttons: dataApiButtonsEditSchema,
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
        })
        .when('type', {
          is: NODE_TYPES.JSON_REQUEST_NODE,
          then: jsonRequestNodeEdtiSchema,
        })
        .when('type', {
          is: NODE_TYPES.DATA_BASIC_CARD_NODE,
          then: dataBasicCardNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.DATA_LIST_CARD_NODE,
          then: dataListCardNodeEditSchema,
        })
        .when('type', {
          is: NODE_TYPES.DATA_PRODUCT_CARD_NODE,
          then: dataProductCardNodeEditSchema,
        }),

      // nextNodeId: yup
      //   .string()
      //   .nullable()
      //   .when('type', {
      //     is: (nodeType: string) => {
      //       // console.log(nodeType);
      //       return checkNextNodeIdTypes.includes(nodeType);
      //     },
      //     then: parameterSetNodeEditNextNodeIdSchema,
      //   })
      //   .when('type', {
      //     is: NODE_TYPES.ANSWER_NODE,
      //     then: answerNodeEditNextNodeIdSchema,
      //   }),
      nextNodeId: yup
        .string()
        .nullable()
        .when(['type', 'option'], {
          is: (type: string, option: number) => {
            return type === NODE_TYPES.INTENT_NODE && option === 20;
          },
          then: intentNodeEditSchema,
        }),
    })
    .required();

  return { schema };
};
