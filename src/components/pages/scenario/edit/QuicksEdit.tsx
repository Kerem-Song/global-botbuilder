import { Button, Input, Space } from '@components';
import { FormItem, InputTextarea } from '@components/data-entry';
import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';
import { useHistoryViewerMatch } from '@hooks/useHistoryViewerMatch';
import { IGNodeEditModel } from '@models';
import { ACTION_TYPES, IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import { QUICK_MAX_COUNT } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ButtonCtrlSelector } from './ButtonCtrlSelector';
import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { InputWithTitleCounter } from './InputWithTitleCounter';
import { SelectNode } from './SelectNode';

export const QuicksEdit = () => {
  const { t } = usePage();
  const {
    register,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IAnswerView>>();
  const isHistoryViewer = useHistoryViewerMatch();
  const values = getValues();
  const { fields, append, remove } = useFieldArray({
    name: 'view.quicks',
    control,
  });

  const handleAddButton = () => {
    console.log('handle add condition btn');
    // e.preventDefault();
    if (fields.length < QUICK_MAX_COUNT) {
      append(nodeDefaultHelper.createDefaultAnswerQickItem(fields.length));
    } else {
      //modal alert
      console.log('10개까지 가능');
    }
  };

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  return (
    <Collapse label={t(`QUICK_REPLY_BUTTON_SETTING`)} useSwitch={false}>
      {fields.map((item, i) => (
        <Space direction="vertical" key={item.id}>
          <Space direction="vertical">
            <FormItem
              error={errors.view && errors.view.quicks && errors.view.quicks[i]?.label}
            >
              <InputWithTitleCounter
                label={t(`QUICK_REPLY_BUTTON_NAME`)}
                required={true}
                showCount={true}
                maxLength={14}
                isLight={true}
                {...register(`view.quicks.${i}.label`)}
                textLength={watch(`view.quicks.${i}.label`)?.length || 0}
                readOnly={isHistoryViewer}
              />
            </FormItem>
            <div>
              <span className="subLabel">{t(`QUICK_REPLY_BUTTON_TYPE`)}</span>
              <span className="required"> *</span>
            </div>
            <ButtonCtrlSelector
              name={`view.quicks.${i}.actionType`}
              value={`view.quicks.${i}.actionValue`}
            />
            {watch(`view.quicks.${i}.actionType`) === ACTION_TYPES.LUNA_NODE_REDIRECT && (
              <FormItem error={errors.view?.quicks?.[i]?.actionValue}>
                <SelectNode
                  fieldName={`view.quicks.${i}.actionValue`}
                  defaultValue={values.view?.quicks?.[i].actionValue}
                  nodeId={getValues().id}
                  error={errors.view?.quicks?.[i]?.actionValue}
                />
              </FormItem>
            )}
            {watch(`view.quicks.${i}.actionType`) === ACTION_TYPES.URL && (
              <FormItem
                error={
                  errors.view && errors.view.quicks && errors.view.quicks[i]?.actionValue
                }
              >
                <Input
                  {...register(`view.quicks.${i}.actionValue`)}
                  readOnly={isHistoryViewer}
                />
              </FormItem>
            )}
            {watch(`view.quicks.${i}.actionType`) === ACTION_TYPES.ACT_VALUE_IS_UTTR && (
              <FormItem
                error={
                  errors.view && errors.view.quicks && errors.view.quicks[i]?.actionValue
                }
              >
                <InputTextAreaWithTitleCounter
                  className="actValueIsUttrInput"
                  label={t(`SET_MESSAGE`)}
                  showCount
                  maxLength={300}
                  isLight={true}
                  required={true}
                  placeholder={t(`SET_MESSAGE_PLACEHOLDER`)}
                  {...register(`view.quicks.${i}.actionValue`)}
                  textLength={watch(`view.quicks.${i}.actionValue`)?.length || 0}
                  readOnly={isHistoryViewer}
                />
              </FormItem>
            )}
            <div className="deleteBtn">
              {i === 0 && !watch('view.useUtteranceParam') ? (
                <></>
              ) : (
                <Button shape="ghost" onClick={() => handleDeleteButton(i)}>
                  {t(`DELETE_BUTTON`)}
                </Button>
              )}
            </div>
          </Space>
        </Space>
      ))}
      {fields.length < QUICK_MAX_COUNT && (
        <Button shape="ghost" className="addBtn" onClick={handleAddButton}>
          <span>+ {t(`ADD_A_QUICK_REPLY`)}</span>
        </Button>
      )}
    </Collapse>
  );
};
