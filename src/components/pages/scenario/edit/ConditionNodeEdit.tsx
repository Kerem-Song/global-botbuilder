import { Button, FormItem, Input } from '@components';
import { Divider, Space } from '@components/layout';
import { usePage, useRootState, useScenarioClient } from '@hooks';
import {
  ConditionJoin,
  ConditionOperator,
  IGNodeEditModel,
  INode,
  INodeEditModel,
} from '@models';
import { IConditionItem, IConditionView } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

import { OperatorSelector } from './OperatorSelector';
interface IReactSelect {
  value: string;
  label: string;
}

const reactSelectStyle: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    alignItems: 'center',
    borderRadius: '8px',
    border: '1px solid #DCDCDC',
    borderColor: state.isFocused ? '#6b4eff' : '#e7e7e7',
    fontSize: '13px',
    width: '220px',
    ':hover': {
      borderColor: '#e7e7e7',
    },
    minHeight: '34px',
  }),

  dropdownIndicator: () => ({
    color: '#B5B4B4',
  }),
  indicatorsContainer: () => ({}),
  valueContainer: (provided) => ({
    ...provided,
    alignItems: 'center',
  }),
  placeholder: (provided) => ({
    ...provided,
    whiteSpace: 'nowrap',
    color: '#000',
  }),
  input: (provided) => ({
    ...provided,
    color: 'transparent',
    textShadow: '0 0 0 black',
  }),
  option: (provided) => ({
    ...provided,
    width: '100%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',

    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 400,
    color: '#757575',
    lineHeight: 1.5,
    backgroundColor: 'white',
    ':hover': {
      color: '#222222',
      backgroundColor: '#ECF2FF',
      borderRadius: '6px',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '13px',
    color: '#222222',
    overflow: 'unset',
    textOverflow: 'unset',
  }),
  menu: (provided) => ({
    ...provided,
    border: '1px solid #DCDCDC',
    borderRadius: '8px',
  }),
};

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

  const [join, setJoin] = useState<1 | 0>();

  const { fields, append, remove } = useFieldArray({
    name: `view.items`,
    control,
  });

  const { field: trueThenNextNodeIdField } = useController({
    name: `view.trueThenNextNodeId`,
    control,
  });

  const { field: falseThenNextNodeId } = useController({
    name: `view.falseThenNextNodeId`,
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

  const handleJoin = (join: 1 | 0) => {
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

  console.log('errors in condition node', errors);
  return (
    <>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space direction="vertical">
            <span className="label">Setting Conditions </span>
            <Divider />
            <div>
              <span>Setting Conditions </span>
              <span className="required">*</span>
            </div>
            {fields.length === 0 && (
              <Space direction="vertical">
                <FormItem
                  error={errors.view && errors.view.items && errors.view?.items[0]?.op1}
                >
                  <Input
                    {...register(`view.items.${0}.op1`)}
                    placeholder="변수명을 입력해주세요"
                  />
                </FormItem>

                <OperatorSelector index={0} />

                {errors.view && errors.view.items && errors.view.items[0]?.operator && (
                  <p className="error-message">
                    {errors.view?.items[0]?.operator.message}
                  </p>
                )}

                <Input
                  {...register(`view.items.${0}.op2`)}
                  placeholder="변수명을 입력해주세요"
                />

                {errors.view && errors.view.items && errors.view?.items[0]?.op2 && (
                  <p className="error-message">{errors.view?.items[0]?.op2.message}</p>
                )}
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
                <Input
                  {...register(`view.items.${i}.op1`)}
                  placeholder="변수명을 입력해주세요"
                />

                {errors.view && errors.view.items && errors.view?.items[i]?.op1 && (
                  <p className="error-message">{errors.view?.items[i]?.op1?.message}</p>
                )}
                <OperatorSelector index={i} />
                <p className="error-message">
                  {errors.view &&
                    errors.view.items &&
                    errors.view?.items[i]?.operator &&
                    errors.view?.items[i]?.operator?.message}
                </p>
                {/* <FormItem error={errors.view?.items[i].op2}> */}
                <Input
                  {...register(`view.items.${i}.op2`)}
                  placeholder="변수명을 입력해주세요"
                />
                {/* </FormItem> */}

                {errors.view && errors.view.items && errors.view?.items[i]?.op2 && (
                  <p className="error-message">{errors.view?.items[i]?.op2?.message}</p>
                )}
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
                    Delete
                  </Button>
                </div>
              </Space>
            ))}
          </Space>
        </div>
      </div>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space direction="vertical">
            <div>
              <span className="label">Message connection </span>
              <span className="required">*</span>
            </div>

            <Select
              {...trueThenNextNodeIdField}
              options={scenario}
              styles={reactSelectStyle}
              defaultValue={scenario[0]}
              value={scenario.find(
                (item) => item.value === trueThenNextNodeIdField.value,
              )}
              onChange={(options: any) =>
                trueThenNextNodeIdField.onChange(options?.value)
              }
            />
            {/* {errors.view && <div className="error-message">{errors.view}</div>} */}
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
            <Select
              {...falseThenNextNodeId}
              options={scenario}
              styles={reactSelectStyle}
              defaultValue={scenario[0]}
              value={scenario.find((item) => item.value === falseThenNextNodeId.value)}
              onChange={(options: any) => falseThenNextNodeId.onChange(options?.value)}
            />
          </Space>
        </div>
      </div>
    </>
  );
};
