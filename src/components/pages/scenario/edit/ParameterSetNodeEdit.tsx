import { Button, Collapse, Divider, FormItem, Space } from '@components';
import { useHistoryViewerMatch, useNodeEditSave, usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IParameterSetView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ParameterSelector } from './ParameterSelector';
import { SelectNode } from './SelectNode';
import { VariableSelector } from './VariableSelector';

export const ParameterSetNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IParameterSetView>>();
  const isHistoryViewer = useHistoryViewerMatch();
  const values = getValues();
  const { fields, append, remove } = useFieldArray({
    name: 'view.parameters',
    control,
  });

  const handleAddButton = () => {
    // e.preventDefault();
    if (fields.length < 10) {
      append(nodeDefaultHelper.createDefaultParameterSetParams());
    } else {
      //modal alert
      console.log('10개까지 가능');
    }
  };

  const handleDeleteButton = (index: number) => {
    remove(index);
  };

  return (
    <div key={values.id}>
      <Collapse label={t(`PARAMETER_SET_LABEL`)} useSwitch={false}>
        {fields.map((item, i) => (
          <div key={item.id}>
            <Space direction="vertical" gap={12}>
              <Space direction="vertical" gap={8}>
                <div>
                  <span className="subLabel">{t(`PARAMETER_SET_VARIABLE`)} </span>
                  <span className="required">*</span>
                </div>
                <FormItem
                  error={
                    errors.view &&
                    errors.view.parameters &&
                    errors.view.parameters[i]?.name
                  }
                >
                  <ParameterSelector
                    control={control}
                    path={`view.parameters.${i}.name`}
                    placeholder={t('PARAMETER_SET_VARIABLE_PLACEHOLDER')}
                    maxLength={50}
                    readOnly={isHistoryViewer}
                  />
                </FormItem>
              </Space>
              <Space direction="vertical" gap={8}>
                <div>
                  <span className="subLabel">{t(`PARAMETER_SET_VALUE_TO_STORE`)} </span>
                  <span className="required">*</span>
                </div>
                <FormItem
                  error={
                    errors.view &&
                    errors.view.parameters &&
                    errors.view.parameters[i]?.value
                  }
                >
                  <VariableSelector
                    placeholder={t(`PARAMETER_SET_VALUE_TO_STORE_PLACEHOLDER`)}
                    control={control}
                    path={`view.parameters.${i}.value`}
                    maxLength={2000}
                    readOnly={isHistoryViewer}
                  />
                </FormItem>
              </Space>
              {i > 0 && (
                <Button
                  shape="ghost"
                  className="deleteBtn"
                  onClick={() => handleDeleteButton(i)}
                >
                  {t(`PARAMETER_SET_DELETE_BUTTON`)}
                </Button>
              )}
            </Space>
            {fields.length !== i + 1 && (
              <Divider
                style={i === 0 ? { margin: '32px 0' } : { margin: '0 0 32px 0' }}
              />
            )}
          </div>
        ))}

        {fields.length < 10 && (
          <Button
            shape="ghost"
            className="addBtn"
            onClick={handleAddButton}
            style={fields.length === 1 ? { marginTop: '32px' } : {}}
          >
            <span>+ {t(`PARAMETER_SET_ADD_BUTTON`)}</span>
          </Button>
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
    </div>
  );
};
