import { Button, Input, Space } from '@components';
import { FormItem } from '@components/data-entry';
import { usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import {
  ACTION_TYPES,
  ActionTypes,
  IButtonEditViewBase,
} from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonTypeSelector } from './ButtonTypeSelector';
import { InputWithTitleCounter } from './InputWithTitleCounter';
import { SelectNode } from './SelectNode';

export const selectOptions = [
  { value: ACTION_TYPES.LUNA_NODE_REDIRECT, label: 'Node Redirect' },
  { value: ACTION_TYPES.ACT_VALUE_IS_UTTR, label: 'Action is Utterance' },
  { value: ACTION_TYPES.LBL_IS_UTTR, label: 'Label is Utterance' },
  { value: ACTION_TYPES.URL, label: 'Url' },
];

export const ButtonsEdit = ({
  index,
  isCarousel,
}: {
  index?: number;
  isCarousel?: boolean;
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
                label={t(`BUTTON_NAME`)}
                showCount={true}
                maxLength={14}
                isLight={true}
                {...register(
                  index === undefined
                    ? `view.buttons.${i}.label`
                    : `view.childrenViews.${index}.buttons.${i}.label`,
                )}
              />
            </FormItem>
            <span className="subLabel">{t(`BUTTON_TYPE`)}</span>
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
                />
              </FormItem>
            )}
            {watch(
              index === undefined
                ? `view.buttons.${i}.actionType`
                : `view.childrenViews.${index}.buttons.${i}.actionType`,
            ) === ACTION_TYPES.URL && (
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
            )}
            <div className="deleteBtn">
              <Button shape="ghost" onClick={() => handleDeleteButton(i)}>
                {t(`DELETE_BUTTON`)}
              </Button>
            </div>
          </Space>
        </Space>
      ))}
      {fields.length < 3 && (
        <Button shape="ghost" className="addBtn" onClick={handleAddButton}>
          <span>{t(`ADD_A_NEW_BUTTON`)}</span>
        </Button>
      )}
    </>
  );
};
