import { Button, Input, Space } from '@components';
import { FormItem, InputTextarea } from '@components/data-entry';
import { usePage } from '@hooks';
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

export const selectOptions = [
  { value: ACTION_TYPES.LUNA_NODE_REDIRECT, label: '메시지 연결' },
  { value: ACTION_TYPES.ACT_VALUE_IS_UTTR, label: '메시지 입력' },
  //{ value: ACTION_TYPES.LBL_IS_UTTR, label: 'Label is Utterance' },
  { value: ACTION_TYPES.URL, label: 'URL 연결' },
];

export const ButtonsEdit = ({
  index,
  isCarousel,
  imageRatio,
  nodeId,
}: {
  index?: number;
  isCarousel?: boolean;
  imageRatio?: ImageAspectRatio;
  nodeId?: string;
}) => {
  const { t } = usePage();
  const [buttonType, setButtonType] = useState<ActionTypes>();
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IButtonEditViewBase>>();

  const { fields, append, remove } = useFieldArray({
    name: index === undefined ? 'view.buttons' : `view.childrenViews.${index}.buttons`,
    control,
  });

  const handleAddButton = () => {
    console.log('handle add condition btn');
    // e.preventDefault();
    if (fields.length < 3) {
      append(nodeDefaultHelper.createDefaultButtonCtrl(fields.length));
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
                showCount={true}
                maxLength={14}
                isLight={true}
                {...register(
                  index === undefined
                    ? `view.buttons.${i}.label`
                    : `view.childrenViews.${index}.buttons.${i}.label`,
                )}
                textLength={
                  watch(
                    index === undefined
                      ? `view.buttons.${i}.label`
                      : `view.childrenViews.${index}.buttons.${i}.label`,
                  )?.length || 0
                }
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
                <span className="subLabel">
                  {t(`SELECT_NODE`)}
                  <span className="required"> *</span>
                </span>
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
                    showCount
                    maxLength={14}
                    isLight={true}
                    required={true}
                    placeholder={t(`SET_MESSAGE_PLACEHOLDER`)}
                    {...register(
                      index === undefined
                        ? `view.buttons.${i}.actionValue`
                        : `view.childrenViews.${index}.buttons.${i}.actionValue`,
                    )}
                    textLength={
                      watch(
                        index === undefined
                          ? `view.buttons.${i}.actionValue`
                          : `view.childrenViews.${index}.buttons.${i}.actionValue`,
                      )?.length || 0
                    }
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
