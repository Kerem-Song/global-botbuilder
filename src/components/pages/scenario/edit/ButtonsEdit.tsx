import { Button, Divider, FormItem, Input, Space } from '@components';
import { useHistoryViewerMatch, usePage, useRootState } from '@hooks';
import { IGNodeEditModel, ImageAspectRatio } from '@models';
import {
  ACTION_TYPES,
  ActionTypes,
  IButtonEditViewBase,
} from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonTypeSelector } from './ButtonTypeSelector';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';
import { SelectNode } from './SelectNode';

export const ButtonsEdit = ({
  index,
  isCarousel,
  imageRatio,
  nodeId,
  useCounter,
  isDataApi,
}: {
  index?: number;
  isCarousel?: boolean;
  imageRatio?: ImageAspectRatio;
  nodeId?: string;
  useCounter: boolean;
  isDataApi?: boolean;
}) => {
  const { t } = usePage();
  const selectOptions = [
    { value: ACTION_TYPES.LUNA_NODE_REDIRECT, label: t(`SET_CONNECT_NEXT_NODE`) },
    { value: ACTION_TYPES.URL, label: t(`SET_URL_CONNECT`) },
    { value: ACTION_TYPES.ACT_VALUE_IS_UTTR, label: t(`SET_MESSAGE`) },
    { value: ACTION_TYPES.LBL_IS_UTTR, label: t(`SET_BUTTON_NAME`) },
  ];
  const [buttonType, setButtonType] = useState<ActionTypes>();
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IButtonEditViewBase>>();

  const isHistoryViewer = useHistoryViewerMatch();

  const { fields, append, remove } = useFieldArray({
    name: index === undefined ? 'view.buttons' : `view.childrenViews.${index}.buttons`,
    control,
  });

  const handleAddButton = () => {
    // e.preventDefault();
    if (fields.length < 3) {
      const buttonNameRegex = new RegExp(t(`BUTTON`));
      const filtered = fields.filter((button) => buttonNameRegex.test(button.label));
      let index = 1;

      if (filtered) {
        const regex = /[^0-9]/g;
        const results =
          filtered
            ?.map((x) => Number(x.label?.replace(regex, '')))
            .sort((a: number, b: number) => {
              return a - b;
            }) || [];
        const max = Math.max(...results);

        for (let i = 1; i <= max + 1; i++) {
          if (!results.includes(i)) {
            index = i;
            break;
          }
        }
      }
      append(nodeDefaultHelper.createDefaultButtonCtrl(index - 1));
    } else {
      //modal alert
      console.log('3개까지 가능');
    }
  };

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    if (imageRatio === ImageAspectRatio.Square) {
      fields.length === 3 && handleDeleteButton(fields.length - 1);

      if (isCarousel) {
        watch(`view.childrenViews`)?.map((item, i) => {
          if (item.buttons?.length === 3) {
            setValue(`view.childrenViews.${i}.buttons`, item.buttons.slice(0, -1));
          }
        });
      }
    }
  }, [imageRatio]);

  const nodes = useRootState((state) => state.makingNodeSliceReducer.present.nodes);
  const selected = useRootState((state) => state.botBuilderReducer.selected);
  const selectedNode = nodes.find((x) => x.id === selected);

  return (
    <>
      {fields.map((item, i) => (
        <Space direction="vertical" key={item.id}>
          <Space direction="vertical" gap={12}>
            <FormItem
              error={
                index === undefined
                  ? errors.view?.buttons?.[i]?.label
                  : errors.view?.childrenViews?.[index]?.buttons?.[i]?.label
              }
            >
              <InputWithTitleCounter
                required
                label={t(`BUTTON_NAME`)}
                showCount={useCounter ? true : false}
                counterLimit={14}
                maxLength={100}
                isLight={true}
                {...register(
                  index === undefined
                    ? `view.buttons.${i}.label`
                    : `view.childrenViews.${index}.buttons.${i}.label`,
                )}
                textLength={
                  useCounter
                    ? watch(
                        index === undefined
                          ? `view.buttons.${i}.label`
                          : `view.childrenViews.${index}.buttons.${i}.label`,
                      )?.length || 0
                    : undefined
                }
                placeholder={
                  isDataApi
                    ? t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)
                    : t(`BUTTON_NAME_PLACEHOLDER`)
                }
                readOnly={isHistoryViewer}
              />
            </FormItem>
            <Space direction="vertical" gap={8}>
              <span className="subLabel">
                {t(`BUTTON_TYPE`)}
                <span className="required"> *</span>
              </span>
              <ButtonTypeSelector
                index={i}
                options={selectOptions}
                setButtonType={setButtonType}
                carouselIndex={index}
                isCarousel={isCarousel}
              />
            </Space>
            <Space direction="vertical" gap={8}>
              {watch(
                index === undefined
                  ? `view.buttons.${i}.actionType`
                  : `view.childrenViews.${index}.buttons.${i}.actionType`,
              ) === ACTION_TYPES.LUNA_NODE_REDIRECT && (
                <>
                  <span className="subLabel">{t(`SELECT_NODE`)}</span>
                  <FormItem
                    error={
                      index === undefined
                        ? errors.view?.buttons?.[i]?.actionValue
                        : errors.view?.childrenViews?.[index]?.buttons?.[i]?.actionValue
                    }
                  >
                    <SelectNode
                      fieldName={
                        index === undefined
                          ? `view.buttons.${i}.actionValue`
                          : `view.childrenViews.${index}.buttons.${i}.actionValue`
                      }
                      nodeId={nodeId}
                      error={
                        index === undefined
                          ? errors.view?.buttons?.[i]?.actionValue
                          : errors.view?.childrenViews?.[index]?.buttons?.[i]?.actionValue
                      }
                    />
                  </FormItem>
                </>
              )}
              {watch(
                index === undefined
                  ? `view.buttons.${i}.actionType`
                  : `view.childrenViews.${index}.buttons.${i}.actionType`,
              ) === ACTION_TYPES.URL && (
                <>
                  <span className="subLabel">
                    {t(`SET_URL`)}
                    <span className="required"> *</span>
                  </span>
                  <FormItem
                    error={
                      index === undefined
                        ? errors.view?.buttons?.[i]?.actionValue
                        : errors.view?.childrenViews?.[index]?.buttons?.[i]?.actionValue
                    }
                  >
                    <Input
                      {...register(
                        index === undefined
                          ? `view.buttons.${i}.actionValue`
                          : `view.childrenViews.${index}.buttons.${i}.actionValue`,
                      )}
                      placeholder={
                        isDataApi
                          ? t(`DATA_CARD_NODE_IMAGE_INPUT_PLACEHOLDER`)
                          : t(`SET_URL_PLACEHOLDER`)
                      }
                      maxLength={1055}
                    />
                  </FormItem>
                </>
              )}
              {watch(
                index === undefined
                  ? `view.buttons.${i}.actionType`
                  : `view.childrenViews.${index}.buttons.${i}.actionType`,
              ) === ACTION_TYPES.ACT_VALUE_IS_UTTR && (
                <>
                  <FormItem
                    error={
                      index === undefined
                        ? errors.view?.buttons?.[i]?.actionValue
                        : errors.view?.childrenViews?.[index]?.buttons?.[i]?.actionValue
                    }
                  >
                    <InputTextAreaWithTitleCounter
                      className="actValueIsUttrInput"
                      label={t(`SET_MESSAGE`)}
                      showCount={useCounter ? true : false}
                      maxLength={useCounter ? 300 : undefined}
                      isLight={true}
                      required={true}
                      placeholder={
                        isDataApi
                          ? t(`DATA_CARD_NODE_INPUT_PLACEHOLDER`)
                          : t(`SET_MESSAGE_PLACEHOLDER`)
                      }
                      {...register(
                        index === undefined
                          ? `view.buttons.${i}.actionValue`
                          : `view.childrenViews.${index}.buttons.${i}.actionValue`,
                      )}
                      textLength={
                        useCounter
                          ? watch(
                              index === undefined
                                ? `view.buttons.${i}.actionValue`
                                : `view.childrenViews.${index}.buttons.${i}.actionValue`,
                            )?.length || 0
                          : undefined
                      }
                      readOnly={isHistoryViewer}
                    />
                  </FormItem>
                </>
              )}
            </Space>
            <Button
              shape="ghost"
              className="deleteBtn"
              onClick={() => handleDeleteButton(i)}
            >
              {t(`DELETE_BUTTON`)}
            </Button>
          </Space>
          {fields.length !== i + 1 && <Divider style={{ margin: '0 0 32px 0' }} />}
        </Space>
      ))}
      {fields.length < (imageRatio === ImageAspectRatio.Square ? 2 : 3) && (
        <Button shape="ghost" className="addBtn" onClick={handleAddButton}>
          <span>+ {t(`ADD_A_NEW_BUTTON`)}</span>
        </Button>
      )}
    </>
  );
};
