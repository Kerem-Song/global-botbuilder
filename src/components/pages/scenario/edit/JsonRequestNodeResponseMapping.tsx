import { Button, Collapse, Divider, FormItem, Space } from '@components';
import { usePage } from '@hooks';
import { IGNodeEditModel } from '@models';
import { IJsonRequestView } from '@models/interfaces/res/IGetFlowRes';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { InputTextAreaWithTitleCounter } from './InputTextareaWithTitleCounter';
import { ParameterSelector } from './ParameterSelector';

export const JsonRequestNodeResponseMapping = () => {
  const { t, isReadOnly } = usePage();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IJsonRequestView>>();

  const {
    fields: resMappingField,
    append: resMappingAppend,
    remove: resMappingRemove,
  } = useFieldArray({
    name: `view.responseMapping`,
    control,
  });

  const handleAddResMappingButton = () => {
    resMappingAppend({ key: '', value: '' });
  };

  const handleDeleteResMappingButton = (index: number) => {
    resMappingRemove(index);
  };

  return (
    <Collapse label={'Response Mapping'} useSwitch={false}>
      {resMappingField.map((res, i) => (
        <div key={res.id}>
          <Space direction="vertical" key={res.id} gap={12}>
            <FormItem error={errors.view?.responseMapping?.[i]?.key}>
              <InputTextAreaWithTitleCounter
                label="Json Path"
                placeholder={t(
                  `API_REQUEST_RESPONSE_MAPPING_JSON_PATH_INPUT_PLACEHOLDER`,
                )}
                {...register(`view.responseMapping.${i}.key`)}
                readOnly={isReadOnly}
                className="m-b-12"
                maxLength={20000}
                isLight={true}
              />
            </FormItem>
            <div>
              <p className="subLabel m-b-12">Set to</p>
              <p className="subLabel m-b-8">variable</p>

              <FormItem error={errors.view?.responseMapping?.[i]?.value}>
                <ParameterSelector
                  control={control}
                  path={`view.responseMapping.${i}.value`}
                  placeholder={t('PARAMETER_SET_VARIABLE_PLACEHOLDER')}
                  readOnly={isReadOnly}
                  maxLength={50}
                />
              </FormItem>
            </div>
            <Button
              shape="ghost"
              className="deleteBtn"
              onClick={() => handleDeleteResMappingButton(i)}
            >
              {t(`API_REQUEST_RESPONSE_MAPPING_DELETE`)}
            </Button>
          </Space>
          {resMappingField.length !== i + 1 && (
            <Divider style={{ margin: '0 0 32px 0' }} />
          )}
        </div>
      ))}

      <div className="apiFieldAddBtn m-b-12">
        <Button className="addBtn" shape="ghost" onClick={handleAddResMappingButton}>
          + {t(`API_REQUEST_RESPONSE_MAPPING_ADD`)}
        </Button>
      </div>
    </Collapse>
  );
};
