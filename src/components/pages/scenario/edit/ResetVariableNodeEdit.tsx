import { Button, Collapse } from '@components';
import { FormItem } from '@components/data-entry';
import { Col, Row } from '@components/layout';
import { useHistoryViewerMatch, useNodeEditSave, usePage } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IGNodeEditModel, IReactSelect } from '@models';
import { IResetVariableCardView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { ParameterSelector } from './ParameterSelector';
import { SelectNode } from './SelectNode';

export const ResetVariableNodeEdit = () => {
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
  } = useFormContext<IGNodeEditModel<IResetVariableCardView>>();

  const isHistoryViewer = useHistoryViewerMatch();
  const { field } = useController({
    name: `nextNodeId`,
    control,
  });

  const values = getValues();

  const {
    fields: variablesFields,
    append,
    remove,
  } = useFieldArray({
    name: `view.variables`,
    control,
  });

  const handleAddVariableButton = () => {
    append({
      key: '',
      value: '',
    });
  };

  const handleDeleteVariableButton = (index: number) => {
    remove(index);
  };

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
    <>
      <Collapse label={t(`RESET_VARIABLE_NODE_LABEL`)} useSwitch={false}>
        {variablesFields.map((item, i) => (
          <div key={item.id}>
            <Row gap={2} justify="space-between">
              <Col span={21}>
                <FormItem error={errors.view?.variables?.[i]?.value}>
                  <ParameterSelector
                    placeholder={t(`PARAMETER_SET_VARIABLE_PLACEHOLDER`)}
                    control={control}
                    path={`view.variables.${i}.value`}
                    readOnly={isHistoryViewer}
                    maxLength={50}
                  />
                </FormItem>
              </Col>
              <Col span={3}>
                <Button
                  shape="ghost"
                  className="icDelete"
                  onClick={() => handleDeleteVariableButton(i)}
                />
              </Col>
            </Row>
          </div>
        ))}
        <div className="apiFieldAddBtn m-b-8">
          <Button className="addBtn" shape="ghost" onClick={handleAddVariableButton}>
            + Variable
          </Button>
        </div>
      </Collapse>

      <Collapse label={t(`SET_NEXT_NODE_LABEL`)} useSwitch={false}>
        <div className="m-b-8">
          <span className="subLabel">{t(`SET_CONNECT_NEXT_NODE`)} </span>
        </div>
        <FormItem error={errors.nextNodeId}>
          <SelectNode
            fieldName={'nextNodeId'}
            nodeId={getValues().id}
            error={errors.nextNodeId}
          />
        </FormItem>
      </Collapse>
    </>
  );
};
