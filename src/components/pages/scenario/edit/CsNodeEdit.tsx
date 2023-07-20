import { FormItem } from '@components/data-entry';
import { Space } from '@components/layout';
import { useNodeEditSave, usePage } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IGNodeEditModel, IReactSelect } from '@models';
import { ICsCardView, IOtherFlowRedirectView } from '@models/interfaces/res/IGetFlowRes';
import { getReactSelectStyle } from '@modules';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

export const CsNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const [inquiryTypeList, setInquiryTypeList] = useState<IReactSelect[]>([
    { value: '', label: t(`SET_OPTION_NULL`) },
  ]);
  // const { getInquiryTypeList } = useInquirySelectClient();
  // const { data } = getInquiryTypeList();
  const {
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ICsCardView>>();
  const reactSelectStyle = getReactSelectStyle({});
  const { field } = useController({
    name: `view.inquiryType`,
    control,
  });

  const values = getValues();

  console.log('@values in cs node edit:', values);
  // console.log('data in ofr', data);

  // useEffect(() => {
  //   if (data) {
  //     setInquiryTypeList([
  //       ...inquiryTypeList.concat(
  //         data?.map((item) => ({
  //           value: item.inquiryType,
  //           label: item.inquiryType,
  //         })),
  //       ),
  //     ]);
  //   }
  // }, [data]);

  return (
    <div className="node-item-wrap">
      <div className="m-b-8">
        <Space direction="vertical">
          <div className="m-b-8">
            <span className="subLabel">{t(`CS_NODE_SET_INQUIRY`)} </span>
            <span className="required">*</span>
          </div>
          <FormItem error={errors.nextNodeId}>
            <Select
              className="react-selector"
              {...field}
              options={inquiryTypeList}
              placeholder={t(`SET_OPTION_NULL`)}
              styles={reactSelectStyle}
              defaultValue={inquiryTypeList.find(
                (item) => item.value === values.nextNodeId,
              )}
              value={inquiryTypeList.find((item) => item.value === field.value)}
              onChange={(options: any) => field.onChange(options?.value)}
              menuPortalTarget={document.body}
            />
          </FormItem>
        </Space>
      </div>
    </div>
  );
};
