import { FormItem } from '@components/data-entry';
import { Collapse } from '@components/general/Collapse';
import { Divider, Space } from '@components/layout';
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
      <Collapse label={'재질문 설정'} useSwitch={false}>
        <div className="m-b-8">
          <span className="subLabel">재질문 횟수 설정 </span>
          <span className="required">*</span>
        </div>
        <div className={classnames('input m-b-8', {})}>
          <Select
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
              <span className="label">재질문할 메시지 연결 </span>
              <span className="required">*</span>
            </div>
            <FormItem error={errors.view?.trueThenNextNodeId}>
              <SelectNode fieldName={'view.trueThenNextNodeId'} nodeId={getValues().id} />
            </FormItem>
          </Space>

          <Divider />
        </div>
        <div className="m-b-8">
          <Space direction="vertical">
            <div>
              <span>횟수 초과 메시지 연결 </span>
              <span className="required">*</span>
            </div>
            <FormItem error={errors.view?.falseThenNextNodeId}>
              <SelectNode
                fieldName={'view.falseThenNextNodeId'}
                nodeId={getValues().id}
              />
            </FormItem>
          </Space>
        </div>
      </Collapse>
    </>
  );
};
