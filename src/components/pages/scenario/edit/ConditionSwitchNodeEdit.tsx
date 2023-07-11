import { Button, Collapse, Divider, FormItem, Radio, Space } from '@components';
import { useNodeEditSave, usePage, useRootState, useScenarioClient } from '@hooks';
import { ConditionJoin, ConditionOperator, IGNodeEditModel } from '@models';
import { IConditionView, ISwitchView } from '@models/interfaces/res/IGetFlowRes';
import { ID_GEN, ID_TYPES } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { ConditionSwitchConditions } from './ConditionSwitchConditions';
import { OperatorSelector } from './OperatorSelector';
import { SelectNode } from './SelectNode';
import { VariableSelector } from './VariableSelector';
interface IReactSelect {
  value: string;
  label: string;
}

export const ConditionSwitchNodeEdit = () => {
  useNodeEditSave();
  const CONDITION_LIMIT = 13;
  const { t, tc } = usePage();
  const {
    getValues,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ISwitchView>>();
  const values = getValues();
  console.log('value.view in condition node edit', values.view);

  const [join, setJoin] = useState<ConditionJoin>();

  const { fields, append, remove } = useFieldArray({
    name: `view.conditions`,
    control,
  });

  const selectedScenario = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );
  const [scenario, setScenario] = useState<IReactSelect[]>([]);

  const { getCachedScenario } = useScenarioClient();
  const data = getCachedScenario(selectedScenario?.id);

  const { field: joinField } = useController({ name: 'view.conditions.0.join', control });

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
    if (fields.length < CONDITION_LIMIT) {
      append(nodeDefaultHelper.createDefaultConditions());
    } else {
      //modal alert
      console.log('13개까지 가능');
    }
  };

  return (
    <>
      <Collapse label={t(`CONDITION_NODE_SET_CONDITION`)} useSwitch={false}>
        <div className="m-b-8">
          <span>{t(`CONDITION_NODE_SET_CONDITION`)} </span>
          <span className="required">*</span>
        </div>

        {fields.map((condition, i) => (
          <Space direction="vertical" key={condition.id}>
            <ConditionSwitchConditions nestedIndex={i} />
            <div className="m-b-8">
              <Space direction="vertical">
                <div>
                  <span className="label">{t(`SET_CONNECT_NEXT_NODE`)} </span>
                  <span className="required">*</span>
                </div>
                <FormItem error={errors.view?.conditions?.[i]?.trueThenNextNodeId}>
                  <SelectNode
                    fieldName={`view.conditions.${i}.trueThenNextNodeId`}
                    nodeId={getValues().id}
                    error={errors.view?.conditions?.[i]?.trueThenNextNodeId}
                  />
                </FormItem>
              </Space>
            </div>
            {watch(`view.conditions.${i}.join`) !== undefined && i === 0 ? (
              <div className="joinWrapper">
                <label
                  className={classNames(`join`)}
                  role="presentation"
                  onClick={(e) => {
                    setValue(`view.conditions.${i}.join`, ConditionJoin.And, {
                      shouldDirty: true,
                    });
                    handleAddConditionButton(e);
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
                    checked={watch(`view.conditions.${i}.join`) === ConditionJoin.And}
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
                    setValue(`view.conditions.${i}.join`, ConditionJoin.Or, {
                      shouldDirty: true,
                    });
                    handleAddConditionButton(e);
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
                    checked={watch(`view.conditions.${i}.join`) === ConditionJoin.Or}
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
              watch(`view.conditions.${i}.join`) !== undefined &&
              i < CONDITION_LIMIT - 1 && (
                <div
                  className={classNames(`joinWrapper`, {
                    on: watch(`view.conditions.${i}.join`) !== undefined,
                  })}
                >
                  <Button
                    shape="ghost"
                    className={classNames(`join button`, {
                      on: watch(`view.conditions.${i}.join`) !== undefined,
                    })}
                    onClick={(e) => {
                      if (i < CONDITION_LIMIT - 1 && fields.length === i + 1) {
                        handleAddConditionButton(e);
                      }
                    }}
                  >
                    {fields.length === i + 1 ? '+ Add' : ''}{' '}
                    {Number(watch(`view.conditions.${i}.join`)) === ConditionJoin.And
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
          </Space>
        ))}

        <div className="node-item-wrap collapse">
          <Divider />
          <div className="m-b-8">
            <Space direction="vertical">
              <span className="label">else</span>
              <div>
                <span>{t(`SET_NEXT_MESSAGE`)} </span>
              </div>
              <FormItem error={errors.view?.defaultNextNodeId}>
                <SelectNode
                  fieldName={'view.defaultNextNodeId'}
                  nodeId={getValues().id}
                  error={errors.view?.defaultNextNodeId}
                />
              </FormItem>
            </Space>
          </div>
        </div>
      </Collapse>
    </>
  );
};
