import { Button, Collapse, Divider, FormItem, Radio, Space } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { ConditionJoin, IGNodeEditModel } from '@models';
import { ISwitchView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import classNames from 'classnames';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { SelectNode } from './SelectNode';
import { SwitchConditions } from './SwitchConditions';

export const SwitchNodeEdit = () => {
  useNodeEditSave();
  const CONDITION_LIMIT = 13;
  const { t } = usePage();
  const {
    getValues,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<ISwitchView>>();
  const values = getValues();
  console.log('value.view in condition node edit', values.view);

  const { fields, append, remove } = useFieldArray({
    name: `view.conditions`,
    control,
  });

  const { field: joinField } = useController({ name: 'view.conditions.0.join', control });

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  const handleAddConditionButton = (
    e: React.MouseEvent<HTMLLabelElement | HTMLButtonElement>,
  ) => {
    console.log('handle add condition btn');
    const join = watch(`view.conditions.0.join`);

    e.preventDefault();
    if (fields.length < CONDITION_LIMIT) {
      append(nodeDefaultHelper.createDefaultConditions(join));
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
          <Button small onClick={handleAddConditionButton}>
            조건 추가
          </Button>
        </div>

        {fields.map((condition, i) => (
          <Space direction="vertical" key={condition.id}>
            <SwitchConditions nestedIndex={i} />
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
                {i !== fields.length && <Divider />}
              </Space>
            </div>
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
