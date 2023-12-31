import { Button, Divider, Input, Space } from '@components';
import { FormItem } from '@components/data-entry';
import { Collapse } from '@components/general/Collapse';
import { usePage } from '@hooks';
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
  const { t, tc, isReadOnly } = usePage();
  const {
    register,
    getValues,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IAnswerView>>();

  const values = getValues();
  const { fields, append, remove } = useFieldArray({
    name: 'view.quicks',
    control,
  });

  const handleAddButton = () => {
    // e.preventDefault();
    if (fields.length < QUICK_MAX_COUNT) {
      const buttonNameRegex = new RegExp(tc(`DEFAULT_LBL_QUICKREPLY`));
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

      append(nodeDefaultHelper.createDefaultAnswerQickItem(index - 1));
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
      <Space direction="vertical" gap={12}>
        {fields.map((item, i) => (
          <div key={item.id}>
            <Space direction="vertical" gap={12}>
              <Space direction="vertical" gap={12}>
                <FormItem
                  error={
                    errors.view && errors.view.quicks && errors.view.quicks[i]?.label
                  }
                >
                  <InputWithTitleCounter
                    label={t(`QUICK_REPLY_BUTTON_NAME`)}
                    required={true}
                    showCount={true}
                    counterLimit={19}
                    maxLength={100}
                    isLight={true}
                    {...register(`view.quicks.${i}.label`)}
                    textLength={watch(`view.quicks.${i}.label`)?.length || 0}
                    readOnly={isReadOnly}
                  />
                </FormItem>
                <Space direction="vertical" gap={8}>
                  <span className="subLabel">
                    {t(`QUICK_REPLY_BUTTON_TYPE`)}
                    <span className="required"> *</span>
                  </span>
                  <ButtonCtrlSelector
                    name={`view.quicks.${i}.actionType`}
                    value={`view.quicks.${i}.actionValue`}
                  />
                </Space>
                <Space direction="vertical" gap={8}>
                  {watch(`view.quicks.${i}.actionType`) ===
                    ACTION_TYPES.LUNA_NODE_REDIRECT && (
                    <>
                      <span className="subLabel">{t(`SELECT_NODE`)}</span>
                      <FormItem error={errors.view?.quicks?.[i]?.actionValue}>
                        <SelectNode
                          fieldName={`view.quicks.${i}.actionValue`}
                          defaultValue={values.view?.quicks?.[i].actionValue}
                          nodeId={getValues().id}
                          error={errors.view?.quicks?.[i]?.actionValue}
                        />
                      </FormItem>
                    </>
                  )}
                  {watch(`view.quicks.${i}.actionType`) === ACTION_TYPES.URL && (
                    <>
                      <span className="subLabel">
                        {t(`SET_URL`)}
                        <span className="required"> *</span>
                      </span>
                      <FormItem
                        error={
                          errors.view &&
                          errors.view.quicks &&
                          errors.view.quicks[i]?.actionValue
                        }
                      >
                        <Input
                          {...register(`view.quicks.${i}.actionValue`)}
                          readOnly={isReadOnly}
                          placeholder={t(`SET_URL_PLACEHOLDER`)}
                          maxLength={1055}
                        />
                      </FormItem>
                    </>
                  )}
                  {watch(`view.quicks.${i}.actionType`) ===
                    ACTION_TYPES.ACT_VALUE_IS_UTTR && (
                    <FormItem
                      error={
                        errors.view &&
                        errors.view.quicks &&
                        errors.view.quicks[i]?.actionValue
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
                        readOnly={isReadOnly}
                      />
                    </FormItem>
                  )}
                </Space>
                {i === 0 && !watch('view.useUtteranceParam') ? (
                  <></>
                ) : (
                  <Button
                    shape="ghost"
                    className="deleteBtn"
                    onClick={() => handleDeleteButton(i)}
                  >
                    {t(`DELETE_BUTTON`)}
                  </Button>
                )}
              </Space>
            </Space>
            {fields.length !== i + 1 && <Divider style={{ margin: '20px 0' }} />}
          </div>
        ))}{' '}
        {fields.length < QUICK_MAX_COUNT && (
          <Button shape="ghost" className="addBtn" onClick={handleAddButton}>
            <span>+ {t(`ADD_A_QUICK_REPLY`)}</span>
          </Button>
        )}
      </Space>
    </Collapse>
  );
};
