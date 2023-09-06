import { Button, Collapse } from '@components';
import { FormItem, Radio } from '@components/data-entry';
import { Col, Row } from '@components/layout';
import { useHistoryViewerMatch, useNodeEditSave, usePage, useSystemModal } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IGNodeEditModel, IReactSelect } from '@models';
import { IParameterClearCardView } from '@models/interfaces/res/IGetFlowRes';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { ParameterSelector } from './ParameterSelector';
import { SelectNode } from './SelectNode';

export const ParameterClearNodeEdit = () => {
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
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IParameterClearCardView>>();

  const isHistoryViewer = useHistoryViewerMatch();

  const {
    fields: parametersFields,
    append,
    remove,
  } = useFieldArray({
    name: `view.parameters`,
    control,
  });

  const { field: isAll } = useController({ name: 'view.isAll', control });

  const handleAddVariableButton = () => {
    append({
      name: '',
    });
  };

  const handleDeleteVariableButton = (index: number) => {
    remove(index);
  };

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
      title: t(`PARAMETER_CLEAR_NODE_CHANGE_SETTING`),
      description: (
        <>
          <span style={{ whiteSpace: 'pre-line' }}>
            {t(`PARAMETER_CLEAR_NODE_CHANGE_SETTING_DESC`)}
          </span>
        </>
      ),
    });

    if (result) {
      remove();
    } else {
      setValue('view.isAll', false);
    }
  };

  return (
    <>
      <Collapse label={t(`PARAMETER_CLEAR_NODE_SET`)} useSwitch={false}>
        <p className="m-b-20">{t(`PARAMETER_CLEAR_NODE_SET`)}</p>
        <FormItem error={errors.view?.isAll}>
          <Row justify="space-between" className="m-b-20">
            <Col span={12} className="radioContainer">
              <Radio
                checked={watch('view.isAll') === true}
                onChange={(e) => {
                  isAll.onChange(e);
                  setValue('view.isAll', true, { shouldDirty: true });
                  if (watch(`view.parameters`)?.length) {
                    handleResetRadio(e);
                  }
                }}
                ref={isAll.ref}
              >
                <span>{t(`PARAMETER_CLEAR_NODE_RESET_ALL`)}</span>
              </Radio>
            </Col>
            <Col span={12} className="radioContainer">
              <Radio
                checked={watch('view.isAll') === false}
                onChange={(e) => {
                  isAll.onChange(e);
                  setValue('view.isAll', false, { shouldDirty: true });
                  if (!parametersFields.length) {
                    handleAddVariableButton();
                  }
                }}
                ref={isAll.ref}
              >
                <span>{t(`PARAMETER_CLEAR_NODE_RESET_SELECT`)}</span>
              </Radio>
            </Col>
          </Row>
        </FormItem>
        {watch('view.isAll') === false && parametersFields?.length > 0 && (
          <>
            <div className="m-b-15">
              <p className="m-b-12">{t(`PARAMETER_CLEAR_NODE_SELECT_VARIABLES`)}</p>
              {parametersFields.map((item, i) => (
                <div key={item.id}>
                  <Row gap={4} justify="space-between">
                    <Col span={21}>
                      <FormItem error={errors.view?.parameters?.[i]?.name}>
                        <ParameterSelector
                          placeholder={t(`INPUT_VARIABLE_PLACEHOLDER`)}
                          control={control}
                          path={`view.parameters.${i}.name`}
                          readOnly={isHistoryViewer}
                          maxLength={125}
                          isDisabled={watch('view.isAll') === true}
                        />
                      </FormItem>
                    </Col>
                    <Col span={3}>
                      <Button
                        shape="ghost"
                        className="icDelete"
                        onClick={() => handleDeleteVariableButton(i)}
                        disabled={watch('view.isAll') === true}
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
            <div className="m-b-12">
              <Button
                className="addBtn"
                shape="ghost"
                onClick={handleAddVariableButton}
                disabled={watch('view.isAll') === true}
              >
                + {t(`PARAMETER_CLEAR_NODE_ADD_VARIABLE`)}
              </Button>
            </div>
          </>
        )}
      </Collapse>

      <Collapse label={t(`SET_NEXT_NODE_LABEL`)} useSwitch={false}>
        <div className="m-b-12">
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
