import { Button, FormItem, Radio } from '@components';
import { useHistoryViewerMatch, usePage } from '@hooks';
import { ConditionJoin, ConditionOperator, IGNodeEditModel } from '@models';
import { ISwitchView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { OperatorSelector } from './OperatorSelector';
import { VariableSelector } from './VariableSelector';

export const SwitchConditions = ({ nestedIndex }: { nestedIndex: number }) => {
  const CONDITION_LIMIT = 5;
  const { t } = usePage();

  const {
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ISwitchView>>();

  const { fields, append, remove } = useFieldArray({
    name: `view.conditions.${nestedIndex}.items`,
    control,
  });

  const { field: joinField } = useController({
    name: `view.conditions.${nestedIndex}.join`,
    control,
  });

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  const handleAddConditionButton = (
    e: React.MouseEvent<HTMLLabelElement | HTMLButtonElement>,
  ) => {
    console.log('handle add condition btn');
    const join = watch(`view.conditions.${nestedIndex}.join`);

    e.preventDefault();
    if (fields.length < CONDITION_LIMIT) {
      append({
        op1: '',
        operator: ConditionOperator.Is,
        op2: '',
      });
    } else {
      //modal alert
      console.log('5개까지 가능');
    }
  };
  return (
    <>
      {fields.map((item, i) => (
        <div key={item.id}>
          <FormItem error={errors.view?.conditions?.[nestedIndex]?.items?.[i]?.op1}>
            <VariableSelector
              placeholder={t(`INPUT_VARIABLE_PLACEHOLDER`)}
              control={control}
              path={`view.conditions.${nestedIndex}.items.${i}.op1`}
            />
          </FormItem>

          <OperatorSelector index={i} nestedIndex={nestedIndex} />
          <p className="error-message">
            {errors.view?.conditions?.[nestedIndex]?.items?.[i]?.operator?.message}
          </p>
          <FormItem error={errors.view?.conditions?.[nestedIndex]?.items?.[i]?.op2}>
            <VariableSelector
              placeholder={t(`INPUT_VARIABLE_PLACEHOLDER`)}
              control={control}
              path={`view.conditions.${nestedIndex}.items.${i}.op2`}
            />
          </FormItem>

          {i === 0 ? (
            <div className="joinWrapper">
              <label
                className={classNames(`join`)}
                role="presentation"
                onClick={(e) => {
                  setValue(`view.conditions.${nestedIndex}.join`, ConditionJoin.And, {
                    shouldDirty: true,
                  });

                  if (fields.length === 1) {
                    handleAddConditionButton(e);
                  }
                }}
              >
                {/* <input
                    {...register(`view.conditions.${i}.join`, { valueAsNumber: true })}
                    type="radio"
                    value={ConditionJoin.And}
                    checked={Number(watch(`view.conditions.${i}.join`)) === ConditionJoin.And}
                    onClick={() => handleJoin(ConditionJoin.And)}
                  />
                  <div data-join={'and'}>And</div> */}
                <Radio
                  checked={
                    watch(`view.conditions.${nestedIndex}.join`) === ConditionJoin.And
                  }
                  onChange={() => {
                    // setValue('view.conditions.${i}.join', ConditionJoin.And);
                    // handleAddConditionButton();
                  }}
                  ref={joinField.ref}
                >
                  <div data-join={'and'}>And</div>
                </Radio>
              </label>
              <label
                className={classNames(`join`)}
                role="presentation"
                onClick={(e) => {
                  setValue(`view.conditions.${nestedIndex}.join`, ConditionJoin.Or, {
                    shouldDirty: true,
                  });

                  if (fields.length === 1) {
                    handleAddConditionButton(e);
                  }
                }}
              >
                {/* <input
                    {...register(`view.conditions.${i}.join`, { valueAsNumber: true })}
                    type="radio"
                    value={ConditionJoin.Or}
                    checked={Number(watch(`view.conditions.${i}.join`)) === ConditionJoin.Or}
                    onClick={() => handleJoin(ConditionJoin.Or)}
                  />
                  <div data-join={'or'}>Or</div> */}
                <Radio
                  checked={
                    watch(`view.conditions.${nestedIndex}.join`) === ConditionJoin.Or
                  }
                  onChange={() => {
                    // setValue('view.conditions.${i}.join', ConditionJoin.Or);
                    // handleAddConditionButton();
                  }}
                  ref={joinField.ref}
                >
                  <div data-join={'or'}>Or</div>
                </Radio>
              </label>
            </div>
          ) : (
            watch(`view.conditions.${nestedIndex}.join`) !== undefined &&
            i < CONDITION_LIMIT - 1 && (
              <div
                className={classNames(`joinWrapper`, {
                  on: watch(`view.conditions.${nestedIndex}.join`) !== undefined,
                })}
              >
                <Button
                  shape="ghost"
                  className={classNames(`join button`, {
                    on: watch(`view.conditions.${nestedIndex}.join`) !== undefined,
                  })}
                  onClick={(e) => {
                    if (i < CONDITION_LIMIT - 1 && fields.length === i + 1) {
                      handleAddConditionButton(e);
                    }
                  }}
                >
                  {fields.length === i + 1 ? '+ Add' : ''}{' '}
                  {Number(watch(`view.conditions.${nestedIndex}.join`)) ===
                  ConditionJoin.And
                    ? 'And'
                    : 'Or'}
                </Button>
              </div>
            )
          )}
          {i > 0 ? (
            <div className="deleteBtn">
              <Button shape="ghost" onClick={() => handleDeleteButton(i)}>
                {t(`CONDITION_NODE_DELETE_CONDITION`)}
              </Button>
            </div>
          ) : (
            <div className="deleteBtn"></div>
          )}
        </div>
      ))}
    </>
  );
};
