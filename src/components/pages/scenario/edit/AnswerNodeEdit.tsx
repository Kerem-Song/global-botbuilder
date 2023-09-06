import { Collapse, FormItem } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { useVariableSelectClient } from '@hooks/client/variableSelectClient';
import { IGNodeEditModel } from '@models';
import { IAnswerView } from '@models/interfaces/res/IGetFlowRes';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import classnames from 'classnames';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { ParameterSelector } from './ParameterSelector';
import { QuicksEdit } from './QuicksEdit';
import { SelectNode } from './SelectNode';
export interface IParameterSelect {
  readonly value?: string;
  readonly label?: string;
}

export const AnswerNodeEdit = () => {
  useNodeEditSave();
  const { t } = usePage();

  const {
    setValue,
    control,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext<IGNodeEditModel<IAnswerView>>();
  const use = watch('view.useUtteranceParam');
  const values = getValues();
  const {
    getVariableSelectListQuery: { data },
  } = useVariableSelectClient();

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'view.useUtteranceParam' && type === 'change') {
        if (!value.view?.useUtteranceParam) {
          setValue('view.utteranceParam', undefined, { shouldDirty: true });
          setValue('nextNodeId', undefined, { shouldDirty: true });
          if (value.view?.quicks?.length === 0) {
            setValue('view.quicks', [nodeDefaultHelper.createDefaultAnswerQickItem(0)], {
              shouldDirty: true,
            });
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  return (
    <div key={values.id}>
      <Collapse label={t('USER_ANSWER')} useSwitch={true} field={'useUtteranceParam'}>
        <div className="m-b-12">
          <span className="subLabel">{t('VARIABLE_SETTING')} </span>
          <span className="required">*</span>
        </div>
        <div className={classnames('input', { 'disabled ': !use })}>
          <div className="m-b-12">
            <FormItem error={errors.view?.utteranceParam}>
              <ParameterSelector
                control={control}
                path="view.utteranceParam"
                placeholder={t('INPUT_VARIABLE_PLACEHOLDER')}
                isDisabled={!use}
                maxLength={50}
              />
            </FormItem>
          </div>
          {use && (
            <>
              <div className="m-b-12">
                <span className="subLabel">{t(`SET_CONNECT_NEXT_NODE`)} </span>
                <span className="required">*</span>
              </div>
              <FormItem error={errors.nextNodeId}>
                <SelectNode
                  fieldName={'nextNodeId'}
                  nodeId={getValues().id}
                  error={errors.nextNodeId}
                />
              </FormItem>
            </>
          )}
        </div>
      </Collapse>
      <QuicksEdit />
    </div>
  );
};
