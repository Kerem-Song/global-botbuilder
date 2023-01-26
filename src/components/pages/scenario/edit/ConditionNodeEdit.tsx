import { Button, Input } from '@components';
import { Divider, Space } from '@components/layout';
import { useRootState, useScenarioClient } from '@hooks';
import { IConditionItem } from '@models/interfaces/res/IGetFlowRes';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
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
  const { register, getValues, control } = useFormContext();
  const values = getValues();

  console.log('value.view in condition node edit', values.view);

  const { fields, append, remove } = useFieldArray({
    name: 'operator',
    control,
  });

  // const { field: operatorField } = useController({
  //   name: `view.items.${index}.operator`,
  //   control,
  // });

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

  // const handleRemoveButton = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
  //   e.preventDefault();
  //   remove(index);
  // };

  // const handleAddConditionButton = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   if (fields.length < 3) {
  //     append({
  //       op1: '',
  //       operator: '',
  //       op2: '',
  //     });
  //   } else {
  //     //modal alert
  //   }
  // };
  return (
    <>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space direction="vertical">
            <span className="label">Setting Conditions</span>
            <Divider />
            <div>
              <span>Setting Conditions</span>
              <span className="required">*</span>
            </div>

            {values.view &&
              values.view.items &&
              values.view.items.map((item: IConditionItem, i: number) => (
                <Space direction="vertical" key={i}>
                  <Input
                    {...register(`view.items[${i}].op1`)}
                    value={item.op1 || ''}
                    placeholder="변수명을 입력해주세요"
                  />
                  <OperatorSelector index={i} />

                  <Input
                    {...register(`view.items[${i}].op2`)}
                    value={item.op2 || ''}
                    placeholder="변수명을 입력해주세요"
                  />

                  {values.view.join !== undefined && i === 0 ? (
                    <div className="joinWrapper">
                      <label
                        className={classNames(`join`, {
                          on: parseInt(values.view.join),
                        })}
                        role="presentation"
                      >
                        <input {...register(`view.join`)} type="radio" value={1} />
                        <span>And</span>
                      </label>
                      <label
                        className={classNames(`join`, {
                          on: !parseInt(values.view.join),
                        })}
                        role="presentation"
                      >
                        <input {...register(`view.join`)} type="radio" value={0} />
                        <span>Or</span>
                      </label>
                    </div>
                  ) : (
                    values.view.join !== undefined &&
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
                        >
                          {parseInt(values.view.join) ? 'And' : 'Or'}
                        </Button>
                      </div>
                    )
                  )}
                </Space>
              ))}
          </Space>
        </div>
      </div>
      <div className="node-item-wrap">
        <div className="m-b-8">
          <Space style={{ alignItems: 'center' }}>
            <span className="label">Message connection</span>
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
          </Space>

          <Divider />
        </div>
        <div className="m-b-8">
          <Space direction="vertical">
            <span className="label">else</span>
            <div>
              <span className="label">Next message </span>
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
