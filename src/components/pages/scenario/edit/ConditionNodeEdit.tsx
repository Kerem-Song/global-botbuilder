import { Button, Collapse, Divider, FormItem, Radio, Space } from '@components';
import { useNodeEditSave, usePage, useRootState, useScenarioClient } from '@hooks';
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
  useNodeEditSave();
  const { t, tc } = usePage();
  const {
    getValues,
    control,
    watch,
    setValue,
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

  const { field: joinField } = useController({ name: 'view.join', control });

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

  const handleAddConditionButton = (
    e: React.MouseEvent<HTMLLabelElement | HTMLButtonElement>,
  ) => {
    console.log('handle add condition btn');
    e.preventDefault();
    if (fields.length < 5) {
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
      <Collapse label={t(`CONDITION_NODE_SET_CONDITION`)} useSwitch={false}>
        <div className="m-b-8">
          <span>{t(`CONDITION_NODE_SET_CONDITION`)} </span>
          <span className="required">*</span>
        </div>
        {fields.length === 0 && (
          <Space direction="vertical">
            <FormItem
              error={errors.view && errors.view.items && errors.view?.items[0]?.op1}
            >
              <VariableSelector
                placeholder={t(`INPUT_VARIABLE_PLACEHOLDER`)}
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
                placeholder={t(`INPUT_VARIABLE_PLACEHOLDER`)}
                control={control}
                path="view.items.0.op2"
              />
            </FormItem>

            <div className="joinWrapper">
              <label
                className={classNames(`join`)}
                role="presentation"
                onClick={(e) => {
                  setValue('view.join', ConditionJoin.And, { shouldDirty: true });
                  handleAddConditionButton(e);
                }}
              >
                {/* <input
                  {...register(`view.join`, { valueAsNumber: true })}
                  type="radio"
                  value={ConditionJoin.And}
                  onClick={() => {
                    handleJoin(ConditionJoin.And);
                    handleAddConditionButton();
                  }}
                /> */}
                <Radio
                  checked={watch(`view.join`) === ConditionJoin.And}
                  onChange={() => {
                    // setValue('view.join', ConditionJoin.And);
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
                  setValue('view.join', ConditionJoin.Or, { shouldDirty: true });
                  handleAddConditionButton(e);
                }}
              >
                {/* <input
                  {...register(`view.join`, { valueAsNumber: true })}
                  type="radio"
                  value={ConditionJoin.Or}
                  onClick={() => {
                    handleJoin(ConditionJoin.Or);
                    handleAddConditionButton();
                  }}
                />
                <div data-join={'or'}>Or</div> */}
                <Radio
                  checked={watch(`view.join`) === ConditionJoin.Or}
                  onChange={() => {
                    // setValue('view.join', ConditionJoin.Or);
                    // handleAddConditionButton();
                  }}
                  ref={joinField.ref}
                >
                  <div data-join={'or'}>Or</div>
                </Radio>
              </label>
            </div>
          </Space>
        )}
        {fields.map((item, i) => (
          <Space direction="vertical" key={item.id}>
            <FormItem
              error={errors.view && errors.view.items && errors.view.items[i]?.op1}
            >
              <VariableSelector
                placeholder={t(`INPUT_VARIABLE_PLACEHOLDER`)}
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
                placeholder={t(`INPUT_VARIABLE_PLACEHOLDER`)}
                control={control}
                path={`view.items.${i}.op2`}
              />
            </FormItem>

            {watch(`view.join`) !== undefined && i === 0 ? (
              <div className="joinWrapper">
                <label
                  className={classNames(`join`)}
                  role="presentation"
                  onClick={(e) => {
                    setValue('view.join', ConditionJoin.And, { shouldDirty: true });
                    handleAddConditionButton(e);
                  }}
                >
                  {/* <input
                    {...register(`view.join`, { valueAsNumber: true })}
                    type="radio"
                    value={ConditionJoin.And}
                    checked={Number(watch(`view.join`)) === ConditionJoin.And}
                    onClick={() => handleJoin(ConditionJoin.And)}
                  />
                  <div data-join={'and'}>And</div> */}
                  <Radio
                    checked={watch(`view.join`) === ConditionJoin.And}
                    onChange={() => {
                      // setValue('view.join', ConditionJoin.And);
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
                    setValue('view.join', ConditionJoin.Or, { shouldDirty: true });
                    handleAddConditionButton(e);
                  }}
                >
                  {/* <input
                    {...register(`view.join`, { valueAsNumber: true })}
                    type="radio"
                    value={ConditionJoin.Or}
                    checked={Number(watch(`view.join`)) === ConditionJoin.Or}
                    onClick={() => handleJoin(ConditionJoin.Or)}
                  />
                  <div data-join={'or'}>Or</div> */}
                  <Radio
                    checked={watch(`view.join`) === ConditionJoin.Or}
                    onChange={() => {
                      // setValue('view.join', ConditionJoin.Or);
                      // handleAddConditionButton();
                    }}
                    ref={joinField.ref}
                  >
                    <div data-join={'or'}>Or</div>
                  </Radio>
                </label>
              </div>
            ) : (
              watch(`view.join`) !== undefined &&
              i < 4 && (
                <div
                  className={classNames(`joinWrapper`, {
                    on: watch(`view.join`) !== undefined,
                  })}
                >
                  <Button
                    shape="ghost"
                    className={classNames(`join button`, {
                      on: watch(`view.join`) !== undefined,
                    })}
                    onClick={(e) => {
                      if (i < 4 && fields.length === i + 1) {
                        handleAddConditionButton(e);
                      }
                    }}
                  >
                    {fields.length === i + 1 ? '+ Add' : ''}{' '}
                    {Number(watch(`view.join`)) === ConditionJoin.And ? 'And' : 'Or'}
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
          </Space>
        ))}

        <div className="node-item-wrap collapse">
          <div className="m-b-8">
            <Space direction="vertical">
              <div>
                <span className="label">{t(`SET_CONNECT_NEXT_NODE`)} </span>
                <span className="required">*</span>
              </div>
              <FormItem error={errors.view?.trueThenNextNodeId}>
                <SelectNode
                  fieldName={'view.trueThenNextNodeId'}
                  nodeId={getValues().id}
                  error={errors.view?.trueThenNextNodeId}
                />
              </FormItem>
            </Space>

            <Divider />
          </div>
          <div className="m-b-8">
            <Space direction="vertical">
              <span className="label">else</span>
              <div>
                <span>{t(`SET_NEXT_MESSAGE`)} </span>
              </div>
              <FormItem error={errors.view?.falseThenNextNodeId}>
                <SelectNode
                  fieldName={'view.falseThenNextNodeId'}
                  nodeId={getValues().id}
                  error={errors.view?.falseThenNextNodeId}
                />
              </FormItem>
            </Space>
          </div>
        </div>
      </Collapse>
    </>
  );
};
