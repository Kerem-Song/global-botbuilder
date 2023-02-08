import { Space } from '@components/layout';
import { useScenarioClient } from '@hooks';
import { IReactSelect } from '@models';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';
import Select from 'react-select';

import { reactSelectStyle } from './ButtonTypeSelector';

export const OtherFlowRedirectNodeEdit = () => {
  const [scenarioList, setScenarioList] = useState<IReactSelect[]>([]);

  const { botId } = useParams();
  const { getCachedScenarioList } = useScenarioClient();
  const data = getCachedScenarioList(botId);

  const { getValues, control } = useFormContext();
  const { field } = useController({
    name: `view.otherNodeId`,
    control,
  });

  const values = getValues();

  console.log('values in other flow redirect node edit:', values.view);
  console.log('data in ofr', data);

  useEffect(() => {
    if (data) {
      setScenarioList(data?.map((item) => ({ value: item.id, label: item.alias })));
    }
  }, [data]);

  return (
    <div className="node-item-wrap">
      <div className="m-b-8">
        <Space direction="vertical">
          <div className="m-b-8">
            <span className="subLabel">Other Flow Redirect 설정 </span>
            <span className="required">*</span>
          </div>
          <Select
            {...field}
            options={scenarioList}
            styles={reactSelectStyle}
            defaultValue={scenarioList.find(
              (item) => item.value === values.view.otherNodeId,
            )}
            value={scenarioList.find((item) => item.value === field.value)}
            onChange={(options: any) => field.onChange(options?.value)}
          />
        </Space>
      </div>
    </div>
  );
};
