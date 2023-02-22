import { Button, FormItem, Input } from '@components';
import { Collapse } from '@components/general/Collapse';
import { Divider, Space } from '@components/layout';
import { usePage, useRootState, useScenarioClient } from '@hooks';
import { ConditionJoin, ConditionOperator, IGNodeEditModel } from '@models';
import { IConditionView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { OperatorSelector } from './OperatorSelector';
import { SelectNode } from './SelectNode';
import { VariableSelector } from './VariableSelector';
interface IReactSelect {
  value: string;
  label: string;
}

export const ConditionNodeEdit = () => {
  const { t, tc } = usePage();
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IConditionView>>();
  const values = getValues();
  console.log('value.view in condition node edit', values.view);

  const [join, setJoin] = useState<ConditionJoin>();

  const { fields, append, remove } = useFieldArray({
    name: `view.items`,
    control,
  });

  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const [scenario, setScenario] = useState<IReactSelect[]>([]);

  const { getCachedScenario } = useScenarioClient();
  const data = getCachedScenario(selectedScenario?.id);

  useEffect(() => {
    if (data) {
      setScenario(data.nodes.map((item) => ({ value: item.alias, label: item.alias })));
    }
  }, [data]);

  const handleJoin = (join: ConditionJoin) => {
    setJoin(join);
  };

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  const handleAddConditionButton = () => {
    console.log('handle add condition btn');
    // e.preventDefault();
    if (fields.length < 6) {
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
      <Collapse label={'Setting Conditions'} useSwitch={false}>
        <div className="m-b-8">
          <span>Setting Conditions </span>
          <span className="required">*</span>
        </div>
        {fields.length === 0 && (
          <Space direction="vertical">
            <FormItem
              error={errors.view && errors.view.items && errors.view?.items[0]?.op1}
            >
              <VariableSelector
                placeholder="변수명을 입력해주세요"
                control={control}
                path="view.items.0.op1"
              />
            </FormItem>

            <OperatorSelector index={0} />

            {errors.view && errors.view.items && errors.view.items[0]?.operator && (
              <p className="error-message">{errors.view?.items[0]?.operator.message}</p>
            )}
            <FormItem
              error={errors.view && errors.view.items && errors.view.items[0]?.op2}
            >
              <VariableSelector
                placeholder="변수명을 입력해주세요"
                control={control}
                path="view.items.0.op2"
              />
            </FormItem>

            <div className="joinWrapper">
              <label className={classNames(`join`)}>
                <input
                  {...register(`view.join`, { valueAsNumber: true })}
                  type="radio"
                  value={ConditionJoin.And}
                  onClick={() => {
                    handleJoin(ConditionJoin.And);
                    handleAddConditionButton();
                  }}
                />
                <div data-join={'and'}>And</div>
              </label>
              <label className={classNames(`join`)} role="presentation">
                <input
                  {...register(`view.join`, { valueAsNumber: true })}
                  type="radio"
                  value={ConditionJoin.Or}
                  onClick={() => {
                    handleJoin(ConditionJoin.Or);
                    handleAddConditionButton();
                  }}
                />
                <div data-join={'or'}>Or</div>
              </label>
            </div>
          </Space>
        )}
        {fields.map((item, i) => (
          <Space direction="vertical" key={i}>
            <FormItem
              error={errors.view && errors.view.items && errors.view.items[i]?.op2}
            >
              <VariableSelector
                placeholder="변수명을 입력해주세요"
                control={control}
                path={`view.items.${i}.op1`}
              />
            </FormItem>

            <OperatorSelector index={i} />
            <p className="error-message">
              {errors.view &&
                errors.view.items &&
                errors.view?.items[i]?.operator &&
                errors.view?.items[i]?.operator?.message}
            </p>
            <FormItem
              error={errors.view && errors.view.items && errors.view?.items[i]?.op2}
            >
              <VariableSelector
                placeholder="변수명을 입력해주세요"
                control={control}
                path={`view.items.${i}.op2`}
              />
            </FormItem>

            {values.view?.join !== undefined && i === 0 ? (
              <div className="joinWrapper">
                <label className={classNames(`join`)}>
                  <input
                    {...register(`view.join`, { valueAsNumber: true })}
                    type="radio"
                    value={ConditionJoin.And}
                    checked={Number(values.view.join) === ConditionJoin.And}
                    onClick={() => handleJoin(ConditionJoin.And)}
                  />
                  <div data-join={'and'}>And</div>
                </label>
                <label className={classNames(`join`)} role="presentation">
                  <input
                    {...register(`view.join`, { valueAsNumber: true })}
                    type="radio"
                    value={ConditionJoin.Or}
                    checked={Number(values.view.join) === ConditionJoin.Or}
                    onClick={() => handleJoin(ConditionJoin.Or)}
                  />
                  <div data-join={'or'}>Or</div>
                </label>
              </div>
            ) : (
              values.view?.join !== undefined &&
              i < 5 && (
                <div
                  className={classNames(`joinWrapper`, {
                    on: values.view.join !== undefined,
                  })}
                >
                  <Button
                    shape="ghost"
                    className={classNames(`join button`, {
                      on: values.view.join !== undefined,
                    })}
                    onClick={(e) => {
                      if (i < 5) {
                        handleAddConditionButton();
                      }
                    }}
                  >
                    {Number(join) === ConditionJoin.And ? 'And' : 'Or'}
                  </Button>
                </div>
              )
            )}
            <div className="deleteBtn">
              <Button shape="ghost" onClick={() => handleDeleteButton(i)}>
                Delete Condition
              </Button>
            </div>
          </Space>
        ))}

        <div className="node-item-wrap collapse">
          <div className="m-b-8">
            <Space direction="vertical">
              <div>
                <span className="label">Message connection </span>
                <span className="required">*</span>
              </div>
              <SelectNode fieldName={'view.trueThenNextNodeId'} />
            </Space>

            <Divider />
          </div>
          <div className="m-b-8">
            <Space direction="vertical">
              <span className="label">else</span>
              <div>
                <span>Next message </span>
                <span className="required">*</span>
              </div>
              <SelectNode fieldName={'view.falseThenNextNodeId'} />
            </Space>
          </div>
        </div>
      </Collapse>
    </>
  );
};
