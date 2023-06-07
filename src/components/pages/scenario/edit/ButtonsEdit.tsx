import { Button, FormItem, Input, Space } from '@components';
import { useHistoryViewerMatch, useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel, ImageAspectRatio } from '@models';
import {
  ACTION_TYPES,
  ActionTypes,
  IButtonEditViewBase,
} from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { t } from 'i18next';
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
}: {
  index?: number;
  isCarousel?: boolean;
  imageRatio?: ImageAspectRatio;
  nodeId?: string;
  useCounter: boolean;
}) => {
  const { t, tc } = usePage();
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
    resetField,
    reset,
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
        const results = filtered?.map((x) => Number(x.label?.replace(regex, ''))) || [];
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
    if (imageRatio === ImageAspectRatio.Square && fields.length === 3) {
      handleDeleteButton(fields.length - 1);
    }
  }, [imageRatio]);

  useEffect(() => {
    resetField(
      index === undefined ? 'view.buttons' : `view.childrenViews.${index}.buttons`,
    );
  }, [nodeId]);

  return (
    <>
      {fields.map((item, i) => (
        <Space direction="vertical" key={item.id}>
          <Space direction="vertical">
            {/* <span className="subLabel">{t(`BUTTON_NAME`)}</span> */}
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
                maxLength={useCounter ? 14 : undefined}
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
                placeholder={t(`BUTTON_NAME_PLACEHOLDER`)}
                readOnly={isHistoryViewer}
              />
            </FormItem>
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
                    maxLength={useCounter ? 14 : undefined}
                    isLight={true}
                    required={true}
                    placeholder={t(`SET_MESSAGE_PLACEHOLDER`)}
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
            <div className="deleteBtn">
              <Button shape="ghost" onClick={() => handleDeleteButton(i)}>
                {t(`DELETE_BUTTON`)}
              </Button>
            </div>
          </Space>
        </Space>
      ))}
      {fields.length < (imageRatio === ImageAspectRatio.Square ? 2 : 3) && (
        <Button shape="ghost" className="addBtn" onClick={handleAddButton}>
          <span>{t(`ADD_A_NEW_BUTTON`)}</span>
        </Button>
      )}
    </>
  );
};
