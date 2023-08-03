import { Collapse, Divider, FormItem, Space } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { ISwitchView } from '@models/interfaces/res/IGetFlowRes';
import { CONDITIONS_LIMIT } from '@modules';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { SwitchNodeCarousel } from '../SwitchNodeCarousel';
import { SelectNode } from './SelectNode';
import { SwitchConditions } from './SwitchConditions';

export const SwitchNodeEdit = () => {
  useNodeEditSave();

  const { t } = usePage();
  const {
    getValues,
    control,
    watch,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ISwitchView>>();
  const values = getValues();

  console.log('value.view in condition node edit', values.view);

  const { fields, append, remove } = useFieldArray({
    name: `view.childrenViews`,
    control,
  });

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  const handleAddConditionButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('handle add condition btn');
    const join = watch(`view.childrenViews.0.join`);

    e.preventDefault();
    if (fields.length < CONDITIONS_LIMIT) {
      append(nodeDefaultHelper.createDefaultConditions(join));
    } else {
      //modal alert
      console.log('13개까지 가능');
    }
  };

  return (
    <>
      {values.view && (
        <SwitchNodeCarousel
          conditionsId={values.view.id}
          addCarousel={handleAddConditionButton}
          deleteCarousel={handleDeleteButton}
        >
          {fields.map((condition, i) => (
            <Collapse label={`Case ${i + 1}`} useSwitch={false} key={condition.id}>
              <SwitchConditions nestedIndex={i} />
              <Divider style={{ margin: '32px 0' }} />
              <div className="m-b-8">
                <Space direction="vertical">
                  <div>
                    <span className="label">{t(`SET_CONNECT_NEXT_NODE`)} </span>
                    <span className="required">*</span>
                  </div>
                  <FormItem error={errors.view?.childrenViews?.[i]?.trueThenNextNodeId}>
                    <SelectNode
                      fieldName={`view.childrenViews.${i}.trueThenNextNodeId`}
                      nodeId={getValues().id}
                      error={errors.view?.childrenViews?.[i]?.trueThenNextNodeId}
                    />
                  </FormItem>
                </Space>
              </div>
            </Collapse>
          ))}
        </SwitchNodeCarousel>
      )}
      <div className="node-item-wrap">
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
    </>
  );
};
