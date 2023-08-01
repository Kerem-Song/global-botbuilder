import { Button, Collapse } from '@components';
import { FormItem, Radio } from '@components/data-entry';
import { Col, Row } from '@components/layout';
import { useHistoryViewerMatch, useNodeEditSave, usePage, useSystemModal } from '@hooks';
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
  const { confirm } = useSystemModal();
  const {
    getValues,
    setValue,
    control,
    watch,
    reset,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IResetVariableCardView>>();

  const isHistoryViewer = useHistoryViewerMatch();
  const { field } = useController({
    name: `nextNodeId`,
    control,
  });

  const values = getValues();

  const {
    fields: parametersFields,
    append,
    remove,
  } = useFieldArray({
    name: `view.parameters`,
    control,
  });

  const { field: resetAll } = useController({ name: 'view.resetAll', control });

  const handleAddVariableButton = () => {
    append({
      name: '',
      value: '',
    });
  };

  const handleDeleteVariableButton = (index: number) => {
    remove(index);
  };

  console.log('@values in reset variable edit:', values);

  useEffect(() => {
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

  const handleResetRadio = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const result = await confirm({
      title: t(`RESET_VARIABLE_NODE_CHANGE_SETTING`),
      description: (
        <>
          <span style={{ whiteSpace: 'pre-line' }}>
            {t(`RESET_VARIABLE_NODE_CHANGE_SETTING_DESC`)}
          </span>
        </>
      ),
    });

    if (result) {
      remove();
    } else {
      setValue('view.resetAll', 'select');
    }
  };

  return (
    <>
      <Collapse label={t(`RESET_VARIABLE_NODE_SET`)} useSwitch={false}>
        <p className="m-b-20">{t(`RESET_VARIABLE_NODE_SET`)}</p>
        <FormItem error={errors.view?.resetAll}>
          <Row justify="space-between" className="m-b-20">
            <Col span={12} className="radioContainer">
              <Radio
                checked={watch('view.resetAll') === 'all'}
                onChange={(e) => {
                  resetAll.onChange(e);
                  if (watch(`view.parameters`)?.length) {
                    handleResetRadio(e);
                  }
                }}
                ref={resetAll.ref}
                value={'all'}
              >
                <span>{t(`RESET_VARIABLE_NODE_RESET_ALL`)}</span>
              </Radio>
            </Col>
            <Col span={12} className="radioContainer">
              <Radio
                checked={watch('view.resetAll') === 'select'}
                onChange={(e) => {
                  resetAll.onChange(e);
                  if (!parametersFields.length) {
                    handleAddVariableButton();
                  }
                }}
                ref={resetAll.ref}
                value={'select'}
              >
                <span>{t(`RESET_VARIABLE_NODE_RESET_SELECT`)}</span>
              </Radio>
            </Col>
          </Row>
        </FormItem>
        {parametersFields?.length > 0 && (
          <>
            <div className="m-b-15">
              <p className="m-b-8">{t(`RESET_VARIABLE_NODE_SELECT_VARIABLES`)}</p>
              {parametersFields.map((item, i) => (
                <div key={item.id}>
                  <Row gap={4} justify="space-between">
                    <Col span={21}>
                      <FormItem error={errors.view?.parameters?.[i]?.name}>
                        <ParameterSelector
                          placeholder={t(`PARAMETER_SET_VARIABLE_PLACEHOLDER`)}
                          control={control}
                          path={`view.parameters.${i}.name`}
                          readOnly={isHistoryViewer}
                          maxLength={125}
                          isDisabled={watch('view.resetAll') === 'all'}
                        />
                      </FormItem>
                    </Col>
                    <Col span={3}>
                      <Button
                        shape="ghost"
                        className="icDelete"
                        onClick={() => handleDeleteVariableButton(i)}
                        disabled={watch('view.resetAll') === 'all'}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
            <div className="m-b-8">
              <Button
                className="addBtn"
                shape="ghost"
                onClick={handleAddVariableButton}
                disabled={watch('view.resetAll') === 'all'}
              >
                + {t(`RESET_VARIABLE_NODE_ADD_VARIABLE`)}
              </Button>
            </div>
          </>
        )}
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
