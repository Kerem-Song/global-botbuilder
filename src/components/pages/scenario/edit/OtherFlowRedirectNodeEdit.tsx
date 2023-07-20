import { FormItem } from '@components/data-entry';
import { Space } from '@components/layout';
import { useNodeEditSave, usePage } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IGNodeEditModel, IReactSelect } from '@models';
import { IOtherFlowRedirectView } from '@models/interfaces/res/IGetFlowRes';
import { getReactSelectStyle } from '@modules';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

export const OtherFlowRedirectNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const [scenarioList, setScenarioList] = useState<IReactSelect[]>([
    { value: '', label: t(`SET_OPTION_NULL`) },
  ]);
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
  const {
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IOtherFlowRedirectView>>();
  const reactSelectStyle = getReactSelectStyle({});
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
      setScenarioList([
        ...scenarioList.concat(
          data?.map((item) => ({
            value: item.firstNodeId,
            label: item.alias,
          })),
        ),
      ]);
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
              placeholder={t(`SET_OPTION_NULL`)}
              styles={reactSelectStyle}
              defaultValue={scenarioList.find((item) => item.value === values.nextNodeId)}
              value={scenarioList.find((item) => item.value === field.value)}
              onChange={(options: any) => field.onChange(options?.value)}
              menuPortalTarget={document.body}
            />
          </FormItem>
        </Space>
      </div>
    </div>
  );
};
