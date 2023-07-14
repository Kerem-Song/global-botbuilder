import { Button, Collapse, FormItem, Space } from '@components';
import { useHistoryViewerMatch, useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { ISwitchView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { SwitchNodeCarousel } from '../switchNodeEditCarousel';
import { SelectNode } from './SelectNode';
import { SwitchConditions } from './SwitchConditions';

export const SwitchNodeEdit = () => {
  useNodeEditSave();
  const [current, setCurrent] = useState(0);
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
  const isHistoryViewer = useHistoryViewerMatch();
  console.log('value.view in condition node edit', values.view);

  const { fields, append, remove } = useFieldArray({
    name: `view.conditions`,
    control,
  });

  const { field: joinField } = useController({ name: 'view.conditions.0.join', control });

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  const handleAddConditionButton = (e: React.MouseEvent<HTMLButtonElement>) => {
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
      {values.view && (
        <SwitchNodeCarousel
          conditionsId={values.view.id}
          addCarousel={handleAddConditionButton}
        >
          {fields.map((condition, i) => (
            <Collapse label={`Case ${i + 1}`} useSwitch={false} key={condition.id}>
              {i > 0 && (
                <div className="deleteBtn">
                  <Button shape="ghost" onClick={() => handleDeleteButton(i)}>
                    {t(`CONDITION_NODE_CASE_DELETE`)}
                  </Button>
                </div>
              )}
              {/* <Space direction="vertical"> */}
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
                </Space>
              </div>
              {/* </Space> */}
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
