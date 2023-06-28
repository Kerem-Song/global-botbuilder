import { Collapse, FormItem } from '@components';
import { useNodeEditSave, usePage } from '@hooks';
import { useVariableSelectClient } from '@hooks/client/variableSelectClient';
import { IGNodeEditModel, VariableKind } from '@models';
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

  const {
    getVariableSelectListQuery: { data },
  } = useVariableSelectClient();

  const parameters: IParameterSelect[] = data
    ? data
        .filter((x) => x.kind === VariableKind.Parameter)
        .map((v) => {
          return {
            label: v.name,
            value: v.usingName,
          };
        })
    : [];

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
  console.log('answer node edit view', getValues().view);
  return (
    <>
      <Collapse label={t('USER_ANSWER')} useSwitch={true} field={'useUtteranceParam'}>
        <div className="m-b-8">
          <span className="subLabel">{t('VARIABLE_SETTING')} </span>
          <span className="required">*</span>
        </div>
        <div className={classnames('input', { 'disabled ': !use })}>
          <div className="m-b-8">
            <FormItem error={errors.view?.utteranceParam}>
              <ParameterSelector
                control={control}
                path="view.utteranceParam"
                placeholder={t('INPUT_VARIABLE_PLACEHOLDER')}
                isDisabled={!use}
              />
            </FormItem>
          </div>
          {use && (
            <>
              <div className="m-b-8">
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
    </>
  );
};
