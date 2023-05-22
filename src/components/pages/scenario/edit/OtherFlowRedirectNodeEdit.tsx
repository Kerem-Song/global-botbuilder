import { FormItem } from '@components/data-entry';
import { Space } from '@components/layout';
import { useNodeEditSave, usePage } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IGNodeEditModel, IReactSelect } from '@models';
import { IOtherFlowRedirectView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { reactSelectStyle } from './ButtonTypeSelector';

export const OtherFlowRedirectNodeEdit = () => {
  useNodeEditSave();
  const [scenarioList, setScenarioList] = useState<IReactSelect[]>([]);
  const { t } = usePage();
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
  const {
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IOtherFlowRedirectView>>();
  const { field } = useController({
    name: `nextNodeId`,
    control,
  });

  const values = getValues();

  console.log('values in other flow redirect node edit:', values);
  console.log('data in ofr', data);

  useEffect(() => {
    console.log('###########################', data);
    if (data) {
      setScenarioList(
        data?.map((item) => ({
          label: item.alias,
          value: item.firstNodeId,
        })),
      );
    }
  }, [data]);

  return (
    <div className="node-item-wrap">
      <div className="m-b-8">
        <Space direction="vertical">
          <div className="m-b-8">
            <span className="subLabel">{t(`OTHER_FLOW_REDIRECT_NODE_SET`)} </span>
            <span className="required">*</span>
          </div>
          <FormItem error={errors.nextNodeId}>
            <Select
              className="react-selector"
              {...field}
              options={scenarioList}
              styles={reactSelectStyle}
              defaultValue={scenarioList.find((item) => item.value === values.nextNodeId)}
              value={scenarioList.find((item) => item.value === field.value)}
              onChange={(options: any) => field.onChange(options?.value)}
            />
          </FormItem>
        </Space>
      </div>
    </div>
  );
};
