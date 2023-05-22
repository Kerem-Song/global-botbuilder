import { Collapse, Divider, FormItem, Space } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IRetryConditionView } from '@models/interfaces/res/IGetFlowRes';
import classnames from 'classnames';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { reactSelectStyle } from './ButtonTypeSelector';
import { SelectNode } from './SelectNode';

interface IReactSelect {
  value: number;
  label: string;
}

const countOptions: IReactSelect[] = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

export const RetryConditionNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const {
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IRetryConditionView>>();

  const { field } = useController({
    name: `view.count`,
    control,
  });

  const values = getValues();
  console.log('value.view in RetryConditionNodeEdit', values.view);

  return (
    <>
      <Collapse label={t(`RETRY_CONDITION_NODE_SET_RETRY_CONDITION`)} useSwitch={false}>
        <div className="m-b-8">
          <span className="subLabel">
            {t(`RETRY_CONDITION_NODE_SET_RETRY_CONDITION_COUNT`)}{' '}
          </span>
          <span className="required">*</span>
        </div>
        <div className={classnames('input m-b-8', {})}>
          <Select
            className="react-selector"
            {...field}
            options={countOptions}
            styles={reactSelectStyle}
            defaultValue={countOptions[0]}
            value={countOptions.find((item) => item.value === field.value)}
            onChange={(options: any) => field.onChange(options?.value)}
            isSearchable={false}
          />
        </div>
        <div className="m-b-8">
          <Space direction="vertical">
            <div>
              <span className="label">
                {t(`RETRY_CONDITION_NODE_SET_RETRY_CONDITION_TRUE_THEN_NEXT_MESSAGE`)}{' '}
              </span>
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
            <div>
              <span>
                {t(`RETRY_CONDITION_NODE_SET_RETRY_CONDITION_FALSE_THEN_NEXT_MESSAGE`)}
              </span>
              <span className="required">*</span>
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
      </Collapse>
    </>
  );
};
